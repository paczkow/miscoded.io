import React from "react";
import { WindowLocation } from "@reach/router";
import { FacebookShareButton, TwitterShareButton } from "react-share";

import config from "../../config";
import { Inline } from "../components/foundations/layout";
import { Facebook, Twitter } from "../components/icons/Social";

export const Share: React.FC<{
  description: string;
  location: WindowLocation;
}> = ({ description, location }) => {
  const iconColors = {
    color: "#555555",
    hoverColor: "#000000",
  };

  return (
    <Inline space="small">
      <FacebookShareButton quote={description} url={location.href}>
        <Facebook {...iconColors} />
      </FacebookShareButton>
      <TwitterShareButton
        title={description}
        url={location.href}
        via={config.twitterUser}
      >
        <Twitter {...iconColors} />
      </TwitterShareButton>
    </Inline>
  );
};
