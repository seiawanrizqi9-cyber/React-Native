// src/utils/responsive.ts

export const TABLET_BREAKPOINT = 768;

export const getColumnsForGrid = (width: number, height: number): number => {
  const isLandscape = width > height;
  const isTablet = width >= TABLET_BREAKPOINT;

  if (isTablet) {
    return isLandscape ? 6 : 4;
  } else {
    return isLandscape ? 5 : 3;
  }
};

export const calculateCardWidth = (
  screenWidth: number,
  columns: number,
  containerPadding: number = 16,
  gap: number = 4
): number => {
  const totalGutter = gap * (columns - 1);
  const availableWidth = screenWidth - containerPadding * 2;
  return (availableWidth - totalGutter) / columns;
};