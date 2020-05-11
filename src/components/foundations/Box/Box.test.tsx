import { Theme } from "../../../theme";

import {
  toMediaQueriesRangesDictionary,
  mergeMediaQueriesRangesDictionaries,
  resolveCssFourSideProp,
  toObjectStyles,
} from "./Box.style";

describe("Box component", () => {
  let theme: Theme;
  let breakpoints: string[];
  let defaultMap: (value: ResponsiveProp<string>) => ResponsiveProp<number>;

  beforeEach(() => {
    theme = {
      breakpoints: {
        minMedium: 768,
        minLarge: 1240,
      },
      space: {
        none: 0,
        xsmall: 2,
        small: 8,
        medium: 16,
        large: 32,
      },
    } as Theme;

    breakpoints = ["base", ...Object.keys(theme.breakpoints)];

    defaultMap = (value: ResponsiveProp<string>) => {
      if (!Array.isArray(value)) {
        return theme.space[value as keyof typeof theme.space];
      } else {
        return value.map(
          space => theme.space[space as keyof typeof theme.space]
        );
      }
    };
  });

  describe("create media queries ranges from Box props", () => {
    it("when pass single value or one-item array, then get one, base range", () => {
      expect(
        toMediaQueriesRangesDictionary("width", 8, breakpoints)
      ).toMatchObject({
        base: {
          width: 8,
        },
      });

      expect(
        toMediaQueriesRangesDictionary("width", [8], breakpoints)
      ).toMatchObject({
        base: {
          width: 8,
        },
      });
    });

    it("when pass array of values, then get multiple ranges", () => {
      expect(
        toMediaQueriesRangesDictionary("width", [8, 16, 32], breakpoints)
      ).toMatchObject({
        base: {
          width: 8,
        },
        minMedium: {
          width: 16,
        },
        minLarge: {
          width: 32,
        },
      });
    });

    it("when pass multiple ranges dictionaries, then get merged one", () => {
      const first = toMediaQueriesRangesDictionary(
        "width",
        [8, 16],
        breakpoints
      );

      const second = toMediaQueriesRangesDictionary(
        "height",
        [8, 16],
        breakpoints
      );

      expect(
        mergeMediaQueriesRangesDictionaries([first, second])
      ).toMatchObject({
        base: {
          width: 8,
          height: 8,
        },
        minMedium: {
          width: 16,
          height: 16,
        },
      });
    });
  });

  describe("resolve four side prop", () => {
    it("when pass only padding, then get only 'padding' prop", () => {
      expect(
        resolveCssFourSideProp({
          prefix: "padding",
          value: ["small", "large"],
          breakpoints,
          defaultMap,
        })
      ).toMatchObject({
        base: {
          padding: 8,
        },
        minMedium: {
          padding: 32,
        },
      });
    });

    it("when pass padding and paddingX, then 'padding-left' and 'padding-right' were overwrited by paddingX", () => {
      expect(
        resolveCssFourSideProp({
          prefix: "padding",
          value: "small",
          valueX: ["medium", "large"],
          breakpoints,
          defaultMap,
        })
      ).toMatchObject({
        base: {
          paddingTop: 8,
          paddingBottom: 8,
          paddingRight: 16,
          paddingLeft: 16,
        },
        minMedium: {
          paddingRight: 32,
          paddingLeft: 32,
        },
      });
    });
  });

  describe("transform dictionary of media queries ranges to objectStyles", () => {
    it("when pass dictionary, then get valid objecStyles with media queries", () => {
      expect(
        toObjectStyles(
          {
            base: {
              width: 8,
            },
            minMedium: {
              width: 32,
            },
            minLarge: {
              width: 64,
            },
          },
          theme.breakpoints
        )
      ).toMatchObject({
        width: 8,
        "@media(min-width: 768px)": {
          width: 32,
        },
        "@media(min-width: 1240px)": {
          width: 64,
        },
      });
    });
  });
});
