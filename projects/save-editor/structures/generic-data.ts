import Uuid from "./uuid";
import { LZ4 } from "../components/Lz4Context";
import { IDeserializable } from "./deserializable";

export interface IGenericData {
  uid: Uuid;
  channel: number;
  key: number;
  worldId: number;
  flags: number;
  compressedSize: number;
  data: Buffer;
}

export default class GenericData implements IGenericData, IDeserializable<GenericData> {

  uid: Uuid = Uuid.NIL;
  channel: number = 4;
  key: number = 0;
  worldId: number = 65534;
  flags: number = 0;
  compressedSize: number = 0;
  data: Buffer = Buffer.of();

  static deserialize(buffer: Buffer) {

    const uid = new Uuid(buffer.slice(0, 16));
    const channel = buffer.readUInt16BE(0x10);
    const key = buffer.readUInt32LE(0x12);
    const worldId = buffer.readUInt16BE(0x16);
    const flags = buffer.readUInt32LE(0x18);
    const compressedSize = buffer.readUInt8(0x1C);

    const uncompressed = Buffer.alloc(128);
    const compressed = Buffer.from(buffer.slice(0x1D));
    const size = LZ4.decodeBlock(compressed, uncompressed);
    const data = Buffer.from(uncompressed.slice(0, size));

    return new GenericData({
      uid,
      channel,
      key,
      worldId,
      flags,
      compressedSize,
      data,
    })
  }

  constructor(base: Partial<IGenericData>) {
    Object.assign(this, base);
  }

  serialize() {
    const compressed = Buffer.alloc(this.data.length);
    const uncompressed = Buffer.from(this.data);
    const size = LZ4.encodeBlock(uncompressed, compressed);
    const data = Buffer.from(compressed.slice(0, size));

    const buffer = Buffer.alloc(0x1D + data.length);

    Buffer.from(this.uid.blob).copy(buffer, 0, 0, 16);
    buffer.writeUInt16BE(this.channel, 0x10);
    buffer.writeUInt32LE(this.key, 0x12);
    buffer.writeUInt16BE(this.worldId, 0x16);
    buffer.writeUInt32LE(this.flags, 0x18);
    buffer.writeUInt8(this.compressedSize, 0x1C);
    data.copy(buffer, 0x1D);

    return buffer;
  }
}
