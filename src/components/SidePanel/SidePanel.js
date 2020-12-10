import React from "react";
import { Menu } from "semantic-ui-react";
import Chanels from "./Chanels";
import UserPanel from "./UserPanel";
import DirectMessages from "./DirectMessages";
import Starred from "./Starred";

const SidePanel = (props) => (
  <Menu size="large" inverted fixed="left" vertical>
    <UserPanel currentUser={props.currentUser} />
    <Starred
      currentUser={props.currentUser}
      currentChanel={props.currentChanel}
    />
    <Chanels
      currentUser={props.currentUser}
      currentChanel={props.currentChanel}
    />
    <DirectMessages
      currentUser={props.currentUser}
      currentChanel={props.currentChanel}
    />
  </Menu>
);
export default SidePanel;
