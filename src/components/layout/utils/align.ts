export type AlignX = "left" | "center" | "right";
export type AlignY = "top" | "center" | "bottom";

export type Align = AlignX | AlignY;

export const toFlexXAlign = (align: ResponsiveProp<AlignX>) =>
  toFlexAlign(align);

export const toFlexYAlign = (align: ResponsiveProp<AlignY>) =>
  toFlexAlign(align);

const toFlexAlign = (align: ResponsiveProp<Align>) => {
  if (Array.isArray(align)) {
    return align.map(alignValue => toFlexAlignValue(alignValue));
  } else {
    return toFlexAlignValue(align);
  }
};

const toFlexAlignValue = (alignValue: Align) => {
  switch (alignValue) {
    case "left":
    case "top":
      return "flexStart";
    case "right":
    case "bottom":
      return "flexEnd";
    case "center":
      return "center";
  }
};
