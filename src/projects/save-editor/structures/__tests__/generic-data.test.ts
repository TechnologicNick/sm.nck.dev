import Uuid from "../uuid";
import GenericData, { IGenericData } from "./../generic-data";
import { describe, expect, test } from "vitest";

describe("GenericData", () => {
  test("deserialize", async () => {
    const buffer = Buffer.from("67ce7fe2f7564898b8f076080146a358000401000000fffe03000000307300023f3851ea0001002336200900f0100000003f920d28bf529608011000010add16f30000000100000002ffffffff", "hex");
    const actual = GenericData.deserialize(buffer);

    expect(actual).toEqual<IGenericData>({
      uid: Uuid.parse("67ce7fe2-f756-4898-b8f0-76080146a358"),
      channel: 4,
      key: 1,
      worldId: 65534,
      flags: 3,
      compressedSize: 48,
      data: Buffer.from("00023f3851ea00000000000000003620000000000000000000003f920d28bf529608011000010add16f30000000100000002ffffffff", "hex"),
    })
  });

  test("serialize", async () => {
    const expected = Buffer.from("67ce7fe2f7564898b8f076080146a358000401000000fffe03000000307300023f3851ea0001002336200900f0100000003f920d28bf529608011000010add16f30000000100000002ffffffff", "hex");
    const genericData = new GenericData({
      uid: Uuid.parse("67ce7fe2-f756-4898-b8f0-76080146a358"),
      channel: 4,
      key: 1,
      worldId: 65534,
      flags: 3,
      compressedSize: 48,
      data: Buffer.from("00023f3851ea00000000000000003620000000000000000000003f920d28bf529608011000010add16f30000000100000002ffffffff", "hex"),
    });

    expect(genericData.serialize()).toEqual(expected);
  })
});
