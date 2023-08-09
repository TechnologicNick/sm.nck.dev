import World, { IWorld } from "../world";
import { describe, expect, test } from "vitest";
import type { IGenericData } from "../generic-data";

describe("World", () => {
  test("deserializeData", async () => {
    const buffer = Buffer.from("1ae9277b003024535552564956414c5f444154412f536372697074732f67616d652f776f726c64732f4f766572776f726c642e6c756100094f766572776f726c6400056e756c6c0a0000000000000000", "hex");
    const actual = World.deserializeData(buffer);

    expect(actual).toEqual<Omit<IWorld, keyof IGenericData>>({
      seed: 451487611,
      filename: "$SURVIVAL_DATA/Scripts/game/worlds/Overworld.lua",
      classname: "Overworld",
      terrainParams: "null\n",
    })
  });

  test("serialize", async () => {
    const expected = Buffer.from("1ae9277b003024535552564956414c5f444154412f536372697074732f67616d652f776f726c64732f4f766572776f726c642e6c756100094f766572776f726c6400056e756c6c0a0000000000000000", "hex");
    const player = new World({
      seed: 451487611,
      filename: "$SURVIVAL_DATA/Scripts/game/worlds/Overworld.lua",
      classname: "Overworld",
      terrainParams: "null\n",
    });

    // Padding at the end of the buffer is allowed
    expect(expected.toString("hex").startsWith(player.serializeData()?.toString("hex"))).toBeTruthy();
  });
});
