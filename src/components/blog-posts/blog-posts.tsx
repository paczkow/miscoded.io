import React from "react";

import { Grid } from "../grid";
import { HoverCard } from "./components/hover-card";
import { TouchCard } from "./components/touch-card";

export const Posts: React.FC<{ data: Post[] }> = ({ data }) => (
  <Grid>
    {data.map(post => (
      <div key={post.slug}>
        <HoverCard {...post} /> <TouchCard {...post} />
      </div>
    ))}
  </Grid>
);
