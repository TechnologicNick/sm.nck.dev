import { jest } from "@jest/globals";
import { readdirSync } from "fs";
import { join } from "path";

export const useActualUuid = () => {
  jest.dontMock("../uuid");
}

export const useActualLz4 = () => {
  jest.unstable_mockModule("./../../../../utils/lz4.ts", () => {
    const nextLock = "./next.lock/data/https_raw.githubusercontent.com";
    const file = readdirSync(nextLock)
        .find(file => file.match(/pierrec_node-lz4_master_lib_binding_[0-9a-f]{20}\.js/g))!;
    
    const { compress, uncompress } = jest.requireActual(join(nextLock, file)) as any;
    return {
        decodeBlock: uncompress,
        encodeBlock: compress,
    }
  });
}
