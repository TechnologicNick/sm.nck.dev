import GenericData, { IGenericData } from "./generic-data";
import { IDeserializable } from "./deserializable";

export interface IWorld extends IGenericData {
  seed: number;
  filename: string;
  classname: string;
  terrainParams: string;
}

export default class World extends GenericData implements IWorld, IDeserializable<IWorld> {

  seed: number = 0;
  filename: string = "";
  classname: string = "";
  terrainParams: string = "";

  static deserializeData(data: Buffer) {
    let offset = 0x00;

    const readNextLengthString = () => {
      const length = data.readUInt16BE(offset);
      offset += 0x02;

      const string = data.subarray(offset, offset + length);
      offset += length;

      return string.toString();
    };

    const seed = data.readUInt32BE(0x00);
    offset += 0x04;

    const filename = readNextLengthString();
    const classname = readNextLengthString();
    const terrainParams = readNextLengthString();

    return {
      seed,
      filename,
      classname,
      terrainParams,
    }
  }

  static deserialize(buffer: Buffer) {
    const base = super.deserialize(buffer);

    return new World({
      ...base,
      ...World.deserializeData(base.data),
    })
  }

  constructor(base: Partial<IGenericData & IWorld>) {
    super(base);
    Object.assign(this, base);
  }

  serializeData() {
    const buffer = Buffer.alloc(0x04 + 3 * 0x02 + Buffer.byteLength(this.filename) + Buffer.byteLength(this.classname) + Buffer.byteLength(this.terrainParams));

    let offset = 0x00;

    const writeNextLengthString = (string: string) => {
      const length = Buffer.byteLength(string);

      buffer.writeUInt16BE(length, offset);
      offset += 0x02;

      buffer.write(string, offset);
      offset += length;
    };

    buffer.writeUInt32BE(this.seed, offset);
    offset += 0x04;

    writeNextLengthString(this.filename);
    writeNextLengthString(this.classname);
    writeNextLengthString(this.terrainParams);

    return buffer;
  }

  serialize() {
    this.data = this.serializeData();

    return super.serialize();
  }
}
