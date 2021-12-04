const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts;
let lottery;

beforeEach(async () => {
   accounts = await web3.eth.getAccounts();

   lottery = await new web3.eth.Contract(JSON.parse(interface))
       .deploy( {data: bytecode})
       .send({from: accounts[0], gas: 1000000})
});

describe('Lottery Contract', () => {
   it('deploys a contract', () => {
       assert.ok(lottery.options.address);
    });

   it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.011', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
   });

    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.011', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.011', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.011', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });

    it('requires a minimum amount of ether to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei('0.001', 'ether')
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('only manager can pick a winner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('sends 90% to winner and 10% to manager and resets player array and lottery amount', async () => {
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('2', 'ether')
        });
        
        const initialManagerBalance = await web3.eth.getBalance(accounts[0]);
        const initialBalance = await web3.eth.getBalance(accounts[1]);

        //pick the winner from manager account
        await lottery.methods.pickWinner().send({ from: accounts[0] });

        const finalManagerBalance = await web3.eth.getBalance(accounts[0]);
        const finalBalance = await web3.eth.getBalance(accounts[1]);

        const managerDifference = finalManagerBalance - initialManagerBalance;
        const difference = finalBalance - initialBalance;

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        // const winners = await lottery.methods.getPreviousWinners().call({
        //     from: accounts[0]
        // });

        // Take into account gas, 90% of 2 is 1.8, 10% is 0.2, so slightly less should do
        assert(difference > web3.utils.toWei('1.6', 'ether'));
        assert(managerDifference > web3.utils.toWei('0.1', 'ether'));
        assert.equal(0, players.length);
        //assert.equal(1, winners.length);
    });



});