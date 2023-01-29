import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
  isArray: (name: string) => name === "Resource" || name === "Group",
});

export type Bounds = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export const parseResourceImageSet = (xml: Buffer) => {
  const resourceImageSet = parser.parse(xml.toString());

  const imageBounds: Record<string, Bounds> = {};
  for (const resource of resourceImageSet.MyGUI.Resource) {
    for (const group of resource.Group) {
      const [w, h] = group["@_size"].split(" ");
      for (const index of group.Index) {
        const [x, y] = index.Frame["@_point"].split(" ");
        imageBounds[index["@_name"]] = {
          x: Number(x),
          y: Number(y),
          w: Number(w),
          h: Number(h),
        };
      }
    }
  }

  return imageBounds;
}
