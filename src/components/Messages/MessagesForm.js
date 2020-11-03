import React, { useState } from "react";
import firebase from "../../firebase";
import { Button, Input, Segment } from "semantic-ui-react";
import FileModal from "./FileModal";
import { v4 as uuidv4 } from "uuid";

const MessagesForm = (props) => {
  const messagesRef = firebase.database().ref("messages");
  const storageRef = firebase.storage().ref();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  //upload
  const [uploadState, setUploadState] = useState(null);
  const [percentUpload, setPercentUpload] = useState(0);

  const createMessage = (fileURL = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: props.currentUser.uid,
        name: props.currentUser.displayName,
        avatar: props.currentUser.photoURL,
      },
    };

    if (fileURL) {
      message["image"] = fileURL;
    } else {
      message["content"] = message;
    }

    return message;
  };

  const sendMessage = (e) => {
    if (message) {
      setLoading(true);
      messagesRef
        .child(props.currentChanel.id)
        .push()
        .set(createMessage())
        .then((res) => {
          setLoading(false);
          setMessage("");
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const sendFileMessage = (fileURL) => {
    messagesRef
      .child(props.currentChanel.id)
      .push()
      .set(createMessage(fileURL))
      .then(() => {
        setUploadState("done");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadFile = (file, metadata) => {
    //set uploading state
    setUploadState("uploading");
    //set filePath
    const filePath = `chat/public/${uuidv4()}`;
    //set uploadTask
    const uploadTask = storageRef.child(filePath).put(file, metadata);

    uploadTask.on(
      "state_changed",
      (snap) => {
        const percentUpload = Math.round(
          (snap.bytesTransferred / snap.totalBytes) * 100
        );
        console.log(percentUpload);

        setPercentUpload(percentUpload);
      },
      (err) => {
        alert("err uploading");
      }
    );

    uploadTask.then(() => {
      setUploadState("done");
      uploadTask.snapshot.ref.getDownloadURL().then((fileURL) => {
        sendFileMessage(fileURL);
      });
    });
  };

  return (
    <Segment className="message__form">
      <Input
        fluid
        name="message"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        style={{ marginBottom: "0.7em" }}
        label={<Button icon={"add"} />}
        labelPosition="left"
        placeholder="Write your message"
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
        />
      </Button.Group>
      <FileModal
        modal={modal}
        closeModal={() => setModal(false)}
        uploadFile={uploadFile}
      />
    </Segment>
  );
};

export default MessagesForm;