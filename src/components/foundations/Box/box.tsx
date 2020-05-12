import React from "react";
import { theme } from "../../../theme";
import {
  BoxProps,
  toMediaQueriesRangesDictionary,
  mergeMediaQueriesRangesDictionaries,
  resolveCssFourSideProp,
  toObjectStyles,
} from "./Box.style";
import { getToNumber } from "../utils/responsive-prop";

const toNumber = getToNumber(theme.space);
const breakpoints = ["base", ...Object.keys(theme.breakpoints)];

export const Box: React.FC<BoxProps> = ({
  children,
  display,
  background,
  color,
  flexDirection,
  flexWrap,
  className,
  ...responsiveProps
}) => {
  const {
    width,
    height,
    justifyContent,
    alignItems,
    margin,
    marginBottom,
    marginLeft,
    marginRight,
    marginTop,
    marginX,
    marginY,
    padding,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingX,
    paddingY,
  } = responsiveProps;

  const objectStyles = toObjectStyles(
    mergeMediaQueriesRangesDictionaries([
      width ? toMediaQueriesRangesDictionary("width", width, breakpoints) : {},
      height
        ? toMediaQueriesRangesDictionary("height", height, breakpoints)
        : {},
      justifyContent
        ? toMediaQueriesRangesDictionary(
            "justifyContent",
            justifyContent,
            breakpoints
          )
        : {},
      alignItems
        ? toMediaQueriesRangesDictionary("alignItems", alignItems, breakpoints)
        : {},
      display
        ? toMediaQueriesRangesDictionary("display", display, breakpoints)
        : {},
      resolveCssFourSideProp({
        prefix: "margin",
        value: margin,
        valueX: marginX,
        valueY: marginY,
        valueTop: marginTop,
        valueBottom: marginBottom,
        valueLeft: marginLeft,
        valueRight: marginRight,
        breakpoints,
        defaultMap: toNumber,
      }),
      resolveCssFourSideProp({
        prefix: "padding",
        value: padding,
        valueX: paddingX,
        valueY: paddingY,
        valueTop: paddingTop,
        valueBottom: paddingBottom,
        valueLeft: paddingLeft,
        valueRight: paddingRight,
        breakpoints,
        defaultMap: toNumber,
      }),
    ]),
    theme.breakpoints
  );

  Object.assign(
    objectStyles,
    background === undefined ? null : { background },
    color === undefined ? null : { color },
    flexWrap === undefined ? null : { flexWrap },
    flexDirection === undefined ? null : { flexDirection }
  );

  return (
    <div className={className} css={objectStyles}>
      {children}
    </div>
  );
};
