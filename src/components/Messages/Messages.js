import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";

const Messages = () => (
  <>
    <MessagesHeader />

    <Segment>
      <Comment.Group className="messages" style={{ marginBottom: "0.7em" }}>
        {/* Messages */}
      </Comment.Group>
    </Segment>

    <MessagesForm />
  </>
);

export default Messages;
