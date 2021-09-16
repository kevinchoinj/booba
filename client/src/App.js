import { useEffect, useState } from "react";
import './App.css';
import styled from "styled-components";
import Socket from "./components/Socket";

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 1300px;
  justify-content: center;
`;
const StyledBlock = styled.a`
  width: 325px;
  padding: 1rem;
  color: #dedede;
  text-decoration: none;
  font-size: 13px;
  &:hover {
    color: #9147ff;
  }
`;
const StyledPreview = styled.img`
  width: 100%;
  box-shadow: 0 0 20px rgb(0 0 0 / 50%);
  object-fit: contain;
  transition: .2s ease;
  &:hover {
    transform: scale(1.1, 1.1);
  }
`;
const StyledPreviewWrapper = styled.div`
  width: 293px;
  height: 165px;
  position: relative;
  margin-bottom: 6px;
  overflow: hidden;
`;
const StyledViewerCount = styled.div`
  position: absolute;
  background-color: rgba(0,0,0,.8);
  border-radius: 8px;
  bottom: 8px;
  right: 8px;
  padding: 3px 6px;
  font-size: 12px;
`;
const StyledFooter = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  img {
    width: 28px;
    height: 28px;
    border-radius: 28px;
    margin-right: 1rem;
  }
`;
const StyledFooterText = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;
const StyledTitle = styled.div`
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

function App() {
  const [boobaData, setBoobaData] = useState([])
  useEffect(() => {
    fetch('/api/v1/data')
      .then(data => data.json())
      .then(json => setBoobaData(json))
  }, [])
  return (
    <StyledWrapper className="App">
      <Socket setBoobaData={setBoobaData} />
      <StyledContainer>
        {boobaData.map((val) => {
          return (
            <StyledBlock key={val.preview.large} href={`https://twitch.tv/${val.channel.display_name}`}>
              <StyledPreviewWrapper>
                <StyledPreview src={`${val.preview.large}?0.${Date.now()}`} alt={val._id}/>
                <StyledViewerCount>
                  {val.viewers} viewers
                </StyledViewerCount>
              </StyledPreviewWrapper>
              <StyledFooter>
                <img src={val.channel.logo} alt={val.channel.display_name} />
                <StyledFooterText>
                  <StyledTitle>{val.channel.status}</StyledTitle>
                  {val.channel.display_name}
                </StyledFooterText>
              </StyledFooter>
            </StyledBlock>
          )
        })}
      </StyledContainer>
    </StyledWrapper>
  );
}

export default App;
