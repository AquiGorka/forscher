import React from 'react';
import styled from 'styled-components';

const Header = styled.header`
  position: sticky;
  top: 0;
  background: #fff;
  box-shadow: 0 0 0.2rem rgba(0, 0, 0, 0.1), 0 0.2rem 0.4rem rgba(0, 0, 0, 0.2);
  font-family: 'Oswald', sans-serif;
  font-size: 16px;
  padding: 1em;
`;

const Wrap = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 900px;
  margin: auto;
`;

const H1 = styled.h1`
  padding: 0;
  margin: 0;
`;

const Legend = styled.div`
  position: relative;
  top: -3px;
`;

export default () => (
  <Header>
    <Wrap>
      <H1>Forscher</H1>
      <Legend>
        Last update: {new Date().toLocaleString()}
      </Legend>
    </Wrap>
  </Header>
);
