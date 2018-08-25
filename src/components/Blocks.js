import React, { Component, Fragment, Children, cloneElement } from 'react';
import Spinner from './Spinner';

const Transactions = ({ transactions }) => {
  const ether = transactions.filter(({ value, status }) => value > 0);

  if (!ether.length) {
    return <div>This block does not contain transactions sending ether</div>;
  }

  return (
    <ul>
      {ether.map(({ hash, value, from, to, gas }) => {
        return (
          <li key={hash}>
            <div>Hash {hash}</div>
            <div>Value {value}</div>
            <div>From {from}</div>
            <div>To {to}</div>
            <div>Gas {gas}</div>
          </li>
        );
      })}
    </ul>
  );
};

const View = ({ blocks, loading }) => {
  if (loading) {
    return <Spinner />;
  }
  return (
    <ul>
      {blocks.map(({ hash, timestamp, transactions, number }) => {
        return (
          <li key={number}>
            <div>Number: {number}</div>
            <div>Timestamp: {timestamp}</div>
            <div>Hash: {hash}</div>
            <Transactions transactions={transactions} />
          </li>
        );
      })}
    </ul>
  );
};

class Store extends Component {
  state = { blocks: [], loading: true };

  componentDidMount() {
    if (this.props.web3) {
      this.get();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.web3 && nextProps.web3) {
      this.get();
    }
  }

  render() {
    const { children, ...rest } = this.props;

    return (
      <Fragment>
        {Children.map(children, child =>
          cloneElement(child, { ...rest, ...this.state, get: this.get }),
        )}
      </Fragment>
    );
  }

  get = async () => {
    this.setState({ laoding: true });
    const { web3, length = 10 } = this.props;
    const lastNumber = await web3.eth.getBlockNumber();
    const blocks = [];
    for (const index of Array.from(Array(length).keys())) {
      blocks.push(await web3.eth.getBlock(lastNumber - index, true));
    }
    this.setState({
      blocks: [
        ...this.state.blocks,
        ...blocks.filter(
          ({ hash }) => !this.state.blocks.find(b => b.hash === hash),
        ),
      ],
      loading: false,
    });
  };
}

export { Store, View };
