import React, { useRef, useState } from "react";
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

import AvatarEditor from "react-avatar-editor";

const presenceRef = firebase.database().ref("presence");

const storageRef = firebase.storage().ref();

const usersRef = firebase.database().ref("users");

const UserPanel = (props) => {
  const user = props.currentUser;

  //Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [loading, setLoading] = useState(false);

  //Modal Open/Close Handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  //image Input handler
  const handleChange = (e) => {
    const imageFile = e.target.files[0];

    if (imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);

      reader.addEventListener("loadend", () => {
        setImagePreview(reader.result);
      });
    }
  };

  //Crop handler
  const AvatarEditorRef = useRef(null);
  const handleCrop = () => {
    if (AvatarEditorRef.current) {
      AvatarEditorRef.current.getImageScaledToCanvas().toBlob((blob) => {
        const imageURL = URL.createObjectURL(blob);
        setCroppedImage(imageURL);
        setImageBlob(blob);
      });
    }
  };

  //upload Cropped Image
  const uploadCroppedImage = () => {
    setLoading(true);

    //1 - upload image to storage
    storageRef
      .child(`avatars/users/${props.currentUser.uid}`)
      .put(imageBlob, {
        contentType: "image/jpeg",
      })
      .then((snap) => {
        //get uploaded image url
        snap.ref.getDownloadURL().then((downloadUrl) => {
          //update user profile
          firebase
            .auth()
            .currentUser.updateProfile({
              photoURL: downloadUrl,
            })
            .then(() => {
              //update user data in database
              usersRef
                .child(props.currentUser.uid)
                .update({
                  avatar: downloadUrl,
                })
                .then(() => {
                  setLoading(false);
                });
            });
        });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

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
          signed in as
          <strong>{props.currentUser && props.currentUser.displayName}</strong>
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
        <Input fluid type="file" label="New Avatar" onChange={handleChange} />

        <Grid centered stackable columns={2} className=" m4 top">
          <Grid.Row verticalAlign="middle" centered>
            <Grid.Column>
              {imagePreview && (
                <>
                  <AvatarEditor
                    ref={AvatarEditorRef}
                    image={imagePreview}
                    width={200}
                    height={200}
                    border={50}
                    scale={1.2}
                  />
                </>
              )}
            </Grid.Column>
            <Grid.Column>
              {croppedImage && (
                <Image src={croppedImage} style={{ width: "200px" }} />
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="green"
          disabled={!croppedImage}
          onClick={uploadCroppedImage}
          loading={loading}
        >
          <Icon name="save" /> Save Avatar
        </Button>
        <Button color="blue" onClick={handleCrop}>
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
                <Image
                  src={props.currentUser && props.currentUser.photoURL}
                  spaced="right"
                  avatar
                />
                {props.currentUser && props.currentUser.displayName}
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
