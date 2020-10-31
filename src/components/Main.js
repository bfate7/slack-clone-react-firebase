import React from "react";
import { connect } from "react-redux";
import { Grid } from "semantic-ui-react";
import ColorPanel from "./ColorPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages";
import MetaPanel from "./MetaPanel";

const Main = (props) => (
  <Grid columns="equal" className="app" style={{ background: "#eee" }}>
    <ColorPanel />
    <SidePanel currentUser={props.currentUser} />
    <Grid.Column style={{ marginLeft: "320px" }}>
      <Messages />
    </Grid.Column>
    <Grid.Column>
      <MetaPanel />
    </Grid.Column>
  </Grid>
);

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(Main);
