import { stringify, parse as uuidparse, v4 as uuidv4 } from "uuid";

interface UuidOptions {
  reverse?: boolean;
  unsafe?: boolean;
}

export default class Uuid {

  blob: Uint8Array;
  options: UuidOptions = {
    reverse: false,
    unsafe: false,
  };

  constructor(blob?: Uint8Array, options?: UuidOptions) {
    this.blob = blob ? Uint8Array.from(blob) : new Uint8Array(16);
    Object.assign(this.options, options);
    
    if (this.blob.length !== 16) {
      throw new Error(`Incorrect Uint8Array length: ${this.blob.length}`);
    }

    if (this.options.reverse) {
      this.blob.reverse();
    }

    Object.freeze(this);
  }

  toString() {
    if (!this.options.unsafe) {
      return stringify(this.blob);
    }

    const hex = (byte: number) => byte.toString(16).padStart(2, "0");

    return (
      hex(this.blob[0]) +
      hex(this.blob[1]) +
      hex(this.blob[2]) +
      hex(this.blob[3]) +
      "-" +
      hex(this.blob[4]) +
      hex(this.blob[5]) +
      "-" +
      hex(this.blob[6]) +
      hex(this.blob[7]) +
      "-" +
      hex(this.blob[8]) +
      hex(this.blob[9]) +
      "-" +
      hex(this.blob[10]) +
      hex(this.blob[11]) +
      hex(this.blob[12]) +
      hex(this.blob[13]) +
      hex(this.blob[14]) +
      hex(this.blob[15])
    );
  }

  getReversedBlob() {
    const reversed = Uint8Array.from(this.blob);
    reversed.reverse();
    return reversed;
  }
    
  static NIL = new Uuid();

  static randomUuid = () => new Uuid(uuidparse(uuidv4()) as Uint8Array);

  static parse = (string: string, options?: { unsafe?: boolean } ) => {
    if (!options?.unsafe) {
      return new Uuid(uuidparse(string) as Uint8Array)
    }
    
    if (!string.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      throw new TypeError("Invalid UUID");
    }

    const blob = new Uint8Array(16);
    for (let i = 0; i < 16; i++) {
      const start = i * 2;
      blob[i] = parseInt(string.substring(start, start + 2), 16);
    }
    return new Uuid(blob, { unsafe: true });
  };
}
