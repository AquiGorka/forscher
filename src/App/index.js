import React, { Component } from 'react';
import Web3Provider from '../components/Web3Provider';
import BlockPolling from '../components/BlockPolling';

class App extends Component {
  render() {
    return (
      <Web3Provider>
        <BlockPolling>
          <div>Forscher</div>
        </BlockPolling>
      </Web3Provider>
    );
  }
}

export default App;
