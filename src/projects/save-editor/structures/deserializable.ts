

export interface IDeserializable<T> {
}

export namespace IDeserializable {
  export function deserialize<T>(buffer: Buffer): T {
    return {} as T;
  }
}
