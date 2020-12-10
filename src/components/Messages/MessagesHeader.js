import React from "react";
import { Header, Icon, Input, Segment } from "semantic-ui-react";

const MessagesHeader = (props) => {
  const displayChannelName = (channel) => {
    return props.isPrivateChannel ? `@${channel.name}` : `#${channel.name}`;
  };

  return (
    <Segment clearing>
      <Header as="h3" floated="left">
        {props.currentChanel && displayChannelName(props.currentChanel)}

        {!props.isPrivateChannel && (
          <span>
            <Icon
              name={props.isChannelStarred ? "star" : "star outline"}
              color={props.isChannelStarred ? "yellow" : "black"}
              onClick={props.handleStar}
            />
          </span>
        )}

        <Header.Subheader>
          {props.countUniqueUsers}{" "}
          {props.countUniqueUsers === 0 || props.countUniqueUsers === 1
            ? "User"
            : "Users"}
        </Header.Subheader>
      </Header>
      <Header floated="right">
        <Input
          loading={props.searchLoading}
          size="mini"
          icon="search"
          name="searchTerm"
          placeholder="Search Messages"
          onChange={(e) => props.handleSearch(e)}
        />
      </Header>
    </Segment>
  );
};

export default MessagesHeader;
