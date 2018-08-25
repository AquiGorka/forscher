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

  startPolling = async () => {
    const { web3, interval = 1000, length = 10 } = this.props;
    // get initial N blocks
    const lastNumber = await web3.eth.getBlockNumber();
    new Array(length).fill(0).forEach(async (_, index) => {
      const block = await web3.eth.getBlock(lastNumber - index - 1);
      this.setState({ blocks: [...this.state.blocks, block] });
    });
    // interval
    const intervalId = setInterval(async () => {
      const blockNumber = await web3.eth.getBlockNumber();
      const block = await web3.eth.getBlock(blockNumber);
      const blocks = [
        ...this.state.blocks,
        ...(this.state.blocks.find(({ hash }) => hash === block.hash)
          ? []
          : [block]),
      ];
      this.setState({ blocks });
    }, interval);
    this.setState({ intervalId });
  };

  stopPolling() {
    clearInterval(this.state.intervalId);
  }
}
