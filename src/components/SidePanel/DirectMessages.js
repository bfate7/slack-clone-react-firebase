import React, { useEffect, useState, useCallback, useRef } from "react";
import { connect } from "react-redux";
import { Icon, Menu } from "semantic-ui-react";
import firebase from "../../firebase";
import {
  setCurrentChanel,
  setPrivateChannel,
} from "../../actions/chanelActions";

const usersRef = firebase.database().ref("users");
const connectedRef = firebase.database().ref(".info/connected");
const presenceRef = firebase.database().ref("presence");

const DirectMessages = (props) => {
  const [users, _setUsers] = useState([]);

  //get users ref
  const getUsersRef = useRef(users);

  const setUsers = (array) => {
    getUsersRef.current = array;
    _setUsers(array);
  };

  //add presence listner
  //create a presence record for current user
  const addPressenceListner = useCallback((currentUserID) => {
    connectedRef.on("value", (snap) => {
      if (snap.val()) {
        const ref = presenceRef.child(currentUserID);
        ref.set(true);
        ref.onDisconnect().remove();
      }
    });
  }, []);

  //init connected users
  const initUsers = useCallback((currentUserID) => {
    const loadedUsers = [];
    usersRef.on("child_added", (snap) => {
      if (currentUserID !== snap.key) {
        let user = snap.val();
        user["uid"] = snap.key;
        user["status"] = "offline";
        loadedUsers.push(user);
        setUsers([...loadedUsers]);
      }
    });
  }, []);

  //update user status when go online
  const addOnConnectListner = useCallback(() => {
    presenceRef.on("child_added", (snap) => {
      const updatedUsers = getUsersRef.current.map((user) => {
        if (user.uid === snap.key) {
          user["status"] = "online";
        }
        return user;
      });
      setUsers(...[updatedUsers]);
    });
  }, []);

  //update user status when go offline
  const addOnDisconnectListner = useCallback(() => {
    presenceRef.on("child_removed", (snap) => {
      const updatedUsers = getUsersRef.current.map((user) => {
        if (user.uid === snap.key) {
          user["status"] = "offline";
        }
        return user;
      });
      setUsers(updatedUsers);
    });
  }, [getUsersRef]);

  const addListners = useCallback(
    (currentUserID) => {
      addPressenceListner(currentUserID);
      initUsers(currentUserID);
      addOnConnectListner();
      addOnDisconnectListner();
    },
    [
      addOnConnectListner,
      addOnDisconnectListner,
      addPressenceListner,
      initUsers,
    ]
  );

  useEffect(() => {
    if (props.currentUser) {
      addListners(props.currentUser.uid);
    }
    return () => {
      presenceRef.off();
      usersRef.off();
      connectedRef.off();
    };
  }, [props.currentUser, addListners]);

  const isUserOnline = (user) => user.status === "online";

  const getChannelId = (userId) => {
    const currentUserID = props.currentUser.uid;
    return userId < currentUserID
      ? `${currentUserID}/${userId}`
      : `${userId}/${currentUserID}`;
  };

  const changeChannel = (user) => {
    const channelId = getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.username,
    };

    props.setCurrentChanel(channelData);
    props.setPrivateChannel(true);
  };

  return (
    <Menu.Menu className="menu" style={{ paddingTop: "2em" }}>
      <Menu.Item>
        <span>
          <Icon name="mail" /> Direct Messages
        </span>{" "}
        ({users.length})
      </Menu.Item>

      {users.map((user) => (
        <Menu.Item key={user.uid} onClick={() => changeChannel(user)}>
          <Icon name="circle" color={isUserOnline(user) ? "green" : "red"} />@
          {user.username}
        </Menu.Item>
      ))}
    </Menu.Menu>
  );
};

export default connect(null, { setCurrentChanel, setPrivateChannel })(
  DirectMessages
);
