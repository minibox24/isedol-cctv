import styled from "styled-components";

import Messages from "./Messages";
import Members from "./Members";
import Channel from "./discord/icons/Channel";

import { EChannels } from "../types";

interface IContentProp {
  channel: EChannels;
}

export default function Content({ channel }: IContentProp) {
  return (
    <Container>
      <Header>
        <Channel />
        <h1>{channel}</h1>
      </Header>
      <ContentContainer>
        <Messages channel={channel} />
        <Members />
      </ContentContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;

  height: 100vh;
`;

const Header = styled.div`
  min-height: 48px;
  display: flex;
  align-items: center;

  background: #36393f;
  color: white;

  z-index: 100;

  /* shadow bottom */
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.2);
`;

const ContentContainer = styled.div`
  display: flex;
  overflow: hidden;
`;
