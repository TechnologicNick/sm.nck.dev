import Uuid from "./uuid";
import { LZ4 } from "../components/Lz4Context";

export interface IPlayer {
  uid: Uuid;
  steamId64: BigInt;
}

export default class Player implements IPlayer {

  uid: Uuid;
  steamId64: BigInt;

  static fromCompressedBlob(blob: Uint8Array) {

    const uid = new Uuid(blob.subarray(0, 16));
    const steamId64 = BigInt(0);

    const buffer = Buffer.alloc(64);
    const compressed = Buffer.from(blob.slice(0x1D, blob.length));
    const size = LZ4.decodeBlock(compressed, buffer);
    const uncompressed = buffer.slice(0, size);

    console.log(compressed);
    console.log(uncompressed);
    console.log(compressed.toString("hex"));
    console.log(uncompressed.toString("hex"));

    return new Player({
      uid,
      steamId64,
    })
  }

  constructor({ uid, steamId64 }: IPlayer) {
    this.uid = uid;
    this.steamId64 = steamId64;
  }
}
