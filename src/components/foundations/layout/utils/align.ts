import { Space } from "../../../../theme";

export const getNegativeMargin = (spaces: Record<Space, number>) => (
  space: ResponsiveProp<Space>
) => ({
  args: space,
  map: (args: ResponsiveProp<Space>) => {
    return Array.isArray(args)
      ? args.map(arg => spaces[arg] * -1)
      : spaces[args] * -1;
  },
});

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
      return "flex-start";
    case "right":
    case "bottom":
      return "flex-end";
    case "center":
      return "center";
    default:
      return "flex-start";
  }
};
