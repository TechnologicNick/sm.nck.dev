/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { readdirSync } from "fs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    alias: [
      {
        find: "https://raw.githubusercontent.com/pierrec/node-lz4/master/lib/binding.js",
        replacement: (() => {
          const nextLock = "./next.lock/data/https_raw.githubusercontent.com";
          const file = readdirSync(nextLock)
            .find(file => file.match(/pierrec_node-lz4_master_lib_binding_[0-9a-f]{20}\.js/g))!;
          return path.join(nextLock, file);
        })(),
      },
      {
        find: /^!!null-loader!.*/,
        replacement: "utils/empty",
      },
    ]
  },
});
