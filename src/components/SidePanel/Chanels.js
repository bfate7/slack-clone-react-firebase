import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Form, Icon, Menu, Modal } from "semantic-ui-react";
import firebase from "../../firebase";
import { setCurrentChanel } from "../../actions/chanelActions";

const Chanels = (props) => {
  //chanels firebase ref
  const chanelsRef = firebase.database().ref("chanels");
  //chanels state
  const [chanels, setChanels] = useState([]);

  useEffect(() => {
    console.log("effect ran");

    let loadedChanels = [];
    chanelsRef.on("value", (snapshot) => {
      const res = snapshot.val();
      for (const id in res) {
        loadedChanels.push(res[id]);
      }
      setChanels(loadedChanels);
    });
  }, []);

  //modal state
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

  const ChanelsList = () =>
    chanels.length > 0 &&
    chanels.map((chanel) => (
      <Menu.Item
        key={chanel.id}
        name={chanel.name}
        style={{ opavity: "0.8" }}
        onClick={() => changeChanel(chanel)}
      >
        # {chanel.name}
      </Menu.Item>
    ));

  const changeChanel = (chanel) => props.setCurrentChanel(chanel);

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
        <ChanelsList />
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

export default connect(null, { setCurrentChanel })(Chanels);
