import Uuid from "../uuid";
import ItemStack, { IItemStack } from "./../item-stack";
import { describe, expect, test } from "vitest";

describe("ItemStack", () => {
  test("deserialize", async () => {
    const buffer = Buffer.from("36961F8AC7DBEF83BB421CBC0E018433000000060001", "hex");
    const actual = ItemStack.deserialize(buffer);

    expect(actual).toEqual<IItemStack>({
      uuid: Uuid.parse("3384010e-bc1c-42bb-83ef-dbc78a1f9636"),
      instanceId: 6,
      quantity: 1,
    })
  });

  test("serialize", async () => {
    const expected = Buffer.from("36961F8AC7DBEF83BB421CBC0E018433000000060001", "hex");
    const itemStack = new ItemStack({
      uuid: Uuid.parse("3384010e-bc1c-42bb-83ef-dbc78a1f9636"),
      instanceId: 6,
      quantity: 1,
    });

    expect(itemStack.serialize()).toEqual(expected);
  })
});
