import { IDeserializable } from "./deserializable";
import ItemStack, { IItemStack } from "./item-stack";
import Uuid from "./uuid";

export interface IContainer {
  unknown0x00: number;
  unknown0x01: number;
  id: number;
  size: number;
  stackSize: number;
  items: IItemStack[];
  filterCount: number;
  filterUuids: Uuid[];
}

export default class Container implements IContainer, IDeserializable<IContainer> {

  unknown0x00: number = 4;
  unknown0x01: number = 1;
  id: number = 0;
  size: number = 0;
  stackSize: number = 0xFFFF;
  items: IItemStack[] = [];
  filterCount: number = 0;
  filterUuids: Uuid[] = [];
  
  static deserialize(buffer: Buffer) {

    const unknown0x00 = buffer.readUInt8(0x00);
    const unknown0x01 = buffer.readUInt16BE(0x01);
    const id = buffer.readUInt32BE(0x03);
    const size = buffer.readUInt16BE(0x07);
    const stackSize = buffer.readUInt16BE(0x09);
    const items: IItemStack[] = [];
    for (let index = 0x0B, i = 0; i < size; index += ItemStack.sizeof, i++) {
      const item = ItemStack.deserialize(buffer.slice(index, index + ItemStack.sizeof));
      items.push(item);
    }
    const filterCount = buffer.readUInt16BE(0x0B + (ItemStack.sizeof * size));
    const filterUuids: Uuid[] = [];
    for (let index = 0x0D + (ItemStack.sizeof * size), i = 0; i < filterCount; index += Uuid.sizeof, i++) {
      const uuid = new Uuid(buffer.slice(index, index + Uuid.sizeof));
      filterUuids.push(uuid);
    }

    return new Container({
      unknown0x00,
      unknown0x01,
      id,
      size,
      stackSize,
      items,
      filterCount,
      filterUuids,
    })
  }

  constructor(base: Partial<IContainer>) {
    Object.assign(this, base);
  }

  serialize() {
    const buffer = Buffer.alloc(0x0D + (ItemStack.sizeof * this.size) + (Uuid.sizeof * this.filterCount));

    buffer.writeUInt8(this.unknown0x00, 0x00);
    buffer.writeUInt16BE(this.unknown0x01, 0x01);
    buffer.writeUInt32BE(this.id, 0x03);
    buffer.writeUInt16BE(this.size, 0x07);
    buffer.writeUInt16BE(this.stackSize, 0x09);
    for (let index = 0x0B, i = 0; i < this.size; index += ItemStack.sizeof, i++) {
      const item = new ItemStack(this.items[i]);
      item.serialize().copy(buffer, index);
    }
    buffer.writeUInt16BE(this.filterCount, 0x0B + (ItemStack.sizeof * this.size));
    for (let index = 0x0D + (ItemStack.sizeof * this.size), i = 0; i < this.filterCount; index += Uuid.sizeof, i++) {
      const uuid = this.filterUuids[i];
      Buffer.from(uuid.blob).copy(buffer, index);
    }

    return buffer;
  }
}
