import Uuid from "../uuid";
import Container, { IContainer } from "./../container";
import { describe, expect, test } from "vitest";

describe("Container", () => {
  test("deserialize", async () => {
    const buffer = Buffer.from("040001000000060005001405e3d41ab896afb18f4b03aa4689d6d4ffffffff001400000000000000000000000000000000ffffffff000000000000000000000000000000000000ffffffff000000000000000000000000000000000000ffffffff000000000000000000000000000000000000ffffffff00000001d4d68946aa034b8fb1af96b81ad4e305", "hex");
    const actual = Container.deserialize(buffer);

    expect(actual).toEqual<IContainer>({
      unknown0x00: 4,
      unknown0x01: 1,
      id: 6,
      size: 5,
      stackSize: 20,
      items: [
        {
          uuid: Uuid.parse("d4d68946-aa03-4b8f-b1af-96b81ad4e305"),
          instanceId: 0xFFFFFFFF,
          quantity: 20,
        },
        {
          uuid: Uuid.NIL,
          instanceId: 0xFFFFFFFF,
          quantity: 0,
        },
        {
          uuid: Uuid.NIL,
          instanceId: 0xFFFFFFFF,
          quantity: 0,
        },
        {
          uuid: Uuid.NIL,
          instanceId: 0xFFFFFFFF,
          quantity: 0,
        },
        {
          uuid: Uuid.NIL,
          instanceId: 0xFFFFFFFF,
          quantity: 0,
        },
      ],
      filterCount: 1,
      filterUuids: [
        Uuid.parse("d4d68946-aa03-4b8f-b1af-96b81ad4e305"),
      ],
    });
  });

  test("serialize", async () => {
    const expected = Buffer.from("040001000000060005001405e3d41ab896afb18f4b03aa4689d6d4ffffffff001400000000000000000000000000000000ffffffff000000000000000000000000000000000000ffffffff000000000000000000000000000000000000ffffffff000000000000000000000000000000000000ffffffff00000001d4d68946aa034b8fb1af96b81ad4e305", "hex");
    const container = new Container({
      unknown0x00: 4,
      unknown0x01: 1,
      id: 6,
      size: 5,
      stackSize: 20,
      items: [
        {
          uuid: Uuid.parse("d4d68946-aa03-4b8f-b1af-96b81ad4e305"),
          instanceId: 0xFFFFFFFF,
          quantity: 20,
        },
        {
          uuid: Uuid.NIL,
          instanceId: 0xFFFFFFFF,
          quantity: 0,
        },
        {
          uuid: Uuid.NIL,
          instanceId: 0xFFFFFFFF,
          quantity: 0,
        },
        {
          uuid: Uuid.NIL,
          instanceId: 0xFFFFFFFF,
          quantity: 0,
        },
        {
          uuid: Uuid.NIL,
          instanceId: 0xFFFFFFFF,
          quantity: 0,
        },
      ],
      filterCount: 1,
      filterUuids: [
        Uuid.parse("d4d68946-aa03-4b8f-b1af-96b81ad4e305"),
      ],
    });

    expect(container.serialize()).toEqual(expected);
  })
});
