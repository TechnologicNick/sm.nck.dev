import Uuid from "./uuid";
import { LZ4 } from "../components/Lz4Context";
import GenericData, { IGenericData } from "./generic-data";
import { IDeserializable } from "./deserializable";

export interface IPlayer extends IGenericData {
  steamId64: BigInt;
}

export default class Player extends GenericData implements IPlayer, IDeserializable<IPlayer> {

  steamId64: BigInt = BigInt(0);

  static deserialize(buffer: Buffer) {
    const base = super.deserialize(buffer);

    return new Player({
      ...base,
    })
  }

  constructor(base: Partial<IGenericData & IPlayer>) {
    super(base);
  }
}
