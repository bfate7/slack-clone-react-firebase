import React, { useEffect, useState, useCallback } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import Message from "./Message";
import firebase from "../../firebase";

// db messages ref
const messagesRef = firebase.database().ref("messages");

const Messages = (props) => {
  //messages state
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numUsers, setNumUsers] = useState(0);
  //search Messages state
  const [searchTerm, setSearchTerm] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const addMessagelistner = useCallback(() => {
    if (props.currentChanel) {
      setMessages([]);
      const loadedMessages = [];
      messagesRef
        .child(props.currentChanel.id)
        .on("child_added", (snapshot) => {
          loadedMessages.push(snapshot.val());
          setMessages([...loadedMessages]);
        });
      setLoading(false);
      countUniqueUsers(loadedMessages);
    }
  }, [props.currentChanel]);

  const addListners = useCallback(() => {
    if (props.currentChanel) {
      addMessagelistner();
    }
  }, [props.currentChanel, addMessagelistner]);

  useEffect(() => {
    addListners(props.currentChanel);
    return () => {
      messagesRef.off();
    };
  }, [props.currentChanel, addListners]);

  const runSearch = useCallback(() => {
    if (searchTerm) {
      const regex = new RegExp(searchTerm, "gi");
      const searchresults = messages.reduce((acc, message) => {
        if (
          message.content &&
          (message.content.match(regex) || message.user.name.match(regex))
        ) {
          acc.push(message);
        }
        return acc;
      }, []);
      setTimeout(() => setSearchLoading(false), 1000);
      setSearchResults(searchresults);
    }
  }, [messages, searchTerm]);

  useEffect(() => {
    runSearch();
  }, [runSearch]);

  const countUniqueUsers = (messages) => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    setNumUsers(uniqueUsers.length);
  };

  const displatMessages = (msgs) =>
    msgs.length > 0 &&
    msgs.map((message) => (
      <Message
        key={message.timestamp}
        message={message}
        user={props.currentUser}
      />
    ));

  const handleSearch = (e) => {
    setSearchLoading(true);
    setSearchTerm(e.target.value);
    runSearch();
  };

  const renderMessages = () => {
    if (loading) {
      return <span>loading messages...</span>;
    } else if (messages.length === 0) {
      return <span>No messages to show.</span>;
    } else {
      return searchTerm
        ? displatMessages(searchResults)
        : displatMessages(messages);
    }
  };

  return (
    <>
      <MessagesHeader
        currentChanel={props.currentChanel}
        countUniqueUsers={numUsers}
        handleSearch={handleSearch}
        searchLoading={searchLoading}
        isPrivateChannel={props.isPrivateChannel}
      />

      <Segment>
        <Comment.Group className="messages" style={{ marginBottom: "0.7em" }}>
          {renderMessages()}
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
