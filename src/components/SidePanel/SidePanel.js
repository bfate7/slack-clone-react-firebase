import React from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel";

const SidePanel = (props) => (
  <Menu size="large" inverted fixed="left" vertical>
    <UserPanel {...props} />
  </Menu>
);
export default SidePanel;
