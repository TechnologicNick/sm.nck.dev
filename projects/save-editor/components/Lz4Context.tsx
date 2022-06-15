import { ReactNode, useState } from "react";
import Script from "next/script";
import type { createDecoderStream, createEncoderStream, decode, encode, decodeBlock, encodeBound, encodeBlock, encodeBlockHC } from "lz4";

export let LZ4: {
  EOS: 0;
  EOS_BUFFER: Uint8Array;
  MAGICNUMBER: 407708164;
  MAGICNUMBER_BUFFER: Uint8Array;
  MAGICNUMBER_SKIPPABLE: 407710288;
  SIZES: {
    CHECKSUM: 4;
    DATABLOCK_CHECKSUM: 4;
    DATABLOCK_SIZE: 4;
    DESCRIPTOR: 2;
    DESCRIPTOR_CHECKSUM: 1;
    DICTID: 4;
    EOS: 4;
    MAGIC: 4;
    SIZE: 8;
    SKIP_SIZE: 4;
  };
  STATES: {
    MAGIC: 0;
    DESCRIPTOR: 1;
    SIZE: 2;
    DICTID: 3;
    DESCRIPTOR_CHECKSUM: 4;
    DATABLOCK_SIZE: 5;
    DATABLOCK_DATA: 6;
    DATABLOCK_CHECKSUM: 7;
    DATABLOCK_UNCOMPRESS: 8;
    DATABLOCK_COMPRESS: 9;
    CHECKSUM: 10;
    CHECKSUM_UPDATE: 11;
    EOS: 90;
    SKIP_DATA: 102;
    SKIP_SIZE: 101;
  };
  VERSION: 1;
  blockMaxSizes: [null, null, null, null, 65536, 262144, 1048576, 4194304];
  createDecoderStream: typeof createDecoderStream;
  createEncoderStream: typeof createEncoderStream;
  decode: typeof decode;
  encode: typeof encode;
  decodeBlock: typeof decodeBlock;
  encodeBound: typeof encodeBound;
  encodeBlock: typeof encodeBlock;
  encodeBlockHC: typeof encodeBlockHC;
  extension: ".lz4";
  utils: any;
  version: "0.5.1";
};

const Lz4Context = ({ children }: { children: ReactNode }) => {
  const [lz4, setLZ4] = useState(LZ4);

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/lz4@0.6.5/build/lz4.js" onLoad={() => setLZ4(LZ4 = window.require("lz4"))}/>
      {lz4 && children}
    </>
  )
}

export default Lz4Context;
