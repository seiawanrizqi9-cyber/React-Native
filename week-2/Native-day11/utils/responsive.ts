export const TABLET_BREAKPOINT = 768;

export const getColumnsForGrid = (width: number, height: number): number => {
  const isLandscape = width > height;
  const isTablet = width >= TABLET_BREAKPOINT;

  if (isTablet) {
    return isLandscape ? 4 : 3;
  } else {
    return isLandscape ? 3 : 2;
  }
};

export const calculateCardWidth = (
  screenWidth: number,
  columns: number,
  containerPadding: number = 16,
  gap: number = 8
): number => {
  const totalGutter = gap * (columns - 1);
  const availableWidth = screenWidth - containerPadding * 2;
  return (availableWidth - totalGutter) / columns;
};