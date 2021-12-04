import web3 from './web3';

const address = '0xEa035F745ba45FC6144F724C6EEf67C7649983cc';

const abi = [
    {
       "constant":true,
       "inputs":[
          {
             "name":"",
             "type":"uint256"
          }
       ],
       "name":"previousWinners",
       "outputs":[
          {
             "name":"",
             "type":"address"
          }
       ],
       "payable":false,
       "stateMutability":"view",
       "type":"function"
    },
    {
       "constant":true,
       "inputs":[
          
       ],
       "name":"manager",
       "outputs":[
          {
             "name":"",
             "type":"address"
          }
       ],
       "payable":false,
       "stateMutability":"view",
       "type":"function"
    },
    {
       "constant":true,
       "inputs":[
          
       ],
       "name":"getPreviousWinners",
       "outputs":[
          {
             "name":"",
             "type":"address[]"
          }
       ],
       "payable":false,
       "stateMutability":"view",
       "type":"function"
    },
    {
       "constant":false,
       "inputs":[
          
       ],
       "name":"pickWinner",
       "outputs":[
          
       ],
       "payable":false,
       "stateMutability":"nonpayable",
       "type":"function"
    },
    {
       "constant":true,
       "inputs":[
          
       ],
       "name":"getPlayers",
       "outputs":[
          {
             "name":"",
             "type":"address[]"
          }
       ],
       "payable":false,
       "stateMutability":"view",
       "type":"function"
    },
    {
       "constant":false,
       "inputs":[
          
       ],
       "name":"enter",
       "outputs":[
          
       ],
       "payable":true,
       "stateMutability":"payable",
       "type":"function"
    },
    {
       "constant":true,
       "inputs":[
          {
             "name":"",
             "type":"uint256"
          }
       ],
       "name":"players",
       "outputs":[
          {
             "name":"",
             "type":"address"
          }
       ],
       "payable":false,
       "stateMutability":"view",
       "type":"function"
    },
    {
       "inputs":[
          
       ],
       "payable":false,
       "stateMutability":"nonpayable",
       "type":"constructor"
    }
 ];

export default new web3.eth.Contract(abi, address);