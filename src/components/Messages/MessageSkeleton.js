import React from "react";
import Skeleton from "react-loading-skeleton";
import { Grid } from "semantic-ui-react";

const MessageSkeleton = () => (
  <Grid.Row style={{ marginTop: "0.2em" }}>
    <Grid.Column>
      <Skeleton width={"15%"} height="20px" />
    </Grid.Column>
    <Grid.Column>
      <Skeleton width={"95%"} height="20px" />
    </Grid.Column>
  </Grid.Row>
);

export default MessageSkeleton;
