import React, { useEffect, useState } from "react";
import { Button, Form, Icon, Menu, Modal } from "semantic-ui-react";
import firebase from "../../firebase";

const Chanels = (props) => {
  const [chanels, setChanels] = useState([]);
  useEffect(() => {
    ChanelsListner();
  }, [chanels]);

  const chanelsRef = firebase.database().ref("chanels");

  const [modal, setModal] = useState(false);
  const [chanel, setChanel] = useState({ chanelName: "", chanelDetails: "" });

  const handleChange = (e) =>
    setChanel({ ...chanel, [e.target.name]: e.target.value });

  const clearModal = (e) => setChanel({ chanelName: "", chanelDetails: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((!chanel.chanelName, !chanel.chanelDetails)) {
      return alert("err");
    }

    //create ref

    const key = chanelsRef.push().key;

    const newChanel = {
      id: key,
      name: chanel.chanelName,
      details: chanel.chanelDetails,
      createdBy: {
        user: props.currentUser.displayName,
        avatar: props.currentUser.photoURL,
      },
    };

    console.log(newChanel);

    chanelsRef
      .child(key)
      .update(newChanel)
      .then(() => {
        clearModal();
        setModal(false);
      })
      .catch((err) => console.log(err));
  };

  const ChanelsListner = () => {
    const loadedChanels = [];
    chanelsRef.on("child_added", (snap) => {
      loadedChanels.push(snap.val());
      setChanels(loadedChanels);
    });
  };

  const displayChanels = () =>
    chanels.length > 0 &&
    chanels.map((chanel) => (
      <Menu.Item key={chanel.id} name={chanel.name} style={{ opavity: "0.8" }}>
        # {chanel.name}
      </Menu.Item>
    ));

  return (
    <>
      <Menu.Menu style={{ paddingTop: "2em" }}>
        <Menu.Item>
          <span>
            <Icon name="exchange" />
            Chanels
          </span>
          {"  "}({chanels.length}){" "}
          <Icon name="add" onClick={() => setModal(true)} />
        </Menu.Item>
        {displayChanels()}
      </Menu.Menu>
      {/* add chanel modal */}

      <Modal open={modal} onClose={() => setModal(false)}>
        <Modal.Header>add Chanel</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <Form.Input
                fluid
                label="chanel name"
                name="chanelName"
                onChange={handleChange}
                value={chanel.name}
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                fluid
                label="about the chanel"
                name="chanelDetails"
                onChange={handleChange}
                value={chanel.details}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={handleSubmit}>
            <Icon name="checkmark" /> Add
          </Button>
          <Button color="red" inverted onClick={() => setModal(false)}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default Chanels;
