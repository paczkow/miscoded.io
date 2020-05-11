export const getToNumber = (
  spacesDictionary: Record<string, number>,
  factor = 1
) => (responsiveValue: ResponsiveProp<string>) =>
  Array.isArray(responsiveValue)
    ? responsiveValue.map(value => spacesDictionary[value] * factor)
    : spacesDictionary[responsiveValue] * factor;

export const isMapObject = <T extends string | number>(
  value: ResponsiveProp<T> | ResponsiveMap<T>
): value is ResponsiveMap<T> => {
  if (
    typeof value !== "string" &&
    typeof value !== "number" &&
    !Array.isArray(value)
  ) {
    return true;
  }
  return false;
};
