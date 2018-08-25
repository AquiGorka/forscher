import React, { Component, Fragment, Children, cloneElement } from 'react';
import Spinner from './Spinner';
import styled from 'styled-components';
import { utils } from 'web3';

const ETHERSCAN = 'etherscan.io';

const NETWORKS = new Map([
  ['1', ''],
  ['3', 'ropsten.'],
  ['42', 'kovan.'],
  ['4', 'rinkeby.'],
]);

const Container = styled.main`
  max-width: 900px;
  margin: auto;
  padding: 1em;
`;

const BlocksUl = styled.ul`
  margin: 2em 0;
  display: grid;
  grid-gap: 1em;
`;

const BlockLi = styled.li`
  background: #fff;
  box-shadow: 0 0 0 1px #ddd;
  border-radius: 3px;
`;

const BlockHeader = styled.details`
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
`;

const Summary = styled.summary`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  background-color: #435e73;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  padding: 1em;
  outline: none;
  cursor: pointer;
  color: #fff;

  &::-webkit-details-marker {
    display: none;
  }
  a {
    color: #fff;
  }
`;

const TransactionsUl = styled.ul`
  margin: 1em 0;
  display: grid;
  grid-gap: 1em;
  border-radius: 3px;
`;

const TransactionLi = styled.li`
  padding: 0 1em;
  display: flex;
  align-items: center;
`;

const When = styled.div`
  font-size: 14px;
`;

const Address = styled.a`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 120px;
  display: inline-block;
`;

const Span = styled.span`
  margin: 0 7px;
`;

const NoEther = styled.div`
  padding: 1em;
`;

const Transactions = ({ transactions, network }) => {
  const ether = transactions.filter(({ value, status }) => value > 0);

  if (!ether.length) {
    return <NoEther>This block does not contain Ether transactions</NoEther>;
  }
  const URL = `https://${NETWORKS.get(network)}${ETHERSCAN}`;

  return (
    <TransactionsUl>
      {ether.map(({ hash, value, from, to, timestamp, gas, gasPrice }) => {
        return (
          <TransactionLi key={hash}>
            <Address
              href={`${URL}/address/${from}`}
              target="_blank"
              title={from}
            >
              {from}
            </Address>
            <Span>sent</Span>
            <a href={`${URL}/tx/${hash}`} target="_blank" title={hash}>
              {utils.fromWei(value, 'ether')} eth
            </a>
            <Span>to</Span>
            <Address href={`${URL}/address/${to}`} target="_blank" title={to}>
              {to}
            </Address>
            <Span />
            <span title={`Gas used: ${gas}; Gas price: ${gasPrice} wei`}>
              (gas fee: {gas * utils.fromWei(gasPrice, 'ether')} eth)
            </span>
          </TransactionLi>
        );
      })}
    </TransactionsUl>
  );
};

const View = ({ blocks, loading, network }) => {
  if (loading) {
    return <Spinner />;
  }
  const net = NETWORKS.get(network);
  const URL = `https://${net}${ETHERSCAN}`;
  const label =
    net === ''
      ? 'Mainnet'
      : net.substr(0, 1).toUpperCase() + net.substr(1, net.length - 2);

  return (
    <Container>
      <h2>Showing Ether transactions for the last 10 blocks on {label}</h2>
      <BlocksUl>
        {blocks.map(({ hash, timestamp, transactions, number }, index) => {
          return (
            <BlockLi key={number}>
              <BlockHeader open={!index}>
                <Summary>
                  <div>
                    Block #<a href={`${URL}/block/${number}`} target="_blank">
                      {number}
                    </a>
                  </div>
                  <When>{new Date(timestamp * 1000).toLocaleTimeString()}</When>
                </Summary>
                <Transactions transactions={transactions} network={network} />
              </BlockHeader>
            </BlockLi>
          );
        })}
      </BlocksUl>
    </Container>
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
      const block = await web3.eth.getBlock(lastNumber - index, true);
      block && blocks.push(block);
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
