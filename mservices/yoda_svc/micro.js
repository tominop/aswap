 /*!
  * @title yoda_svc Youdex API microservice
  * @author Oleg Tomin - <2tominop@gmail.com>
  * @dev Basic implementaion of YouDEX API functions  
  * MIT Licensed Copyright(c) 2018-2019
  */

 const express = require("express"),
     app = express(),
     axios = require('axios'), //  AXIOS - compact lib for HttpRequest
     urlYoudex = 'http://10.20.40.5:8080/', //  JSON-RPC server Youdex node
     Web3 = require("web3"),
     EthJS = require("ethereumjs-tx"),
     gasLimit = 4700000,
     YODA = require("./token"), // address and ABI of YODA smart contract in Youdex
     dex = require("./contract"), // address and ABI of DEX smart contract in Youdex
     alice = require("../../private/keystore/alice"), //  address and private key in Ethereum (Youdex) and Bitcoin;
     bob = require("../../private/keystore/bob"), //  address and private key in Ethereum (Youdex) and Bitcoin;
     plasmoid = require("../../private/keystore/plasmoid"); //  address and private key in Ethereum (Youdex);

 var gasPrice = 0,
     YODA3 = tokenContract = dexContract = ''; //  init variables

 //  Route - check connect to API provider
 app.get("/YODA/api/", (req, res) => {
     YODA3 = new Web3(new Web3.providers.HttpProvider(urlYoudex))
     tokenContract = YODA3.eth.contract(YODA.abi).at(YODA.address) // YODA token smart contract in YODAx
     DExContract = YODA3.eth.contract(dex.abi).at(dex.address) //  Dex smart contract in Youdex
     YODA3.eth.getGasPrice(function(error, result) { //  calculate gas price
         if (!error) {
             gasPrice = result
             res.header("Access-Control-Allow-Origin", "*")
             res.json({ error: false, host: urlYoudex, gasPrice: result })
         } else {
             var err = new Error('Error! p: ' + provider.host + ' not connected!!!')
             err.status = 501
             res.header("Access-Control-Allow-Origin", "*");
             res.send(err)
             console.log('Error! p: ' + provider.host + ' not connected!!!')
         }
     })
 })

 //  Route - check balance of YODA tokens
 app.get("/YODA/balance/:name", (req, res) => {
     const addrs = eval(req.params.name).ethAddrs;
     tokenContract.balanceOf(addrs, function(error, result) {
         if (!error) {
             const balance = result / 10 ** 9;
             res.header("Access-Control-Allow-Origin", "*")
             res.json({ balance: balance, address: addrs })
         } else {
             var err = new Error('Error! p: ' + provider.host + ' not connected!!!')
             err.status = 501
             res.header("Access-Control-Allow-Origin", "*");
             res.send(err)
             console.log('Error! p: ' + provider.host + ' not connected!!!')
         }
     })
 })

 //  Route - startDex function 
 app.get("/YODA/startDEX/:data", (req, res) => {
     const data = JSON.parse(req.params.data),
         valueA = data.valueA, //  value of Alice's coins
         valueB = data.valueB, //  value of Bob's coins
         valueY = data.valueY; //  value of YODA tokens for pledge
     orderID = 0;
     var myCallData = DExContract.openDEx.getData(alice.ethAddrs, plasmoid.ethAddrs, valueB * 10 ** 18, valueA * 10 ** 8, valueY * 10 ** 9);
     YODA3.eth.getTransactionCount(bob.ethAddrs, function(error, result) {
         if (!error) {
             const countTx = result;
             var txParams = {
                 nonce: YODA3.toHex(countTx),
                 gasPrice: YODA3.toHex(gasPrice),
                 gasLimit: YODA3.toHex(gasLimit),
                 to: dex.address,
                 value: '0x0',
                 data: myCallData
                     // EIP 155 chainId - mainnet: 1, ropsten: 3, 1337 - private
                     // chainId: YODA3.toHex(1337)
             };
             console.log(txParams.nonce + ' ' + txParams.gasPrice + ' ' + txParams.gasLimit + ' ' + txParams.to + ' ' + txParams.value + ' ' + txParams.data);
             var tx = new EthJS(txParams);
             console.log('tx success bob_key ' + bob.ethKey);
             const privateKey = new Buffer(bob.ethKey, 'hex');
             tx.sign(privateKey);
             var serializedTx = tx.serialize();
             YODA3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
                 if (!err) {
                     console.log("startDepo Tx hash " + hash);
                     res.header("Access-Control-Allow-Origin", "*");
                     res.json({ hash: hash });
                 } else {
                     console.log(err)
                         //            var err = new Error(err)
                     err.status = 501
                     res.header("Access-Control-Allow-Origin", "*");
                     res.send(err)
                 };
             });
         } else {
             var err = new Error('Error! p: ' + provider.host + ' not connected!!!')
             err.status = 501
             res.header("Access-Control-Allow-Origin", "*");
             res.send(err)
             console.log('Error! p: ' + provider.host + ' not connected!!!')
         }
     })
 })


 //  Route - tokenTX function 
 app.get("/YODA/tokenTX/:data", (req, res) => {
     const data = JSON.parse(req.params.data),
         from = eval(data.from).ethAddrs,
         to = eval(data.to).ethAddrs,
         valueY = data.valueY;
     var myCallData = tokenContract.transfer.getData(to, valueY * 10 ** 9);
     YODA3.eth.getTransactionCount(from, function(error, result) {
         if (!error) {
             const countTx = result;
             var txParams = {
                 nonce: YODA3.toHex(countTx),
                 gasPrice: YODA3.toHex(gasPrice),
                 gasLimit: YODA3.toHex(gasLimit),
                 to: YODA.address,
                 value: '0x0',
                 data: myCallData
                     // EIP 155 chainId - mainnet: 1, ropsten: 3, 1337 - private
                     // chainId: YODA3.toHex(1337)
             };
             console.log(txParams.nonce + ' ' + txParams.gasPrice + ' ' + txParams.gasLimit + ' ' + txParams.to + ' ' + txParams.value + ' ' + txParams.data);
             var tx = new EthJS(txParams);
             console.log('tx success key ' + eval(data.from).ethKey);
             const privateKey = new Buffer(eval(data.from).ethKey, 'hex');
             tx.sign(privateKey);
             var serializedTx = tx.serialize();
             YODA3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
                 if (!err) {
                     console.log(data.from + " pledge YODA Tx hash " + hash);
                     res.header("Access-Control-Allow-Origin", "*");
                     res.json({ hash: hash });
                 } else {
                     console.log(err)
                         //            var err = new Error(err)
                     err.status = 501
                     res.header("Access-Control-Allow-Origin", "*");
                     res.send(err)
                 };
             });
         } else {
             var err = new Error('Error! p: ' + provider.host + ' not connected!!!')
             err.status = 501
             res.header("Access-Control-Allow-Origin", "*");
             res.send(err)
             console.log('Error! p: ' + provider.host + ' not connected!!!')
         }
     })

 })

 //  Route - inDepo function 
 app.get("/YODA/inDepo/:data", (req, res) => {
     const order = parseInt(req.params.data),
         myCallData = DExContract.inDepo.getData(order);
     YODA3.eth.getTransactionCount(plasmoid.ethAddrs, function(error, result) {
         if (!error) {
             const countTx = result;
             const txParams = {
                 nonce: YODA3.toHex(countTx),
                 gasPrice: YODA3.toHex(gasPrice),
                 gasLimit: YODA3.toHex(gasLimit),
                 to: dex.address,
                 value: '0x0',
                 data: myCallData
                     // EIP 155 chainId - mainnet: 1, ropsten: 3, 1337 - private
                     // chainId: YODA3.toHex(1337)
             };
             console.log(txParams.nonce + ' ' + txParams.gasPrice + ' ' + txParams.gasLimit + ' ' + txParams.to + ' ' + txParams.value + ' ' + txParams.data);
             var tx = new EthJS(txParams);
             console.log('tx success plasmoid_key ' + plasmoid.ethKey);
             const privateKey = new Buffer(plasmoid.ethKey, 'hex');
             tx.sign(privateKey);
             var serializedTx = tx.serialize();
             YODA3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
                 if (!err) {
                     console.log("Plasmiod's inDepo Tx hash " + hash);
                     res.header("Access-Control-Allow-Origin", "*");
                     res.json({ hash: hash });
                 } else {
                     console.log(err)
                         //            var err = new Error(err)
                     err.status = 501
                     res.header("Access-Control-Allow-Origin", "*");
                     res.send(err)
                 };
             });
         } else {
             var err = new Error('Error! p: ' + provider.host + ' not connected!!!')
             err.status = 501
             res.header("Access-Control-Allow-Origin", "*");
             res.send(err)
             console.log('Error! p: ' + provider.host + ' not connected!!!')
         }
     })
 })

 //  Route - makeTX function 
 app.get("/YODA/makeTX/:data", (req, res) => {
     const data = JSON.parse(req.params.data),
         from = eval(data.from).ethAddrs,
         to = eval(data.to).ethAddrs,
         valueE = data.valueE;
     YODA3.eth.getTransactionCount(from, function(error, result) {
         if (!error) {
             const countTx = result;
             const txParams = {
                 nonce: YODA3.toHex(countTx),
                 gasPrice: YODA3.toHex(gasPrice),
                 gasLimit: YODA3.toHex(gasLimit),
                 to: to,
                 value: YODA3.toHex(valueE),
                 data: '0x0'
                     // EIP 155 chainId - mainnet: 1, ropsten: 3, 1337 - private
                     // chainId: YODA3.toHex(1337)
             };
             console.log(txParams.nonce + ' ' + txParams.gasPrice + ' ' + txParams.gasLimit + ' ' + txParams.to + ' ' + txParams.value + ' ' + txParams.data);
             var tx = new EthJS(txParams);
             console.log('tx success key ' + eval(data.from).ethKey);
             const privateKey = new Buffer(eval(data.from).ethKey, 'hex');
             tx.sign(privateKey);
             var serializedTx = tx.serialize();
             YODA3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
                 if (!err) {
                     hashTx = hash;
                     console.log(data.from + " ETH Tx hash " + hash);
                 } else {
                     console.log(err)
                         //            var err = new Error(err)
                     err.status = 501
                     res.header("Access-Control-Allow-Origin", "*");
                     res.send(err)
                 };
             });
         } else {
             var err = new Error('Error! p: ' + provider.host + ' not connected!!!')
             err.status = 501
             res.header("Access-Control-Allow-Origin", "*");
             res.send(err)
             console.log('Error! p: ' + provider.host + ' not connected!!!')
         }
     })
 })


 //  Route - outDepo function 
 app.get("/YODA/outDepo/:data", (req, res) => {
     const order = parseInt(req.params.data),
         myCallData = DExContract.outDepo.getData(order, plasmoid.ethAddrs);
     YODA3.eth.getTransactionCount(plasmoid.ethAddrs, function(error, result) {
         if (!error) {
             const countTx = result;
             const txParams = {
                 nonce: YODA3.toHex(countTx),
                 gasPrice: YODA3.toHex(gasPrice),
                 gasLimit: YODA3.toHex(gasLimit),
                 to: dex.address,
                 value: '0x0',
                 data: myCallData
                     // EIP 155 chainId - mainnet: 1, ropsten: 3, 1337 - private
                     // chainId: YODA3.toHex(1337)
             };
             console.log(txParams.nonce + ' ' + txParams.gasPrice + ' ' + txParams.gasLimit + ' ' + txParams.to + ' ' + txParams.value + ' ' + txParams.data);
             var tx = new EthJS(txParams);
             console.log('tx success plasmoid_key ' + plasmoid.ethKey);
             const privateKey = new Buffer(plasmoid.ethKey, 'hex');
             tx.sign(privateKey);
             var serializedTx = tx.serialize();
             YODA3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
                 if (!err) {
                     console.log("Plasmiod's inDepo Tx hash " + hash);
                     res.header("Access-Control-Allow-Origin", "*");
                     res.json({ hash: hash });
                 } else {
                     console.log(err)
                         //            var err = new Error(err)
                     err.status = 501
                     res.header("Access-Control-Allow-Origin", "*");
                     res.send(err)
                 };
             });
         } else {
             var err = new Error('Error! p: ' + provider.host + ' not connected!!!')
             err.status = 501
             res.header("Access-Control-Allow-Origin", "*");
             res.send(err)
             console.log('Error! p: ' + provider.host + ' not connected!!!')
         }
     })
 })


 //  Route - waitTx function 
 app.get("/YODA/waitTx/:data", (req, res) => {
     hash = req.params.data;
     var interval;
     var timeOut = setTimeout(function() {
         clearInterval(interval);
         var err = new Error("Error while mining YODA Tx in next 30 sec.")
         err.status = 504
         console.log(err)
         res.header("Access-Control-Allow-Origin", "*");
         res.send(err)
     }, 30000);
     interval = setInterval(function() {
         var block
         YODA3.eth.getTransaction(hash, function(error, result) {
             if (!error) {
                 block = result;
                 if (block != null) {
                     if (block.blockNumber > 0) {
                         console.log("Tx is confirmed in block " + block.blockNumber);
                         res.header("Access-Control-Allow-Origin", "*");
                         res.json({ block: block.blockNumber });
                         clearTimeout(timeOut);
                         clearInterval(interval);
                     }
                 }
             } else {
                 res.header("Access-Control-Allow-Origin", "*");
                 res.json({ error: true });
                 console.log("Error! p: " + provider.host + " not connected!!!");
             }
         });

     }, 1000);
 })

 const port = process.env.PORT_YODA || 8201

 app.listen(port, () => {
     console.log(`microservice YODA_svc listening on ${port}`)
 })

 function a() {

 }