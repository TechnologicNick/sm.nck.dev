import { stringify } from "uuid";

export default class Uuid {

  blob: Uint8Array;

  constructor(blob?: Uint8Array) {
    this.blob = blob ?? new Uint8Array(16);
    
    if (this.blob.length !== 16) {
      throw new Error(`Incorrect Uint8Array length: ${this.blob.length}`);
    }
  }

  tostring() {
    return stringify(this.blob);
  }
    
}
