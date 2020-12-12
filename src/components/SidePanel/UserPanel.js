import React, { useState } from "react";
import {
  Button,
  Dropdown,
  Grid,
  Header,
  Icon,
  Image,
  Input,
  Modal,
} from "semantic-ui-react";
import firebase from "../../firebase";

const presenceRef = firebase.database().ref("presence");

const UserPanel = (props) => {
  const user = props.currentUser;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        presenceRef.child(user.uid).remove();
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
      text: <span onClick={openModal}>Change Avatar</span>,
    },
    {
      key: "signout",
      text: <span onClick={handleSignOut}>Sign Out</span>,
    },
  ];

  const ChangeAvatarModal = () => (
    <Modal open={isModalOpen} onClose={closeModal}>
      <Modal.Header>Change Avatar</Modal.Header>

      <Modal.Content>
        <Input fluid type="file" label="New Avatar" />

        <Grid centered stackable columns={2}>
          <Grid.Row>
            <Grid.Column></Grid.Column>
            <Grid.Column></Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button color="green">
          <Icon name="save" /> Save Avatar
        </Button>
        <Button color="blue">
          <Icon name="image" /> Preview
        </Button>
        <Button color="red" onClick={closeModal}>
          <Icon name="remove" /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );

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

      {/* Chane Avatar Modal */}
      <ChangeAvatarModal />
    </Grid>
  );
};

export default UserPanel;
