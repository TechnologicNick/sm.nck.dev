import { XMLParser } from "fast-xml-parser";
import { PNG } from "pngjs";

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

export const cropResourceImage = (parsedResourceImageSetPng: PNG, bounds: Bounds) => {
  const image = new PNG({ width: bounds.w, height: bounds.h });
  PNG.bitblt(parsedResourceImageSetPng, image, bounds.x, bounds.y, bounds.w, bounds.h, 0, 0);

  return PNG.sync.write(image);
}
