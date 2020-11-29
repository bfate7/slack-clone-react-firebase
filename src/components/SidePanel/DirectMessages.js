import React, { useEffect, useState, useCallback, useRef } from "react";
import { Icon, Menu } from "semantic-ui-react";
import firebase from "../../firebase";

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
      console.log("connecting snap value", snap.val());
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
        console.log("user", user);
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
          console.log("user disconnected", user);
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

  return (
    <Menu.Menu className="menu" style={{ paddingTop: "2em" }}>
      <Menu.Item>
        <span>
          <Icon name="mail" /> Direct Messages
        </span>{" "}
        ({users.length})
      </Menu.Item>

      {users.map((user) => (
        <Menu.Item key={user.uid}>
          <Icon name="circle" color={isUserOnline(user) ? "green" : "red"} />@
          {user.username}
        </Menu.Item>
      ))}
    </Menu.Menu>
  );
};

export default DirectMessages;
