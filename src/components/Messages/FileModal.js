import React, { useState } from "react";
import { Button, Icon, Input, Modal } from "semantic-ui-react";

const FileModal = (props) => {
  const [file, setFile] = useState(null);
  const authorized_types = ["image/jpeg", "image/png"];

  const addFile = (event) => setFile(event.target.files[0]);

  const sendFile = (event) => {
    if (file !== null && authorized_types.includes(file.type)) {
      props.uploadFile(file, { metadata: { contentType: file.type } });
      props.closeModal();
    }
  };

  return (
    <Modal open={props.modal}>
      <Modal.Header>Select an Image file</Modal.Header>
      <Modal.Content>
        <Input
          fluid
          label="File types : jpg, png"
          name="file"
          type="file"
          onChange={addFile}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button color="green" inverted onClick={sendFile}>
          <Icon name="checkmark" /> Send
        </Button>
        <Button color="red" inverted onClick={props.closeModal}>
          <Icon name="remove" /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default FileModal;
