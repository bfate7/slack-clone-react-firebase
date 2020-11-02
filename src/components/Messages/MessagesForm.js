import React, { useState } from "react";
import firebase from "../../firebase";
import { Button, Input, Segment } from "semantic-ui-react";

const MessagesForm = (props) => {
  const messagesRef = firebase.database().ref("messages");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const createMessage = () => ({
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    content: message,
    user: {
      id: props.currentUser.uid,
      name: props.currentUser.displayName,
      avatar: props.currentUser.photoURL,
    },
  });

  const sendMessage = (e) => {
    if (message) {
      setLoading(true);
      messagesRef
        .child(props.currentChanel.id)
        .push()
        .set(createMessage())
        .then((res) => {
          setLoading(false);
          setMessage("");
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Segment className="message__form">
      <Input
        fluid
        name="message"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        style={{ marginBottom: "0.7em" }}
        label={<Button icon={"add"} />}
        labelPosition="left"
        placeholder="Write your message"
      />
      <Button.Group icon widths="2">
        <Button
          color="orange"
          content="Add Reply"
          labelPosition="left"
          icon="edit"
          onClick={sendMessage}
          loading={loading}
          disabled={loading}
        />
        <Button
          color="teal"
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
        />
      </Button.Group>
    </Segment>
  );
};

export default MessagesForm;
