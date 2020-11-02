import React, { useEffect, useState } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import Message from "./Message";
import firebase from "../../firebase";

const Messages = (props) => {
  const messagesRef = firebase.database().ref("messages");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    addListners();
  }, [props.currentUser, props.currentChanel]);

  const addListners = () => {
    if (props.currentChanel && props.currentUser) {
      addMessagelistner(props.currentChanel.id);
    }
  };

  const addMessagelistner = (chanelId) => {
    messagesRef.child(chanelId).on("value", (snapshot) => {
      const loadedMessages = [];
      const res = snapshot.val();
      for (const id in res) {
        loadedMessages.push(res[id]);
      }
      setMessages(loadedMessages);
    });
  };

  const MessagesList = () =>
    messages.length > 0 &&
    messages.map((message) => (
      <Message
        key={message.timestamp}
        message={message}
        user={props.currentUser}
      />
    ));

  return (
    <>
      <MessagesHeader />

      <Segment>
        <Comment.Group className="messages" style={{ marginBottom: "0.7em" }}>
          {<MessagesList />}
        </Comment.Group>
      </Segment>

      <MessagesForm
        currentChanel={props.currentChanel}
        currentUser={props.currentUser}
      />
    </>
  );
};

export default Messages;
