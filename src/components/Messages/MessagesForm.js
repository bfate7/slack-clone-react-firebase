import React, { useRef, useState } from "react";
import firebase from "../../firebase";
import { Button, Input, Segment } from "semantic-ui-react";
import FileModal from "./FileModal";
import { v4 as uuidv4 } from "uuid";
import ProgressBar from "./ProgressBar";

//emoji picker
import { Picker, emojiIndex } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

const storageRef = firebase.storage().ref();
const typingRef = firebase.database().ref("typing");

const MessagesForm = (props) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const messageInputRef = useRef(null);

  //upload
  const [uploadState, setUploadState] = useState(false);
  const [percentUpload, setPercentUpload] = useState(0);

  //emojie picker state
  const [emojiPicker, setEmojiePicker] = useState(false);

  const createMessage = (fileURL = null) => {
    const messagetoSend = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: props.currentUser.uid,
        name: props.currentUser.displayName,
        avatar: props.currentUser.photoURL,
      },
    };

    if (fileURL) {
      messagetoSend["image"] = fileURL;
    } else {
      messagetoSend["content"] = message;
    }

    return messagetoSend;
  };

  const sendMessage = (e) => {
    if (message) {
      setLoading(true);
      props
        .getMessagesRef()
        .child(props.currentChannel.id)
        .push()
        .set(createMessage())
        .then(() => {
          setLoading(false);
          setEmojiePicker(false);
          setMessage("");
          typingRef
            .child(props.currentChannel.id)
            .child(props.currentUser.uid)
            .remove();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const sendFileMessage = (fileURL) => {
    props
      .getMessagesRef()
      .child(props.currentChannel.id)
      .push()
      .set(createMessage(fileURL))
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  };

  const getUploadPath = () => {
    if (props.isPrivateChannel) {
      return `chat/private/${props.currentChannel.id}`;
    } else {
      return `chat/public/${props.currentChannel.id}`;
    }
  };

  const uploadFile = (file, metadata) => {
    //set uploading state
    setUploadState(true);
    //set filePath
    const filePath = `${getUploadPath()}/${uuidv4()}`;
    //set uploadTask
    const uploadTask = storageRef.child(filePath).put(file, metadata);

    uploadTask.on(
      "state_changed",
      (snap) => {
        const percentUpload = Math.round(
          (snap.bytesTransferred / snap.totalBytes) * 100
        );
        setPercentUpload(percentUpload);
      },
      (err) => {
        console.log(err);
      }
    );

    uploadTask.then(() => {
      setUploadState(false);
      uploadTask.snapshot.ref.getDownloadURL().then((fileURL) => {
        sendFileMessage(fileURL);
      });
    });
  };

  const handleKeyDown = () => {
    if (message) {
      typingRef
        .child(props.currentChannel.id)
        .child(props.currentUser.uid)
        .set(props.currentUser.displayName);
    } else {
      typingRef
        .child(props.currentChannel.id)
        .child(props.currentUser.uid)
        .remove();
    }
  };

  const handleTogglePicker = () => {
    setEmojiePicker(!emojiPicker);
  };

  const handleAddEmoji = (emoji) => {
    const newMessage = colonToUnicode(`${message} ${emoji.colons}`);
    setMessage(newMessage);
    messageInputRef.current.focus();
  };

  const colonToUnicode = (message) => {
    return message.replace(/:[A-Za-z0-9_+-]+:/g, (x) => {
      x = x.replace(/:/g, "");
      let emoji = emojiIndex.emojis[x];
      if (typeof emoji !== "undefined") {
        let unicode = emoji.native;
        if (typeof unicode !== "undefined") {
          return unicode;
        }
      }
      x = ":" + x + ":";
      return x;
    });
  };

  return (
    <Segment className="message__form">
      <div className="picker__container">
        {emojiPicker && (
          <Picker
            set="apple"
            title="pick your emoji"
            emoji="point_up"
            style={{ marginBottom: "1em" }}
            onSelect={handleAddEmoji}
          />
        )}
      </div>
      <Input
        fluid={true}
        name="message"
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        value={message}
        style={{ marginBottom: "0.7em" }}
        label={
          <Button
            icon={!emojiPicker ? "add" : "remove"}
            onClick={handleTogglePicker}
          />
        }
        labelPosition="left"
        placeholder="Write your message"
        disabled={loading}
        ref={messageInputRef}
      />
      <Button.Group icon widths="2">
        <Button
          color="orange"
          content="Add Reply"
          labelPosition="left"
          icon="edit"
          onClick={sendMessage}
          loading={loading}
          disabled={loading || !props.currentChannel}
        />
        <Button
          color="teal"
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
          onClick={() => setModal(true)}
          disabled={uploadState || !props.currentChannel}
        />
      </Button.Group>
      <ProgressBar percentUpload={percentUpload} uploadState={uploadState} />
      <FileModal
        modal={modal}
        closeModal={() => setModal(false)}
        uploadFile={uploadFile}
      />
    </Segment>
  );
};

export default MessagesForm;
