import { useActualUuid } from "./mocks";

useActualUuid();

import Uuid from "../uuid";
import type { IMods } from "./../mods";

describe("Mods", () => {
  let Mods: typeof import("./../mods").default;

  beforeAll(async () => {
    Mods = (await import("./../mods")).default;
  })

  test("deserialize", async () => {
    const buffer = Buffer.from("0000000300000000341239a07e4259a3e692afaa544d323d268393400000000033eca23ec63fdbdeded36d883948e244361ba8de00000000a7cba862947ea54da01a2da59840c81a1722c8f9", "hex");
    const actual = Mods.deserialize(buffer);

    expect(actual).toEqual<IMods>({
      size: 3,
      ugcItems: [
        {
          fileId: BigInt(873609632),
          localId: Uuid.parse("40938326-3d32-4d54-aaaf-92e6a359427e"),
        },
        {
          fileId: BigInt(871146046),
          localId: Uuid.parse("dea81b36-44e2-4839-886d-d3dededb3fc6"),
        },
        {
          fileId: BigInt(2815141986),
          localId: Uuid.parse("f9c82217-1ac8-4098-a52d-1aa04da57e94"),
        },
      ],
    })
  });

  test("serialize", async () => {
    const expected = Buffer.from("0000000300000000341239a07e4259a3e692afaa544d323d268393400000000033eca23ec63fdbdeded36d883948e244361ba8de00000000a7cba862947ea54da01a2da59840c81a1722c8f9", "hex");
    const mods = new Mods({
      size: 3,
      ugcItems: [
        {
          fileId: BigInt(873609632),
          localId: Uuid.parse("40938326-3d32-4d54-aaaf-92e6a359427e"),
        },
        {
          fileId: BigInt(871146046),
          localId: Uuid.parse("dea81b36-44e2-4839-886d-d3dededb3fc6"),
        },
        {
          fileId: BigInt(2815141986),
          localId: Uuid.parse("f9c82217-1ac8-4098-a52d-1aa04da57e94"),
        },
      ],
    });

    expect(mods.serialize()).toEqual(expected);
  })
});
