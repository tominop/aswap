 /*!
  * @title yoda_svc Youdex API microservice
  * @author Oleg Tomin - <2tominop@gmail.com>
  * @dev Basic implementaion of YouDEX API functions  
  * MIT Licensed Copyright(c) 2018-2019
  */

 const express = require("express"),
     app = express(),
     axios = require('axios'), //  AXIOS - compact lib for HttpRequest
     urlYoudex = 'http://10.20.40.5:8080/' //  JSON-RPC server Youdex node

 var Web3 = require("web3"),
     YODA3 = tokenContract = dexContract = '', //  init variables
     gasPrice = 0,
     gasLimit = 4700000,
     YODA = require("./token"), // address and ABI of YODA smart contract in Youdex
     dex = require("./contract"), // address and ABI of DEX smart contract in Youdex
     alice = require("../../private/keystore/alice"), //  address and private key in Ethereum (Youdex) and Bitcoin;
     bob = require("../../private/keystore/bob"), //  address and private key in Ethereum (Youdex) and Bitcoin;
     plasmoid = require("../../private/keystore/plasmoid") //  address and private key in Ethereum (Youdex);


 //  Route - check connect to API provider
 app.get("/YODA/api/", (req, res) => {
     YODA3 = new Web3(new Web3.providers.HttpProvider(urlYoudex))
     tokenContract = YODA3.eth.contract(YODA.abi).at(YODA.adrress) // YODA token smart contract in YODAx
     dExContract = YODA3.eth.contract(dex.abi).at(dex.address) //  Dex smart contract in Youdex
     YODA3.eth.getGasPrice(function(error, result) { //  calculate gas price
         if (!error) {
             gasPrice = result
             res.header("Access-Control-Allow-Origin", "*")
             res.json({ error: false, host: urlYoudex, gasPrice: result })
         } else {
             res.header("Access-Control-Allow-Origin", "*")
             res.json({ error: true })
             console.log('Error! p: ' + provider.host + ' not connected!!!')
         }
     })
 })

 //  Route - check balance of YODA tokens
 app.get("/YODA/balance/:name", (req, res) => {
     const addrs = eval(req.params.name).ethAddrs,
         balance = tokenContract.balanceOf(addrs) / 10 ** 9;
     res.header("Access-Control-Allow-Origin", "*")
     res.json({ balance: balance, address: addrs })
 })

 //  Route - startDex function 
 app.get("/YODA/startDEX/:data", (req, res) => {
     const data = JSON.parse(req.params.data),
         valueA = data.valueA, //  value of Alice's coins
         valueB = data.valueB, //  value of Bob's coins
         valueY = data.valueY, //  value of YODA tokens for pledge
         console.log('A ' + valueA + ' B ' + valueB + ' Y ' + valueY)
         /*        var myCallData = dexContract.openDEx.getData(alice.ethAddrs, plasmoid.ethAddrs, req.params.data.valueA, req.params.data.valueB, req.params.data.valueL)  // Data for Ethereum transaction DEx smart contract exec
                 var countTx = YODA3.eth.getTransactionCount(accountFrom)    //  get count of TX for nonce
                 var txParams = {        //  new Tx params 
                     nonce: countTx,
                     gasPrice: gasPrice,
                     gasLimit: gasLimit,
                     to: dex.address,
                     value: 0,
                     data: myCallData,
                     chainId: 1337       // EIP 155 chainId - mainnet: 1, ropsten: 3, 1337 - private
                 }
                 var tx = new EthJS.Tx(txParams)
                 tx.sign(privateKey.B)            // sign Tx with Bob's private key for YODAx account
                 var serializedTx = tx.serialize()
                 YODA3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'))    //  send Tx in YODAx */
         //     res.header("Access-Control-Allow-Origin", "*")
         //     res.json({ balance: data }) //  
     orderID = 0;
     var filter = DExContract.StartDEx({
         maker: alice.ethAddrs
     });
     console.log('set filter for contract event');
     filter.watch(function(err, event) {
         if (!err) {
             filter.stopWatching();
             orderID = event.args._order;
             res.header("Access-Control-Allow-Origin", "*")
             res.json({ id: 1, })
         } else {
             console.log("Error " + err)
         };
     });
     res.header("Access-Control-Allow-Origin", "*")
     res.json({ id: 0 })
     accountFrom = bob.ethAddrs,
         privateKey = bob.ethKey,
         myCallData = DExContract.openDEx.getData(alice.ethAddrs, plasmoid.ethAddrs, valueB * 10 ** 18, valueA * 10 ** 8, valueY * 10 ** 9), // Data for Ethereum transaction call smart contract DEx
         accountTo = dex.address,
         countTx = YODA3.eth.getTransactionCount(accountFrom);
     var txParams = {
         nonce: countTx,
         gasPrice: gasPrice,
         gasLimit: gasLimit,
         to: accountTo,
         value: 0,
         data: myCallData,
         // EIP 155 chainId - mainnet: 1, ropsten: 3, 1337 - private
         chainId: 1337
     }
     var tx = new EthJS.Tx(txParams);
     tx.sign(privateKey);
     var serializedTx = tx.serialize()
     YODA3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));



 })

 const port = process.env.PORT_YODA || 8201

 app.listen(port, () => {
     console.log(`microservice YODA_svc listening on ${port}`)
 })

 function a() {

 }