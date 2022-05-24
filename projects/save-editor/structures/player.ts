import Uuid from "./uuid";
import { LZ4 } from "../components/Lz4Context";
import GenericData, { IGenericData } from "./generic-data";
import { IDeserializable } from "./deserializable";

export interface IPlayer extends IGenericData {
  worldId: number;
  z: number;
  y: number;
  x: number;
  unknown0x0E: Buffer;
  yaw: number;
  pitch: number;
  steamId64: bigint;
  inventoryContainerId: number;
  unknown0x2E: number;
  unknown0x32: number;
}

export default class Player extends GenericData implements IPlayer, IDeserializable<IPlayer> {

  worldId: number = 1;
  z: number = 0;
  y: number = 0;
  x: number = 0;
  unknown0x0E: Buffer = Buffer.alloc(12);
  yaw: number = 0;
  pitch: number = 0;
  steamId64: bigint = BigInt(0);
  inventoryContainerId: number = 0;
  unknown0x2E: number = 0;
  unknown0x32: number = 0xFFFFFFFF;

  static deserialize(buffer: Buffer) {
    const base = super.deserialize(buffer);

    const worldId = base.data.readUInt16BE(0x00);
    const z = base.data.readFloatBE(0x02);
    const y = base.data.readFloatBE(0x06);
    const x = base.data.readFloatBE(0x0A);
    const unknown0x0E = base.data.slice(0x0E, 0x0E + 12);
    const yaw = base.data.readFloatBE(0x1A);
    const pitch = base.data.readFloatBE(0x1E);
    const steamId64 = BigInt(`0x${base.data.slice(0x22, 0x22 + 8).toString("hex")}`);
    const inventoryContainerId = base.data.readUInt32BE(0x2A);
    const unknown0x2E = base.data.readUInt32BE(0x2E);
    const unknown0x32 = base.data.readUInt32BE(0x32);

    return new Player({
      ...base,
      worldId,
      z,
      y,
      x,
      unknown0x0E,
      yaw,
      pitch,
      steamId64,
      inventoryContainerId,
      unknown0x2E,
      unknown0x32,
    })
  }

  constructor(base: Partial<IGenericData & IPlayer>) {
    super(base);
    Object.assign(this, base);
  }
}
