import GenericData, { IGenericData } from "./generic-data";
import { IDeserializable } from "./deserializable";

export interface IPlayer extends IGenericData {
  characterWorldId: number;
  z: number;
  y: number;
  x: number;
  unknown0x0E: Buffer;
  yaw: number;
  pitch: number;
  steamId64: bigint;
  inventoryContainerId: number;
  carryContainerId: number;
  unknown0x32: number;
}

export default class Player extends GenericData implements IPlayer, IDeserializable<IPlayer> {

  characterWorldId: number = 1;
  z: number = 0;
  y: number = 0;
  x: number = 0;
  unknown0x0E: Buffer = Buffer.alloc(12);
  yaw: number = 0;
  pitch: number = 0;
  steamId64: bigint = BigInt(0);
  inventoryContainerId: number = 0;
  carryContainerId: number = 0;
  unknown0x32: number = 0xFFFFFFFF;

  static deserialize(buffer: Buffer) {
    const base = super.deserialize(buffer);

    const characterWorldId = base.data.readUInt16BE(0x00);
    const z = base.data.readFloatBE(0x02);
    const y = base.data.readFloatBE(0x06);
    const x = base.data.readFloatBE(0x0A);
    const unknown0x0E = Buffer.from(base.data.slice(0x0E, 0x0E + 12));
    const yaw = base.data.readFloatBE(0x1A);
    const pitch = base.data.readFloatBE(0x1E);
    const steamId64 = BigInt(`0x${base.data.slice(0x22, 0x22 + 8).toString("hex")}`);
    const inventoryContainerId = base.data.readUInt32BE(0x2A);
    const carryContainerId = base.data.readUInt32BE(0x2E);
    const unknown0x32 = base.data.readUInt32BE(0x32);

    return new Player({
      ...base,
      characterWorldId,
      z,
      y,
      x,
      unknown0x0E,
      yaw,
      pitch,
      steamId64,
      inventoryContainerId,
      carryContainerId,
      unknown0x32,
    })
  }

  constructor(base: Partial<IGenericData & IPlayer>) {
    super(base);
    Object.assign(this, base);
  }

  serialize() {
    const buffer = Buffer.alloc(0x36);

    buffer.writeUInt16BE(this.characterWorldId, 0x00);
    buffer.writeFloatBE(this.z, 0x02);
    buffer.writeFloatBE(this.y, 0x06);
    buffer.writeFloatBE(this.x, 0x0A);
    this.unknown0x0E.copy(buffer, 0x0E);
    buffer.writeFloatBE(this.yaw, 0x1A);
    buffer.writeFloatBE(this.pitch, 0x1E);
    Buffer.from(this.steamId64.toString(16).padStart(16, "0"), "hex").copy(buffer, 0x22, 0, 8);
    buffer.writeUInt32BE(this.inventoryContainerId, 0x2A);
    buffer.writeUInt32BE(this.carryContainerId, 0x2E);
    buffer.writeUInt32BE(this.unknown0x32, 0x32);

    this.data = buffer;

    return super.serialize();
  }
}
