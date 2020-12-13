import React, { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import Message from "./Message";
import firebase from "../../firebase";
import { setUsersPosts } from "../../actions/userActions";

// db messages ref
const usersRef = firebase.database().ref("users");
const messagesRef = firebase.database().ref("messages");
const privateMessagesRef = firebase.database().ref("privateMessages");

const Messages = (props) => {
  const { setUsersPosts } = props;

  //messages state
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numUsers, setNumUsers] = useState(0);
  //search Messages state
  const [searchTerm, setSearchTerm] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  //isChannelStarred
  const [isChannelStarred, setIsChannelStarred] = useState(false);
  const [starredLoaded, setStarredLoaded] = useState(false);

  const getMessagesRef = useCallback(() => {
    return props.isPrivateChannel ? privateMessagesRef : messagesRef;
  }, [props.isPrivateChannel]);

  const handleStar = () => {
    if (starredLoaded) {
      starChannel(!isChannelStarred, props.currentChanel, props.currentUser);
    }
  };

  const starChannel = useCallback((isStarred, currentChanel, currentUser) => {
    if (isStarred) {
      setIsChannelStarred(true);
      usersRef
        .child(currentUser.uid)
        .child("starred")
        .update({
          [currentChanel.id]: { ...currentChanel },
        })
        .catch((err) => {
          setIsChannelStarred(false);
        });
    } else {
      setIsChannelStarred(false);
      usersRef
        .child(currentUser.uid)
        .child("starred")
        .child(currentChanel.id)
        .remove()
        .catch((err) => {
          setIsChannelStarred(true);
        });
    }
  }, []);

  useEffect(() => {
    if (props.currentUser && props.currentChanel) {
      usersRef
        .child(props.currentUser.uid)
        .child("starred")
        .once("value")
        .then((snap) => {
          if (snap.val()) {
            const ids = Object.keys(snap.val());
            const isStarred = ids.includes(props.currentChanel.id);
            setIsChannelStarred(isStarred);
          } else {
            setIsChannelStarred(false);
          }

          setStarredLoaded(true);
        });
    }
  }, [props.currentChanel, props.currentUser, starChannel, setStarredLoaded]);

  const countUsesPosts = useCallback(
    (messages) => {
      const usersPosts = messages.reduce((acc, message) => {
        if (message.user.name in acc) {
          acc[message.user.name].count += 1;
        } else {
          acc[message.user.name] = {
            avatar: message.user.avatar,
            count: 1,
          };
        }

        return acc;
      }, {});
      setUsersPosts(usersPosts);
    },
    [setUsersPosts]
  );

  useEffect(() => {
    countUniqueUsers(messages);
    countUsesPosts(messages);
  }, [countUsesPosts, messages]);

  const addMessagelistner = useCallback(() => {
    if (props.currentChanel) {
      setMessages([]);
      const loadedMessages = [];
      getMessagesRef()
        .child(props.currentChanel.id)
        .on("child_added", (snapshot) => {
          loadedMessages.push(snapshot.val());
          setMessages([...loadedMessages]);
        });
      setLoading(false);
    }
  }, [getMessagesRef, props.currentChanel]);

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
        isChannelStarred={isChannelStarred}
        handleStar={handleStar}
      />

      <Segment>
        <Comment.Group className="messages" style={{ marginBottom: "0.7em" }}>
          {renderMessages()}
        </Comment.Group>
      </Segment>

      <MessagesForm
        currentChanel={props.currentChanel}
        currentUser={props.currentUser}
        isPrivateChannel={props.isPrivateChannel}
        getMessagesRef={getMessagesRef}
        key={props.currentChanel && props.currentChanel.id}
      />
    </>
  );
};

export default connect(null, { setUsersPosts })(Messages);
