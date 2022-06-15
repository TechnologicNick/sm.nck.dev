import initSqlJs, { Database, SqlJsStatic } from "sql.js";
import GenericData from "./structures/generic-data";
import Player from "./structures/player";
import Uuid from "./structures/uuid";

export let SQL: SqlJsStatic;

export const initSql = async () => {
  return SQL ??= await initSqlJs({
    locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
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
}
