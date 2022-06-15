import { stringify, parse as uuidparse, v4 as uuidv4 } from "uuid";

export default class Uuid {

  blob: Uint8Array;

  constructor(blob?: Uint8Array) {
    this.blob = blob ? Uint8Array.from(blob) : new Uint8Array(16);
    
    if (this.blob.length !== 16) {
      throw new Error(`Incorrect Uint8Array length: ${this.blob.length}`);
    }

    Object.freeze(this);
  }

  toString() {
    return stringify(this.blob);
  }
    
  static NIL = new Uuid();

  static randomUuid = () => new Uuid(uuidparse(uuidv4()) as Uint8Array);

  static parse = (string: string) => new Uuid(uuidparse(string) as Uint8Array);
}
