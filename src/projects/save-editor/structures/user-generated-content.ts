import { IDeserializable } from "./deserializable";
import Uuid from "./uuid";

export interface IUserGeneratedContent {
  fileId: bigint;
  localId: Uuid;
}

export default class UserGeneratedContent implements IUserGeneratedContent, IDeserializable<IUserGeneratedContent> {

  fileId: bigint = BigInt(0);
  localId: Uuid = Uuid.NIL;
  
  static deserialize(buffer: Buffer) {

    const fileId = BigInt(`0x${buffer.slice(0x00, 0x00 + 8).toString("hex")}`);
    const localId = new Uuid(buffer.slice(0x08, 0x08 + 16), { reverse: true, unsafe: true });

    return new UserGeneratedContent({
      fileId,
      localId,
    })
  }

  constructor(base: Partial<IUserGeneratedContent>) {
    Object.assign(this, base);
  }

  serialize() {
    const buffer = Buffer.alloc(0x18);

    Buffer.from(this.fileId.toString(16).padStart(16, "0"), "hex").copy(buffer, 0x00, 0, 8);
    Buffer.from(this.localId.getReversedBlob()).copy(buffer, 0x08, 0, 16);

    return buffer;
  }
}
