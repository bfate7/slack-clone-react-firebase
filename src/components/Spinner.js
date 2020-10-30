import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

const Spinner = () => (
  <Dimmer active>
    <Loader size="big" content="preparing chat..."></Loader>
  </Dimmer>
);

export default Spinner;
