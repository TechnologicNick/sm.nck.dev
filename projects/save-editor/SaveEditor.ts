import initSqlJs, { Database, SqlJsStatic } from "sql.js";

export let SQL: SqlJsStatic;

export const initSql = async () => {
  return SQL ??= await initSqlJs({
    locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`
  });
}

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
}
