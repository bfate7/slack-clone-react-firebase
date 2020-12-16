import React, { useState, useCallback, useEffect } from "react";
import { connect } from "react-redux";
import { Grid } from "semantic-ui-react";
import ColorPanel from "./ColorPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel";
import { useMediaQuery } from "react-responsive";
import MessagesForm from "./Messages/MessagesForm";

import firebase from "../firebase";

const messagesRef = firebase.database().ref("messages");
const privateMessagesRef = firebase.database().ref("privateMessages");

const Main = (props) => {
  const isMobile = useMediaQuery({
    query: "(max-device-width: 768px)",
  });

  const isTablet = useMediaQuery({
    query: "(max-device-width: 1000px)",
  });
  const [side, setSide] = useState(true);

  useEffect(() => {
    if (isMobile) setSide(false);
    else setSide(true);
  }, [isMobile]);

  const toggleMenu = () => setSide(!side);

  const getMessagesRef = useCallback(() => {
    return props.isPrivateChannel ? privateMessagesRef : messagesRef;
  }, [props.isPrivateChannel]);

  return (
    <Grid
      columns="equal"
      className="app"
      style={{ background: props.userColors.secondaryColor }}
    >
      <ColorPanel
        currentUser={props.currentUser}
        isMobile={isMobile}
        toggleMenu={toggleMenu}
        isVisible={side}
      />
      <SidePanel
        isVisible={side}
        isMobile={isMobile}
        currentUser={props.currentUser}
        currentChanel={props.currentChanel}
        userColors={props.userColors}
      />
      <Grid.Column
        style={!isMobile ? { marginLeft: "320px" } : { marginLeft: "60px" }}
      >
        <Messages
          currentChanel={props.currentChanel}
          currentUser={props.currentUser}
          isPrivateChannel={props.isPrivateChannel}
          getMessagesRef={getMessagesRef}
          isMobile={isMobile}
        />
        <MessagesForm
          currentChanel={props.currentChanel}
          currentUser={props.currentUser}
          isPrivateChannel={props.isPrivateChannel}
          getMessagesRef={getMessagesRef}
        />
      </Grid.Column>
      <Grid.Column
        style={isTablet ? { display: "none" } : { display: "block" }}
      >
        <MetaPanel
          currentChanel={props.currentChanel}
          isPrivateChannel={props.isPrivateChannel}
          key={props.currentChanel && props.currentChanel.id}
          usersPosts={props.usersPosts}
        />
      </Grid.Column>
    </Grid>
  );
};
const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  usersPosts: state.user.usersPosts,
  userColors: state.user.userColors,
  currentChanel: state.chanel.currentChanel,
  isPrivateChannel: state.chanel.isPrivate,
});

export default connect(mapStateToProps)(Main);
