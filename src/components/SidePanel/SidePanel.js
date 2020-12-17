import React from "react";
import { Menu } from "semantic-ui-react";
import Channels from "./Channels";
import UserPanel from "./UserPanel";
import DirectMessages from "./DirectMessages";
import Starred from "./Starred";

const SidePanel = (props) => {
  const basicStyles = {
    background: props.userColors.primaryColor || "#1e272e",
  };

  const displayStyles = {
    display: props.isVisible ? "block" : "none",
  };

  const dynamicStyles = () => {
    if (props.isMobile) {
      return { position: "absolute !important" };
    } else {
      return { position: "relative" };
    }
  };

  return (
    <Menu
      size="large"
      inverted
      fixed="left"
      vertical
      style={{
        ...displayStyles,
        ...dynamicStyles,
        ...basicStyles,
      }}
    >
      <UserPanel currentUser={props.currentUser} />
      <Starred
        currentUser={props.currentUser}
        currentChannel={props.currentChannel}
      />
      <Channels
        currentUser={props.currentUser}
        currentChannel={props.currentChannel}
      />
      <DirectMessages
        currentUser={props.currentUser}
        currentChannel={props.currentChannel}
      />
    </Menu>
  );
};
export default SidePanel;
