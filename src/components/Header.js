import React from 'react';
import styled from 'styled-components';

const Header = styled.header`
  position: sticky;
  top: 0;
  background: #fff;
  box-shadow: 0 0 0.2rem rgba(0, 0, 0, 0.1), 0 0.2rem 0.4rem rgba(0, 0, 0, 0.2);
  padding: 1em;
  font-family: 'Oswald', sans-serif;
  font-size: 16px;
`;

const H1 = styled.h1`
  max-width: 600px;
  margin: auto;
`;

export default () => (
  <Header>
    <H1>Forscher</H1>
  </Header>
);
