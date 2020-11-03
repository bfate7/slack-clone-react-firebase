import React from "react";
import { Progress } from "semantic-ui-react";

const ProgressBar = (props) =>
  props.uploadState && (
    <Progress
      percent={props.percentUpload}
      style={{ marginTop: "0.5em", transition: "0.5s" }}
      size="medium"
      progress
      indicating
      inverted
    />
  );

export default ProgressBar;
