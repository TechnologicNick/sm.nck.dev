import type { decodeBlock as decodeBlockType, encodeBlock as encodeBlockType } from "lz4";

// @ts-ignore
import { compress, uncompress } from "https://raw.githubusercontent.com/pierrec/node-lz4/master/lib/binding.js";
import "!!null-loader!https://raw.githubusercontent.com/pierrec/node-lz4/master/LICENSE";

export const decodeBlock = uncompress as typeof decodeBlockType;
export const encodeBlock = compress as typeof encodeBlockType;

console.log({ decodeBlock, encodeBlock });
