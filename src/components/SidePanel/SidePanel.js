import React from "react";
import { Menu } from "semantic-ui-react";
import Chanels from "./Chanels";
import UserPanel from "./UserPanel";

const SidePanel = (props) => (
  <Menu size="large" inverted fixed="left" vertical>
    <UserPanel currentUser={props.currentUser} />
    <Chanels currentUser={props.currentUser} />
  </Menu>
);
export default SidePanel;
