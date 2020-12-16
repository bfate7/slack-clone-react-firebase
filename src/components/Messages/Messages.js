import React, { useEffect, useState, useCallback, useRef } from "react";
import { connect } from "react-redux";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import Message from "./Message";
import firebase from "../../firebase";
import { setUsersPosts } from "../../actions/userActions";
import TypingIndicator from "./TypingIndicator";
import MessageSkeleton from "./MessageSkeleton";

// db messages ref
const usersRef = firebase.database().ref("users");
const messagesRef = firebase.database().ref("messages");
const privateMessagesRef = firebase.database().ref("privateMessages");
const typingRef = firebase.database().ref("typing");
const presenceRef = firebase.database().ref("presence");

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
  //typingUsers
  const [typingUsers, _setTypingUsers] = useState([]);
  const typingUsersStateRef = useRef(typingUsers);

  //messages end ref
  const messagesEndRef = useRef(null);

  const setTypingUsers = (users) => {
    typingUsersStateRef.current = users;
    _setTypingUsers(users);
  };

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

  const addMessagelistner = useCallback(
    (channelId) => {
      setMessages([]);
      const loadedMessages = [];
      getMessagesRef()
        .child(channelId)
        .on("child_added", (snapshot) => {
          loadedMessages.push(snapshot.val());
          setMessages([...loadedMessages]);
        });

      setLoading(false);
    },
    [getMessagesRef]
  );

  const addtypingListner = useCallback((channelId, userId) => {
    //listern for typing user
    const users = [];
    typingRef.child(channelId).on("child_added", (snap) => {
      if (snap.key !== userId) {
        users.push({
          id: snap.key,
          name: snap.val(),
        });
      }
      setTypingUsers(users);
    });

    //listern for typing user removed
    typingRef.child(channelId).on("child_removed", (snap) => {
      const index = typingUsersStateRef.current.findIndex(
        (user) => user.id === snap.key
      );
      if (index !== -1) {
        const updatedTypingUsers = typingUsersStateRef.current.filter(
          (user) => user.id !== snap.key
        );

        setTypingUsers([...updatedTypingUsers]);
      }
    });

    //remove user typing data when user goes offfline
    presenceRef.on("child_removed", (snap) => {
      typingRef.child(channelId).child(snap.key).remove();
    });
  }, []);

  const addListners = useCallback(() => {
    if (props.currentChanel && props.currentUser) {
      addMessagelistner(props.currentChanel.id);
      addtypingListner(props.currentChanel.id, props.currentUser.uid);
    }

    return () => {
      messagesRef.off();
      typingRef.off();
    };
  }, [
    props.currentChanel,
    props.currentUser,
    addMessagelistner,
    addtypingListner,
  ]);

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

  const displatMessagesSkeleton = () => (
    <React.Fragment>
      {[...Array(10)].map((_, i) => (
        <MessageSkeleton key={i} />
      ))}
    </React.Fragment>
  );

  const handleSearch = (e) => {
    setSearchLoading(true);
    setSearchTerm(e.target.value);
    runSearch();
  };

  const renderMessages = () => {
    if (loading) {
      return displatMessagesSkeleton();
    } else if (searchTerm) {
      return displatMessages(searchResults);
    } else {
      return displatMessages(messages);
    }
  };

  //scroll to bootim when new message
  useEffect(() => {
    if (!loading) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

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

          {typingUsers.length > 0 &&
            typingUsers.map((user) => (
              <TypingIndicator key={user.id} username={user.name} />
            ))}

          <div ref={messagesEndRef}></div>
        </Comment.Group>
      </Segment>
    </>
  );
};

export default connect(null, { setUsersPosts })(Messages);
