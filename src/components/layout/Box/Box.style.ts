import { Space } from "../../../theme";
import { isMapObject } from "../utils/responsiveProp";

export interface BoxProps {
  width?: ResponsiveProp<number>;
  height?: ResponsiveProp<number>;
  padding?: ResponsiveProp<Space>;
  paddingX?: ResponsiveProp<Space>;
  paddingY?: ResponsiveProp<Space> | ResponsiveMap<Space>;
  paddingTop?: ResponsiveProp<Space> | ResponsiveMap<Space>;
  paddingBottom?: ResponsiveProp<Space>;
  paddingLeft?: ResponsiveProp<Space> | ResponsiveMap<Space>;
  paddingRight?: ResponsiveProp<Space>;
  margin?: ResponsiveProp<Space>;
  marginX?: ResponsiveProp<Space>;
  marginY?: ResponsiveProp<Space>;
  marginTop?: ResponsiveProp<Space> | ResponsiveMap<Space>;
  marginBottom?: ResponsiveProp<Space>;
  marginLeft?: ResponsiveProp<Space> | ResponsiveMap<Space>;
  marginRight?: ResponsiveProp<Space>;
  display?: ResponsiveProp<Display>;
  justifyContent?: ResponsiveProp<FlexAlign>;
  alignItems?: ResponsiveProp<FlexAlign>;
  flexWrap?: FlexWrap;
  background?: string;
  color?: string;
}

type BoxResponsiveProps = Omit<BoxProps, "background" | "color" | "flexWrap">;

type MediaQueriesRangesDictionary = Dictionary<
  string,
  Dictionary<keyof BoxProps, number | string>
>;

export const toMediaQueriesRangesDictionary = (
  prop: keyof BoxResponsiveProps,
  responsiveValue: ResponsiveProp<string | number>,
  breakpoints: string[]
) => {
  const responsiveValues = toArray(responsiveValue);
  const mediaQueriesRangesDictionary = {} as MediaQueriesRangesDictionary;

  const maxRanges =
    responsiveValues.length > breakpoints.length
      ? breakpoints.length
      : responsiveValues.length;

  for (let i = 0; i < maxRanges; i++) {
    mediaQueriesRangesDictionary[breakpoints[i]] = {
      [prop]: responsiveValues[i],
    };
  }

  return mediaQueriesRangesDictionary;
};

export const mergeMediaQueriesRangesDictionaries = (
  mediaQueriesRangesDictionaries: MediaQueriesRangesDictionary[]
) => {
  return mediaQueriesRangesDictionaries.reduce((mediaQueryDictionary, acc) => {
    for (const mediaQuery in mediaQueryDictionary) {
      acc[mediaQuery] = {
        ...acc[mediaQuery],
        ...mediaQueryDictionary[mediaQuery],
      };
    }
    return acc;
  }, {} as MediaQueriesRangesDictionary);
};

export const resolveCssFourSideProp = ({
  prefix,
  value,
  valueX,
  valueY,
  valueTop,
  valueBottom,
  valueLeft,
  valueRight,
  breakpoints,
  defaultMap,
}: {
  prefix: "padding" | "margin";
  value?: ResponsiveProp<Space> | ResponsiveMap<Space>;
  valueX?: ResponsiveProp<Space> | ResponsiveMap<Space>;
  valueY?: ResponsiveProp<Space> | ResponsiveMap<Space>;
  valueTop?: ResponsiveProp<Space> | ResponsiveMap<Space>;
  valueBottom?: ResponsiveProp<Space> | ResponsiveMap<Space>;
  valueLeft?: ResponsiveProp<Space> | ResponsiveMap<Space>;
  valueRight?: ResponsiveProp<Space> | ResponsiveMap<Space>;
  breakpoints: string[];
  defaultMap: (space: ResponsiveProp<string>) => ResponsiveProp<number>;
}) => {
  if (
    !valueX &&
    !valueX &&
    !valueTop &&
    !valueBottom &&
    !valueLeft &&
    !valueRight &&
    value
  ) {
    const resolvedValue = isMapObject(value)
      ? value.map(value.args)
      : defaultMap(value);

    return toMediaQueriesRangesDictionary(prefix, resolvedValue, breakpoints);
  }

  const resolvedTop = resolveSideValue(
    `${prefix}Top` as CssSideProp,
    valueTop || valueY || value,
    breakpoints,
    defaultMap
  );
  const resolvedBottom = resolveSideValue(
    `${prefix}Bottom` as CssSideProp,
    valueBottom || valueY || value,
    breakpoints,
    defaultMap
  );
  const resolvedLeft = resolveSideValue(
    `${prefix}Left` as CssSideProp,
    valueLeft || valueX || value,
    breakpoints,
    defaultMap
  );
  const resolvedRight = resolveSideValue(
    `${prefix}Right` as CssSideProp,
    valueRight || valueX || value,
    breakpoints,
    defaultMap
  );

  return mergeMediaQueriesRangesDictionaries([
    resolvedTop,
    resolvedBottom,
    resolvedLeft,
    resolvedRight,
  ]);
};

export const toObjectStyles = (
  mediaQueriesRangesDictionary: MediaQueriesRangesDictionary,
  breakpoints: Dictionary<string, number>
) => {
  let objecStyles = {};
  const mediaQueriesBreakpoints = Object.keys(mediaQueriesRangesDictionary);

  mediaQueriesBreakpoints.forEach(mediaQueryBreakpoint => {
    if (mediaQueryBreakpoint === "base") {
      objecStyles = {
        ...mediaQueriesRangesDictionary.base,
        ...objecStyles,
      };
    } else {
      objecStyles = {
        ...objecStyles,
        [`@media(min-width: ${breakpoints[mediaQueryBreakpoint]}px)`]: {
          ...mediaQueriesRangesDictionary[mediaQueryBreakpoint],
        },
      };
    }
  });

  return objecStyles;
};

const toArray = <T extends string | number>(
  responsiveValue: ResponsiveProp<T>
) => (Array.isArray(responsiveValue) ? responsiveValue : [responsiveValue]);

type CssSideProp =
  | "marginTop"
  | "marginRight"
  | "marginBottom"
  | "marginLeft"
  | "paddingTop"
  | "paddingRight"
  | "paddingBottom"
  | "paddingLeft";

const resolveSideValue = (
  name: CssSideProp,
  value: ResponsiveProp<Space> | ResponsiveMap<Space> | undefined,
  breakpoints: string[],
  defaultMap: (space: ResponsiveProp<Space>) => ResponsiveProp<number>
) => {
  if (value !== undefined) {
    return toMediaQueriesRangesDictionary(
      name as CssSideProp,
      isMapObject(value) ? value.map(value.args) : defaultMap(value),
      breakpoints
    );
  }
  return {};
};
