import React from "react";

import { Box } from "./Box/Box";
import { Stack } from "./Stack";

export const Footer: React.FC = () => (
  <Box
    alignItems="center"
    justifyContent="center"
    paddingY="large"
    background="#fafafa"
  >
    <Stack space="small" align="center">
      <h4>miscoded.io</h4>
      <span>contact@miscoded.io</span>
    </Stack>
  </Box>
);
