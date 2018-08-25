import React, { Component, Fragment, Children, cloneElement } from 'react';
import Web3 from 'web3';
import Header from './Header';
import Spinner from './Spinner';

const LOADING = 'loading';
const CONNECTED = 'metamask installed';
const DISCONNECTED = 'no metamask';

export default class Web3Provider extends Component {
  state = { mode: LOADING, web3: null };

  componentDidMount() {
    if (typeof window.web3 === 'undefined') {
      this.setState({ mode: DISCONNECTED });
      return;
    }
    const web3 = new Web3(window.web3.currentProvider);
    this.setState({ mode: CONNECTED, web3 });
  }

  render() {
    const { mode, web3 } = this.state;
    const { children, ...rest } = this.props;

    return (
      <Fragment>
        {mode === CONNECTED && (
          <Fragment>
            {Children.map(children, child =>
              cloneElement(child, { ...rest, web3 }),
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
            <div>Please install Metamask</div>
          </Fragment>
        )}
      </Fragment>
    );
  }
}
