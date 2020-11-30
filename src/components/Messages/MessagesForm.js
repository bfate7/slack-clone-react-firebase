import React, { useState } from "react";
import firebase from "../../firebase";
import { Button, Input, Segment } from "semantic-ui-react";
import FileModal from "./FileModal";
import { v4 as uuidv4 } from "uuid";
import ProgressBar from "./ProgressBar";

const storageRef = firebase.storage().ref();

const MessagesForm = (props) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  //upload
  const [uploadState, setUploadState] = useState(false);
  const [percentUpload, setPercentUpload] = useState(0);

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
        .child(props.currentChanel.id)
        .push()
        .set(createMessage())
        .then(() => {
          setLoading(false);
          setMessage("");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const sendFileMessage = (fileURL) => {
    props
      .getMessagesRef()
      .child(props.currentChanel.id)
      .push()
      .set(createMessage(fileURL))
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  };

  const getUploadPath = () => {
    if (props.isPrivateChannel) {
      return `chat/private-${props.currentChanel.id}`;
    } else {
      return `chat/public-${props.currentChanel.id}`;
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

  return (
    <Segment className="message__form">
      <Input
        fluid={true}
        name="message"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        style={{ marginBottom: "0.7em" }}
        label={<Button icon={"add"} />}
        labelPosition="left"
        placeholder="Write your message"
        disabled={loading}
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
          onClick={() => setModal(true)}
          disabled={uploadState}
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
