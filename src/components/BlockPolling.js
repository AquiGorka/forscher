import React, { Component, Fragment, Children, cloneElement } from 'react';

export default class BlockPoll extends Component {
  state = { blocks: [], intervalId: null };

  componentDidMount() {
    if (this.props.web3) {
      this.startPolling();
    }
  }

  componentDidUnmouint() {
    this.stopPolling();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.web3 && nextProps.web3) {
      this.startPolling();
    }
  }

  render() {
    const { children, ...rest } = this.props;
    const { blocks } = this.state;

    return (
      <Fragment>
        {Children.map(children, child =>
          cloneElement(child, { ...rest, blocks }),
        )}
      </Fragment>
    );
  }

  startPolling() {
    const { web3, interval = 1000 } = this.props;
    const intervalId = setInterval(async () => {
      const blockNumber = await web3.eth.getBlockNumber();
      const block = web3.eth.getBlock(blockNumber);
      this.setState({
        blocks: Array.from(new Set([block, ...this.state.blocks])),
      });
    }, interval);
    this.setState({ intervalId });
  }

  stopPolling() {
    clearInterval(this.state.intervalId);
  }
}
