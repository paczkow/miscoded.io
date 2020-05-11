import React from "react";

import { Box, Stack } from "../../foundations";

export const Footer: React.FC = () => (
  <footer>
    <Box
      alignItems="center"
      justifyContent="center"
      paddingY="large"
      background="#fafafa"
      css={{ position: "relative" }}
    >
      <hr
        css={{
          position: "absolute",
          top: 0,
          margin: 0,
          width: "100%",
          border: "1px solid #f7f7f7",
          boxShadow: "0px 30px 40px rgba(0, 0, 0, 0.3)",
        }}
      />
      <Stack space="xsmall" align="center">
        <h4>miscoded.io, 2020</h4>
        <a href="mailto:contact@miscoded.io">
          <span css={{ fontSize: 14 }}>contact@miscoded.io</span>
        </a>
      </Stack>
    </Box>
  </footer>
);
