import React, { useState, useEffect, useCallback, useRef } from "react";
import { connect } from "react-redux";
import { Icon, Menu } from "semantic-ui-react";
import {
  setPrivateChannel,
  setCurrentChannel,
} from "../../actions/channelActions";
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

  const StarredChannelsList = () =>
    starredChannels.length > 0 &&
    starredChannels.map((channel) => (
      <Menu.Item
        key={channel.id}
        name={channel.name}
        style={{ opavity: "0.8" }}
        onClick={() => changeChannel(channel)}
        active={props.currentChannel && props.currentChannel.id === channel.id}
      >
        # {channel.name}
      </Menu.Item>
    ));

  const changeChannel = (channel) => {
    props.setCurrentChannel(channel);
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
      <StarredChannelsList />
    </Menu.Menu>
  );
};

export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred);
