import { IDeserializable } from "./deserializable";
import UserGeneratedContent, { IUserGeneratedContent } from "./user-generated-content";

export interface IMods {
  size: number;
  ugcItems: IUserGeneratedContent[];
}

export default class Mods implements IMods, IDeserializable<IMods> {

  size: number = 0;
  ugcItems: IUserGeneratedContent[] = [];
  
  static deserialize(buffer: Buffer) {

    const size = buffer.readInt32BE(0x00);
    const ugcItems: IUserGeneratedContent[] = [];
    for (let index = 0x04; index < buffer.length; index += 0x18) {
      const item = UserGeneratedContent.deserialize(buffer.slice(index, index + 0x18));
      ugcItems.push(item);
    }

    return new Mods({
      size,
      ugcItems,
    })
  }

  constructor(base: Partial<IMods>) {
    Object.assign(this, base);
  }

  serialize() {
    this.size = this.ugcItems.length;

    const buffer = Buffer.alloc(0x04 + this.size * 0x18);

    buffer.writeInt32BE(this.size);
    this.ugcItems.forEach((item, index) => {
      new UserGeneratedContent(item)
        .serialize()
        .copy(buffer, 0x04 + index * 0x18, 0x00, 0x18);
    })

    return buffer;
  }
}
