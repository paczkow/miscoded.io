import { theme } from './theme';

type Breakpoints = keyof typeof theme.breakpoints;

export const getMinWidthMediaQuery = (breakpoint: Breakpoints) =>
  `@media (min-width: ${theme.breakpoints[breakpoint]}px)`;

export const getMaxWidthMediaQuery = (breakpoint: Breakpoints) =>
  `@media (max-width: ${theme.breakpoints[breakpoint]}px)`;
