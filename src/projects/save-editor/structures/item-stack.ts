import { IDeserializable } from "./deserializable";
import Uuid from "./uuid";

export interface IItemStack {
  uuid: Uuid;
  /**
   * The instance id, if the item is a tool, else 0xFFFFFFFF.
   */
  instanceId: number;
  quantity: number;
}

export default class ItemStack implements IItemStack, IDeserializable<IItemStack> {

  static readonly sizeof = 0x16;

  uuid: Uuid = Uuid.NIL;
  instanceId: number = 0xFFFFFFFF;
  quantity: number = 0;
  
  static deserialize(buffer: Buffer) {

    const uuid = new Uuid(buffer.slice(0x00, 0x00 + 16), { reverse: true });
    const instanceId = buffer.readUInt32BE(0x10);
    const quantity = buffer.readUInt16BE(0x14);

    return new ItemStack({
      uuid,
      instanceId,
      quantity,
    })
  }

  constructor(base: Partial<IItemStack>) {
    Object.assign(this, base);
  }

  serialize() {
    const buffer = Buffer.alloc(ItemStack.sizeof);

    Buffer.from(this.uuid.getReversedBlob()).copy(buffer, 0x00, 0, 16);
    buffer.writeUInt32BE(this.instanceId, 0x10);
    buffer.writeUInt16BE(this.quantity, 0x14);

    return buffer;
  }
}
