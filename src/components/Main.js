import React from "react";
import { connect } from "react-redux";
import { Grid } from "semantic-ui-react";
import ColorPanel from "./ColorPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel";

const Main = (props) => (
  <Grid columns="equal" className="app" style={{ background: "#eee" }}>
    <ColorPanel />
    <SidePanel
      currentUser={props.currentUser}
      currentChanel={props.currentChanel}
    />
    <Grid.Column style={{ marginLeft: "320px" }}>
      <Messages
        currentChanel={props.currentChanel}
        currentUser={props.currentUser}
        isPrivateChannel={props.isPrivateChannel}
      />
    </Grid.Column>
    <Grid.Column>
      <MetaPanel
        currentChanel={props.currentChanel}
        isPrivateChannel={props.isPrivateChannel}
        key={props.currentChanel && props.currentChanel.id}
        usersPosts={props.usersPosts}
      />
    </Grid.Column>
  </Grid>
);

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  usersPosts: state.user.usersPosts,
  currentChanel: state.chanel.currentChanel,
  isPrivateChannel: state.chanel.isPrivate,
});

export default connect(mapStateToProps)(Main);
