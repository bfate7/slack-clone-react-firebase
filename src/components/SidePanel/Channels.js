import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Form, Icon, Menu, Modal } from "semantic-ui-react";
import firebase from "../../firebase";
import {
  setCurrentChannel,
  setPrivateChannel,
} from "../../actions/channelActions";

//channels firebase ref
const channelsRef = firebase.database().ref("channels");
const messagesRef = firebase.database().ref("messages");
const typingRef = firebase.database().ref("typing");

const Channels = (props) => {
  const { setCurrentChannel } = props;
  //channels state
  const [channels, setChannels] = useState([]);
  //first load
  const [firstLoad, setFirstLoad] = useState(true);
  //active channel
  const [activeChannel, setActiveChannel] = useState(null);

  const setFisrtChannel = useCallback(
    (loadedChannels) => {
      if (firstLoad && loadedChannels.length > 0) {
        setCurrentChannel(loadedChannels[0]);
        setActiveChannel(loadedChannels[0]);
      }

      setFirstLoad(false);
    },
    [firstLoad, setCurrentChannel]
  );

  useEffect(() => {
    let loadedChannels = [];
    channelsRef.on("child_added", (snapshot) => {
      loadedChannels.push(snapshot.val());
      setChannels([...loadedChannels]);
      setFisrtChannel([...loadedChannels]);
    });
    return () => channelsRef.off();
  }, [setFisrtChannel]);

  //modal state
  const [modal, setModal] = useState(false);
  const [channel, setChannel] = useState({
    channelName: "",
    channelDetails: "",
  });

  const handleChange = (e) =>
    setChannel({ ...channel, [e.target.name]: e.target.value });

  const clearModal = (e) => setChannel({ channelName: "", channelDetails: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((!channel.channelName, !channel.channelDetails)) {
      return alert("err");
    }

    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channel.channelName,
      details: channel.channelDetails,
      createdBy: {
        user: props.currentUser.displayName,
        avatar: props.currentUser.photoURL,
      },
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        clearModal();
        setModal(false);
      })
      .catch((err) => console.log(err));
  };

  const ChannelsList = () =>
    channels.length > 0 &&
    channels.map((channel) => (
      <Menu.Item
        key={channel.id}
        name={channel.name}
        style={{ opavity: "0.8" }}
        onClick={() => changeChannel(channel)}
        active={activeChannel && channel.id === activeChannel.id}
      >
        # {channel.name}
      </Menu.Item>
    ));

  const changeChannel = (channel) => {
    //remove messages listner before changing channel
    //this is due to bug of reciving messages from another channel
    messagesRef.child(props.currentChannel.id).off();
    //remove typing for current channel befor changing it
    typingRef
      .child(props.currentChannel.id)
      .child(props.currentUser.uid)
      .remove();

    props.setCurrentChannel(channel);
    props.setPrivateChannel(false);

    setActiveChannel(channel);
  };

  useEffect(() => {
    if (props.currentChannel) {
      setActiveChannel(props.currentChannel);
    }
  }, [props.currentChannel]);

  return (
    <>
      <Menu.Menu style={{ paddingTop: "2em" }}>
        <Menu.Item>
          <span>
            <Icon name="exchange" />
            Channels
          </span>
          {"  "}({channels.length}){" "}
          <Icon name="add" onClick={() => setModal(true)} />
        </Menu.Item>
        <ChannelsList />
      </Menu.Menu>
      {/* add channel modal */}

      <Modal open={modal} onClose={() => setModal(false)}>
        <Modal.Header>add Channel</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <Form.Input
                fluid
                label="channel name"
                name="channelName"
                onChange={handleChange}
                value={channel.name}
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                fluid
                label="about the channel"
                name="channelDetails"
                onChange={handleChange}
                value={channel.details}
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

export default connect(null, { setCurrentChannel, setPrivateChannel })(
  Channels
);
