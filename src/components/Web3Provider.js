import React, { Component, Fragment, Children, cloneElement } from 'react';
import Web3 from 'web3';
import styled from 'styled-components';
import Header from './Header';
import Spinner from './Spinner';

const LOADING = 'loading';
const CONNECTED = 'metamask installed';
const DISCONNECTED = 'no metamask';

const NoMetamask = styled.h2`
  width: 600px;
  margin: 150px auto;
  text-align: center;
  background: #fff;
  padding: 3em 0;
  box-shadow: 0 0 0 1px #ccc;
`;

export default class Web3Provider extends Component {
  state = { mode: LOADING, web3: null, network: null };

  async componentDidMount() {
    if (typeof window.web3 === 'undefined') {
      this.setState({ mode: DISCONNECTED });
      return;
    }
    const web3 = new Web3(window.web3.currentProvider);
    const network = await new Promise(r => {
      window.web3.version.getNetwork((err, network) => r(network));
    });
    this.setState({ mode: CONNECTED, web3, network });
  }

  render() {
    const { mode, web3, network } = this.state;
    const { children, ...rest } = this.props;

    return (
      <Fragment>
        {mode === CONNECTED && (
          <Fragment>
            {Children.map(children, child =>
              cloneElement(child, { ...rest, web3, network }),
            )}
          </Fragment>
        )}
        {mode === LOADING && (
          <Fragment>
            <Header />
            <Spinner />
          </Fragment>
        )}
        {mode === DISCONNECTED && (
          <Fragment>
            <Header />
            <NoMetamask>Please install Metamask</NoMetamask>
          </Fragment>
        )}
      </Fragment>
    );
  }
}
