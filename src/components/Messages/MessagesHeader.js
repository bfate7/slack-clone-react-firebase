import React from "react";
import { Header, Icon, Input, Segment } from "semantic-ui-react";

const MessagesHeader = (props) => (
  <Segment clearing>
    <Header as="h3" floated="left">
      {props.currentChanel && "#" + props.currentChanel.name}
      <span>
        <Icon name="star outline" color="black" />
      </span>
      <Header.Subheader>
        {props.countUniqueUsers}{" "}
        {props.countUniqueUsers === 0 || props.countUniqueUsers === 1
          ? "User"
          : "User"}
      </Header.Subheader>
    </Header>
    <Header floated="right">
      <Input
        size="mini"
        icon="search"
        name="searchTerm"
        placeholder="Search Messages"
      />
    </Header>
  </Segment>
);

export default MessagesHeader;
