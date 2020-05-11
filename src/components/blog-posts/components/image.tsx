import React from "react";

interface ImageProps {
  image: string;
  tracedSVG: string;
}

export const Image: React.FC<ImageProps & { className?: string }> = ({
  image,
  tracedSVG,
  children,
  className,
}) => (
  <div
    className={className}
    css={{
      background: `url("${image}"), url("${tracedSVG}")`,
      height: "216px",
      backgroundSize: "cover",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

export const OverlayImage: React.FC<ImageProps> = ({
  image,
  tracedSVG,
  children,
}) => (
  <Image
    image={image}
    tracedSVG={tracedSVG}
    css={{
      ":after": {
        content: "''",
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: "rgba(0, 0, 0, 0.5)",
      },
    }}
  >
    {children}
  </Image>
);
