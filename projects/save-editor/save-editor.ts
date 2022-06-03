import initSqlJs, { Database, SqlJsStatic } from "sql.js";
import Player from "./structures/player";

export let SQL: SqlJsStatic;

export const initSql = async () => {
  return SQL ??= await initSqlJs({
    locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
  });
}

const parameters = (count: number) => "?, ".repeat(count).replace(/, $/, "");

export default class SaveEditor {

  file: File;
  db!: Database;

  constructor(file: File) {
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
    this.db.exec(`DELETE FROM GenericData WHERE worldId = 65534 AND flags = 3 AND key IN (${parameters(players.length)})`, players.map(player => {
      let buffer = Buffer.alloc(4);
      buffer.writeUInt32LE(player.key);
      return buffer;
    }));

    return this.db.getRowsModified();
  }
}
