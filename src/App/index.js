import React, { Component } from 'react';
import Web3Provider from '../components/Web3Provider';
import { Store as BlocksStore, View as BlocksView } from '../components/Blocks';
import Header from '../components/Header'

class App extends Component {
  render() {
    return (
      <Web3Provider>
        <BlocksStore>
          <Header />
          <BlocksView />
        </BlocksStore>
      </Web3Provider>
    );
  }
}

export default App;
