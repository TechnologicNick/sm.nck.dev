import { stringify, parse, v4 as uuidv4 } from "uuid";

export default class Uuid {

  blob: Uint8Array;

  constructor(blob?: Uint8Array) {
    this.blob = blob ?? new Uint8Array(16);
    
    if (this.blob.length !== 16) {
      throw new Error(`Incorrect Uint8Array length: ${this.blob.length}`);
    }
  }

  toString() {
    return stringify(this.blob);
  }
    
}

export const NIL = new Uuid();

export const randomUuid = () => new Uuid(parse(uuidv4()) as Uint8Array);
