import React, { useState, useEffect, useCallback, useRef } from "react";
import { connect } from "react-redux";
import { Icon, Menu } from "semantic-ui-react";
import {
  setPrivateChannel,
  setCurrentChanel,
} from "../../actions/chanelActions";
import firebase from "../../firebase";

const usersRef = firebase.database().ref("users");

const Starred = (props) => {
  const [starredChannels, _setStarredChannels] = useState([]);
  //ref to starredChannels to avoid loop render
  const starredChannelsRef = useRef(starredChannels);
  const setStarredChannels = (channels) => {
    starredChannelsRef.current = channels;
    _setStarredChannels(channels);
  };

  const StarredChanelsList = () =>
    starredChannels.length > 0 &&
    starredChannels.map((chanel) => (
      <Menu.Item
        key={chanel.id}
        name={chanel.name}
        style={{ opavity: "0.8" }}
        onClick={() => changeChanel(chanel)}
        active={props.currentChanel && props.currentChanel.id === chanel.id}
      >
        # {chanel.name}
      </Menu.Item>
    ));

  const changeChanel = (channel) => {
    props.setCurrentChanel(channel);
    props.setPrivateChannel(false);
  };

  const addListners = useCallback((userId) => {
    usersRef
      .child(userId)
      .child("starred")
      .on("child_added", (snap) => {
        setStarredChannels([...starredChannelsRef.current, snap.val()]);
      });

    usersRef
      .child(userId)
      .child("starred")
      .on("child_removed", (snap) => {
        const idToremove = snap.key;

        const updatedStarredChannels = starredChannelsRef.current.filter(
          (channel) => channel.id !== idToremove
        );

        setStarredChannels([...updatedStarredChannels]);
      });
  }, []);

  useEffect(() => {
    if (props.currentUser) {
      addListners(props.currentUser.uid);
    }
  }, [addListners, props.currentUser]);

  return (
    <Menu.Menu>
      <Menu.Item>
        <span>
          <Icon name="star" /> Starred ({starredChannels.length})
        </span>
      </Menu.Item>
      <StarredChanelsList />
    </Menu.Menu>
  );
};

export default connect(null, { setCurrentChanel, setPrivateChannel })(Starred);
