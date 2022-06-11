import { jest } from "@jest/globals";

jest.dontMock("../uuid");
jest.unstable_mockModule("./../../components/Lz4Context", () => ({
  LZ4: jest.requireActual("lz4"),
}));

import Uuid from "../uuid";
import type { IGenericData } from "./../generic-data";

describe("GenericData", () => {
  test("deserialize", async () => {
    const { default: GenericData } = await import("./../generic-data");

    const buffer = Buffer.from("67ce7fe2f7564898b8f076080146a358000401000000fffe03000000307300023f3851ea0001002336200900f0100000003f920d28bf529608011000010add16f30000000100000002ffffffff", "hex");
    const actual = GenericData.deserialize(buffer);

    expect(actual).toMatchObject<IGenericData>({
      uid: Uuid.parse("67ce7fe2-f756-4898-b8f0-76080146a358"),
      channel: 4,
      key: 1,
      worldId: 65534,
      flags: 3,
      compressedSize: 48,
      data: Buffer.from("00023f3851ea00000000000000003620000000000000000000003f920d28bf529608011000010add16f30000000100000002ffffffff", "hex"),
    })
  });
});
