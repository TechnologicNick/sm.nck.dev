import initSqlJs, { Database, SqlJsStatic } from "sql.js";
import SqlJsPackageJson from "sql.js/package.json" ;
import GenericData from "./structures/generic-data";
import Mods from "./structures/mods";
import Player from "./structures/player";
import { IUserGeneratedContent } from "./structures/user-generated-content";
import Uuid from "./structures/uuid";
import GameMode from "./types/game-mode";

export let SQL: SqlJsStatic;

const sqlJsVersion = SqlJsPackageJson.version;

export const initSql = async () => {
  return SQL ??= await initSqlJs({
    locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/${sqlJsVersion}/${file}`
  });
}

const parameters = (count: number) => "?, ".repeat(count).replace(/, $/, "");

const toUInt32LE = (number: number) => {
  let buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(number);
  return buffer;
}

export default class SaveEditor {

  uuid: Uuid;
  file: File;
  db!: Database;

  constructor(file: File) {
    this.uuid = Uuid.randomUuid();
    this.file = file;
  }

  async loadDatabase() {
    await initSql();

    return this.db = new SQL.Database(new Uint8Array(await this.file.arrayBuffer()));
  }

  getVersion() {
    return this.db.exec("SELECT savegameversion FROM Game")[0].values[0][0] as number;
  }

  getAllPlayers() {
    return this.db.exec("SELECT data FROM GenericData WHERE worldId = 65534 AND flags = 3 ORDER BY key ASC")
      .flatMap(result => result.values.map(value => Player.deserialize(Buffer.from(value[0] as Uint8Array))));
  }

  deletePlayers(players: Player[]) {
    this.db.exec(`DELETE FROM GenericData WHERE worldId = 65534 AND flags = 3 AND key IN (${parameters(players.length)})`,
      players.map(player => toUInt32LE(player.key))
    );

    return this.db.getRowsModified();
  }

  deleteAllPlayers() {
    this.db.exec("DELETE FROM GenericData WHERE worldId = 65534 AND flags = 3");

    return this.db.getRowsModified();
  }

  updatePlayer(oldGenericData: GenericData, newPlayer: Player) {
    this.db.exec(
      "UPDATE GenericData SET "+
        "uid = $newUid, " +
        "key = $newKey, " +
        "worldId = $newWorldId, " +
        "flags = $newFlags, " +
        "data = $newData " +
      "WHERE " +
        "uid = $oldUid AND " +
        "key = $oldKey AND " +
        "worldId = $oldWorldId AND " +
        "flags = $oldFlags",
      {
        $newUid: newPlayer.uid.blob,
        $newKey: toUInt32LE(newPlayer.key),
        $newWorldId: newPlayer.worldId,
        $newFlags: newPlayer.flags,
        $newData: newPlayer.serialize(),

        $oldUid: oldGenericData.uid.blob,
        $oldKey: toUInt32LE(oldGenericData.key),
        $oldWorldId: oldGenericData.worldId,
        $oldFlags: oldGenericData.flags,
      }
    );

    const modified = this.db.getRowsModified();

    if (modified === 0) {
      throw new Error(`Failed to find oldGenericData ${JSON.stringify(oldGenericData)}`);
    }

    return modified;
  }

  getGameMode(): GameMode {
    return this.db.exec("SELECT flags FROM Game")[0].values[0][0] as number;
  }

  setGameMode(gameMode: GameMode) {
    this.db.exec("UPDATE Game SET flags = ?", [ gameMode ]);

    const modified = this.db.getRowsModified();

    if (modified === 0) {
      throw new Error(`Failed to set game mode`);
    }

    return modified;
  }

  getUserGeneratedContent() {
    const blob = this.db.exec("SELECT mods FROM Game")[0].values[0][0] as Uint8Array;

    const { ugcItems } = Mods.deserialize(Buffer.from(blob));

    return ugcItems;
  }

  setUserGeneratedContent(ugcItems: IUserGeneratedContent[]) {
    const mods = new Mods({ ugcItems }).serialize();

    this.db.exec("UPDATE Game SET mods = ?", [ mods ]);

    const modified = this.db.getRowsModified();

    if (modified === 0) {
      throw new Error(`Failed to set user generated content`);
    }

    return modified;
  }

  getSeed() {
    return this.db.exec("SELECT seed FROM Game")[0].values[0][0] as number;
  }

  setSeed(seed: number) {
    console.log("setting seed", seed);
    this.db.exec("UPDATE Game SET seed = ?", [ seed ]);

    const modified = this.db.getRowsModified();

    if (modified === 0) {
      throw new Error(`Failed to set seed`);
    }

    return modified;
  }

  getGametick() {
    return this.db.exec("SELECT gametick FROM Game")[0].values[0][0] as number;
  }

  setGametick(gametick: number) {
    this.db.exec("UPDATE Game SET gametick = ?", [ gametick ]);

    const modified = this.db.getRowsModified();

    if (modified === 0) {
      throw new Error(`Failed to set gametick`);
    }

    return modified;
  }
}
