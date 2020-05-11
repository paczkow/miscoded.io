type ResponsiveProp<T extends string | number> = T | T[];

type ResponsiveMap<T> = {
  map: (args: ResponsiveProp<T>) => ResponsiveProp<number | string>;
  args: ResponsiveProp<T>;
};

type Display = "none" | "flex" | "block";
type FlexAlign = "flex-start" | "center" | "flex-end";
type FlexWrap = "nowrap" | "wrap";

type AlignX = "left" | "center" | "right";
type AlignY = "top" | "center" | "bottom";

type Align = AlignX | AlignY;
