var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  const Web3 = require('web3');
  var Tx = require('ethereumjs-tx').Transaction;
  const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  web3.eth.getAccounts(console.log);

  const contractAddress = '0x121B402DD075f6f307b46371a66bf7aBD5a4d65A';
  const ABI = require('./test.abi.json');
  var TestContract = new web3.eth.Contract(ABI, contractAddress);


  // const contractAddress = '0x121B402DD075f6f307b46371a66bf7aBD5a4d65A';
  // const ABI = require('YOUR_ABI_FILE');
  const account = '0xeDAa9920c48fb8e5B57A94e36764ff91936eB45f';
  const privateKey = Buffer.from('5ed7109cb2b763e8be47c6369405462e18518fc27d2ba7ee1dffa41b17420933', 'hex');
  const newToken = 100;

  var TestContract = new web3.eth.Contract(ABI, contractAddress);
  const _data = TestContract.methods.incrementToken(newToken).encodeABI();
  web3.eth.getTransactionCount(account)
  .then(nonce => {
   var rawTx = {
   nonce: nonce,
  gasPrice: '0x20000000000',
  gasLimit: '0x27511',
  to: contractAddress,
  value: 0,
  data: _data
   }
   var tx = new Tx(rawTx);
   tx.sign(privateKey);
   var serializedTx = tx.serialize();
   web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
   .on('receipt', console.log);
  });


  res.render('index', { title: 'Express' });
});

module.exports = router;
