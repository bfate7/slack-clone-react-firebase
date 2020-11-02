import React from "react";
import { Button, Divider, Menu, Sidebar } from "semantic-ui-react";

const ColorPanel = () => (
  <Sidebar as={Menu} inverted vertical visible width="very thin" color="teal">
    <Divider />
    <Button size="small" color="" icon="add" />
  </Sidebar>
);

export default ColorPanel;
