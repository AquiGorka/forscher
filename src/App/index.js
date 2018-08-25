import React, { Component } from 'react';
import Web3Provider from '../components/Web3Provider'

class App extends Component {
  render() {
    return <Web3Provider>
      <div>Forscher</div>
    </Web3Provider>;
  }
}

export default App;
