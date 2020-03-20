import React from "react";

import { Grid } from "../Grid";
import { HoverCard } from "./components/HoverCard";
import { TouchCard } from "./components/TouchCard";

export const Posts: React.FC<{ data: Post[] }> = ({ data }) => {
  const hasHover = window.matchMedia("(hover: hover)").matches;

  return (
    <Grid>
      {data.map(post => {
        return (
          <article key={post.slug}>
            {hasHover ? <HoverCard {...post} /> : <TouchCard {...post} />}
          </article>
        );
      })}
    </Grid>
  );
};
