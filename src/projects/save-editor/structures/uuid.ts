import { stringify, parse as uuidparse, v4 as uuidv4 } from "uuid";

export default class Uuid {

  blob: Uint8Array;

  constructor(blob?: Uint8Array, reverse = false) {
    this.blob = blob ? Uint8Array.from(blob) : new Uint8Array(16);
    
    if (this.blob.length !== 16) {
      throw new Error(`Incorrect Uint8Array length: ${this.blob.length}`);
    }

    if (reverse) {
      this.blob.reverse();
    }

    Object.freeze(this);
  }

  toString() {
    return stringify(this.blob);
  }

  getReversedBlob() {
    const reversed = Uint8Array.from(this.blob);
    reversed.reverse();
    return reversed;
  }
    
  static NIL = new Uuid();

  static randomUuid = () => new Uuid(uuidparse(uuidv4()) as Uint8Array);

  static parse = (string: string) => new Uuid(uuidparse(string) as Uint8Array);
}
