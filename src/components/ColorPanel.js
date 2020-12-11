import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { setUserColors } from "../actions/userActions";

import {
  Button,
  Divider,
  Icon,
  Label,
  Menu,
  Modal,
  Sidebar,
} from "semantic-ui-react";
import { SliderPicker } from "react-color";

import firebase from "../firebase";

const usersRef = firebase.database().ref("users");

const ColorPanel = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");

  const [userColors, setUserColors] = useState([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handlePrimaryColor = (color) => setPrimaryColor(color.hex);
  const handleSecondaryColor = (color) => setSecondaryColor(color.hex);

  const saveColors = () => {
    if (primaryColor && secondaryColor && props.currentUser) {
      usersRef
        .child(props.currentUser.uid)
        .child("colors")
        .once("value")
        .then((snap) => {
          if (snap.val() && snap.numChildren() > 4) {
            return closeModal();
          } else {
            usersRef
              .child(props.currentUser.uid)
              .child("colors")
              .push()
              .set({
                primaryColor,
                secondaryColor,
              })
              .then(() => {
                closeModal();
              })
              .catch((err) => {
                closeModal();
                console.log(err);
              });
          }
        });
    }
  };

  const addListners = useCallback((userId) => {
    const loadedColors = [];
    usersRef
      .child(userId)
      .child("colors")
      .on("child_added", (snap) => {
        loadedColors.unshift(snap.val());
        setUserColors([...loadedColors]);
        setUserColors(loadedColors);
      });
  }, []);

  useEffect(() => {
    if (props.currentUser) {
      addListners(props.currentUser.uid);
    }
  }, [addListners, props.currentUser]);

  const displayUserColors = (colors) =>
    colors.length > 0 &&
    colors.map((color, i) => (
      <React.Fragment key={i}>
        <Divider />
        <div
          className="color__container"
          onClick={() =>
            props.setUserColors(color.primaryColor, color.secondaryColor)
          }
        >
          <div
            className="color__square"
            style={{ background: color.primaryColor }}
          >
            <div
              className="color__overlay"
              style={{ background: color.secondaryColor }}
            ></div>
          </div>
        </div>
      </React.Fragment>
    ));

  return (
    <Sidebar as={Menu} inverted vertical visible width="very thin">
      <Divider />
      <Button size="small" icon="add" onClick={openModal} />

      {displayUserColors(userColors)}

      <Modal open={isModalOpen} onClose={closeModal}>
        <Modal.Header>Choose App Color</Modal.Header>
        <Modal.Content>
          <Label content="Primary Color" circular />
          <SliderPicker color={primaryColor} onChange={handlePrimaryColor} />

          <Label content="Secondary Color" circular />
          <SliderPicker
            color={secondaryColor}
            onChange={handleSecondaryColor}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" onClick={saveColors}>
            <Icon name="checkmark" />
            SaveColors
          </Button>

          <Button color="red" onClick={closeModal}>
            <Icon name="remove" />
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </Sidebar>
  );
};

export default connect(null, { setUserColors })(ColorPanel);
