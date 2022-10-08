import Uuid from "../uuid";
import UserGeneratedContent, { IUserGeneratedContent } from "./../user-generated-content";
import { describe, expect, test } from "vitest";

describe("UserGeneratedContent", () => {
  test("deserialize", async () => {
    const buffer = Buffer.from("00000000a7cba862947ea54da01a2da59840c81a1722c8f9", "hex");
    const actual = UserGeneratedContent.deserialize(buffer);

    expect(actual).toEqual<IUserGeneratedContent>({
      fileId: BigInt(2815141986),
      localId: Uuid.parse("f9c82217-1ac8-4098-a52d-1aa04da57e94"),
    })
  });

  test("serialize", async () => {
    const expected = Buffer.from("00000000a7cba862947ea54da01a2da59840c81a1722c8f9", "hex");
    const userGeneratedContent = new UserGeneratedContent({
      fileId: BigInt(2815141986),
      localId: Uuid.parse("f9c82217-1ac8-4098-a52d-1aa04da57e94"),
    });

    expect(userGeneratedContent.serialize()).toEqual(expected);
  })
});
