import GenericData, { IGenericData } from "./generic-data";
import { IDeserializable } from "./deserializable";

export interface IWorld extends IGenericData {
  
}

export default class World extends GenericData implements IWorld, IDeserializable<IWorld> {

  

  static deserialize(buffer: Buffer) {
    const base = super.deserialize(buffer);

    console.log(base);

    return new World({
      ...base,
    })
  }

  constructor(base: Partial<IGenericData & IWorld>) {
    super(base);
    Object.assign(this, base);
  }

  serialize() {
    const buffer = Buffer.alloc(0x36);

    

    this.data = buffer;

    return super.serialize();
  }
}
