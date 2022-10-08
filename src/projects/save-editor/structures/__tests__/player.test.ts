import Uuid from "../uuid";
import Player, { IPlayer } from "../player";
import { describe, expect, test } from "vitest";

describe("Player", () => {
  test("deserialize", async () => {
    const buffer = Buffer.from("67ce7fe2f7564898b8f076080146a358000401000000fffe0300000033f50200023f3851444048f5c343d258523620000100f00d3f920cf2bf529889011000010add16f30000000100000002ffffffff", "hex");
    const actual = Player.deserialize(buffer);

    expect(actual).toEqual<IPlayer>({
      uid: Uuid.parse("67ce7fe2-f756-4898-b8f0-76080146a358"),
      channel: 4,
      key: 1,
      worldId: 65534,
      flags: 3,
      compressedSize: 51,
      data: expect.any(Buffer),

      characterWorldId: 2,
      z: 0.7199900150299072,
      y: 3.140000104904175,
      x: 420.69000244140625,
      unknown0x0E: Buffer.from("362000000000000000000000", "hex"),
      yaw: 1.1410200595855713,
      pitch: -0.8226400017738342,
      steamId64: BigInt("76561198142527219"),
      inventoryContainerId: 1,
      unknown0x2E: 2,
      unknown0x32: 0xFFFFFFFF,
    })
  });

  test("serialize", async () => {
    const expected = Buffer.from("67ce7fe2f7564898b8f076080146a358000401000000fffe0300000033f50200023f3851444048f5c343d258523620000100f00d3f920cf2bf529889011000010add16f30000000100000002ffffffff", "hex");
    const player = new Player({
      uid: Uuid.parse("67ce7fe2-f756-4898-b8f0-76080146a358"),
      channel: 4,
      key: 1,
      worldId: 65534,
      flags: 3,
      compressedSize: 48,

      characterWorldId: 2,
      z: 0.71999,
      y: 3.14,
      x: 420.69,
      unknown0x0E: Buffer.from("362000000000000000000000", "hex"),
      yaw: 1.14102,
      pitch: -0.8226400017738342,
      steamId64: BigInt("76561198142527219"),
      inventoryContainerId: 1,
      unknown0x2E: 2,
      unknown0x32: 0xFFFFFFFF,
    });

    expect(player.serialize()).toEqual(expected);
  })
});
