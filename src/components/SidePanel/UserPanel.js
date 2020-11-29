import React from "react";
import { Dropdown, Grid, Header, Icon, Image } from "semantic-ui-react";
import firebase from "../../firebase";

const UserPanel = (props) => {
  const user = props.currentUser;
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        firebase.database().goOffline();
      });
  };

  const dropdownoptions = [
    {
      key: "user",
      text: (
        <span>
          signed in as <strong>{props.currentUser.displayName}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: "avatar",
      text: <span>Change Avatar</span>,
    },
    {
      key: "signout",
      text: <span onClick={handleSignOut}>Sign Out</span>,
    },
  ];

  return (
    <Grid>
      <Grid.Column>
        <Grid.Row style={{ padding: "1.2em" }}>
          <Header inverted as="h2" floated="left">
            <Icon name="code" />
            <Header.Content>DevChat</Header.Content>
          </Header>
        </Grid.Row>

        {/* User Dropdown */}
        <Header style={{ padding: "0.25em" }} as="h4" inverted>
          <Dropdown
            trigger={
              <span>
                <Image src={user.photoURL} spaced="right" avatar />
                {user.displayName}
              </span>
            }
            options={dropdownoptions}
          />
        </Header>
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;
