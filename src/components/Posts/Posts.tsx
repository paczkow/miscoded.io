import React from "react";

import { Grid } from "../Grid";
import { HoverCard } from "./components/HoverCard";
import { TouchCard } from "./components/TouchCard";

export const Posts: React.FC<{ data: Post[] }> = ({ data }) => (
  <Grid>
    {data.map(post => (
      <article key={post.slug}>
        <HoverCard {...post} /> <TouchCard {...post} />
      </article>
    ))}
  </Grid>
);
