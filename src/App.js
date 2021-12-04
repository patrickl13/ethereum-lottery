import './App.css';
import web3 from './web3';
import lottery from './lottery';
import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

class App extends React.Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    previousWinners: [],
    value: '',
    message: '',
    winnerMessage: '',
    pendingWinner: false,
    pending: false,
    invalidNumber: true
  };

  async componentDidMount() {
    this.getContractInfo();
  }

  async getContractInfo() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const previousWinners = await lottery.methods.getPreviousWinners().call();
    console.log(previousWinners);
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance, previousWinners });
  }

  enterLottery = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    let error = false;
    this.setState({message: 'Waiting on transaction...'});
    this.setState({pending: true});

    
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    }).catch(e => {
      error = true;
    });

    if (error) {
      this.setState({message: 'Transaction failed! Please try again.'});
      this.setState({pending: false});
    } else {
      this.setState({message: 'You have been entered in the lottery!'});
      this.setState({pending: false});
      this.getContractInfo();
    }
  }

  pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();
    let error = false;
    this.setState({pendingWinner: true});
    
    this.setState({winnerMessage: 'Waiting on transaction...'});
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    }).catch(e => {
      error = true;
    });

    if (error) {
      this.setState({winnerMessage: 'Transaction failed! Are you the manager?'});
      this.setState({pendingWinner: false});
    } else {
      this.setState({winnerMessage: 'A winner has been picked!'});
      this.setState({pendingWinner: false});
      this.getContractInfo();
    }
  }

  handleInputChange(event) {
    if(event.target.value > 0.01) {
      this.setState({ value: event.target.value });
      this.setState({ invalidNumber: false });
    } else {
      this.setState({ invalidNumber: true });
    }
  }

  render() {
    return (
      <div className="App">
        <h2> Ethereum Lottery </h2>
        <div className='warning-banner'>
          <p> 
            This app exists on the Rinkeby Test Network, and is for demonstration purposes only. No real money is used.
          </p>
          <p> 
            Need some funds to test it out? Check out &nbsp;
            <a href='https://faucets.chain.link/rinkeby?_ga=2.82784018.566613934.1635863329-2011873062.1635514771'>
              this
            </a>
            &nbsp; Faucet.
          </p>
          <p> *MetaMask chrome extension is required.</p>
        </div>
        <div className='enter-lottery-container'>
          <h4> Want to try your luck?</h4>
          <div className="input-container">
            <TextField 
            id="outlined-basic" 
            label="Amount of Ether:" 
            variant="outlined"
            autoComplete="off"
            error={this.state.invalidNumber}
            helperText={this.state.invalidNumber ? "input must be a number greater than 0.01" : ""} 
            onChange={event => this.handleInputChange(event)}
            />
          </div>
          <Button 
          variant="contained" 
          disabled={this.state.invalidNumber} 
          onClick={this.enterLottery}>I'm feeling lucky</Button>
          <div>
          <p> Previous winners: </p> 
            {this.state.previousWinners.length > 0 ? (
              this.state.previousWinners.map((player, index) => {
                return <p key={index}> {player} </p>;
              })
            ) 
            : 
            (
              <p> No winners yet.</p>
            )
            }
          </div>
        </div>
        <div className="transaction-container">
          <div> {this.state.pending ? <CircularProgress color="inherit" /> : null} </div>
          <div> {this.state.message} </div>
        </div>
        <div className='information-banner'>
          <p> 
          This contract is managed by: {this.state.manager}
          </p>
          <p>
            There are currently {this.state.players.length} people entered,
            competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
          </p>
          <h4> Contestants:</h4>
          {
            this.state.players.length > 0 ? 
            (
              this.state.players.map((player, index) => {
                return <p key={index}> {player} </p>;
              })
            ) 
            :
            (
              <p> There are no contestants entered.</p>
            )
          }
        </div>
        <div className="admin-container">
        <h4> Manager Controls</h4>
        <p> This zone will not work unless you are the manager. Please don't waste gas trying to trigger the lottery.</p>
        <Button variant="contained" onClick={this.pickWinner}>Pick Winner</Button>
        </div>
        <div className="transaction-container">
          <div> {this.state.pendingWinner ? <CircularProgress color="inherit" /> : null} </div>
          <div> {this.state.winnerMessage} </div>
        </div>
      </div>
    );
  }
}

export default App;
