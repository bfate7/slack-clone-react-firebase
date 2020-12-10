import React, { useState } from "react";
import {
  Accordion,
  Header,
  Icon,
  Segment,
  Image,
  List,
} from "semantic-ui-react";

const MetaPanel = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleAccordian = (e, props) => {
    if (activeIndex === props.index) {
      setActiveIndex(-1);
    } else {
      setActiveIndex(props.index);
    }
  };

  const formatPostsCount = (count) =>
    count === 1 || count === 0 ? `${count} post` : `${count} posts`;

  const displayTopPosters = (usersPosts) => {
    const items = Object.entries(usersPosts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, val], i) => (
        <List.Item key={i}>
          <Image avatar src={val.avatar} />
          <List.Content>
            <List.Header as="a">{key}</List.Header>
            <List.Description>{formatPostsCount(val.count)}</List.Description>
          </List.Content>
        </List.Item>
      ))
      .slice(0, 5);

    return <List>{items}</List>;
  };

  if (props.isPrivateChannel) return null;
  return (
    <Segment loading={!props.currentChanel}>
      <Header as="h3" attached="top">
        about #{props.currentChanel && props.currentChanel.name}
      </Header>
      <Accordion attached>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={handleAccordian}
        >
          <Icon name="dropdown" />
          <Icon name="info" />
          Channel Details
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          {props.currentChanel && props.currentChanel.details}
        </Accordion.Content>
      </Accordion>

      <Accordion attached>
        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={handleAccordian}
        >
          <Icon name="dropdown" />
          <Icon name="user circle" />
          Top Posters
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          {props.usersPosts && displayTopPosters(props.usersPosts)}
        </Accordion.Content>
      </Accordion>

      <Accordion attached>
        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={handleAccordian}
        >
          <Icon name="dropdown" />
          <Icon name="pencil alternate" />
          Created By
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <Header as="h3">
            <Image
              src={props.currentChanel && props.currentChanel.createdBy.avatar}
              circular
            />
            {props.currentChanel && props.currentChanel.createdBy.user}
          </Header>
        </Accordion.Content>
      </Accordion>
    </Segment>
  );
};

export default MetaPanel;
