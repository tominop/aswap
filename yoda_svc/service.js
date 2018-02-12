 /*!
  * @title yoda_svc Youdex API microservice
  * @author Oleg Tomin - <2tominop@gmail.com>
  * @dev Basic implementaion of YouDEX API functions  
  * MIT Licensed Copyright(c) 2018-2019
  */

 const express = require("express")
 const app = express()
 const axios = require('axios') //  AXIOS - compact lib for HttpRequest
 const urlEth = 'http://188.225.18.174:8080/' //  JSON-RPC server Youdex node
 var Web3 = require("web3")
 var YODA3 = tokenContract = dexContract = '' //  init variables
 var gasPrice = 0
 var gasLimit = 4700000

 var YODA = require("./token") // address and ABI of YODA smart contract in Youdex
 var dex = require("./contract") // address and ABI of DEX smart contract in Youdex
 var alice = require("../keystore/alice") //  address and private key in Ethereum (Youdex) and Bitcoin;
 var bob = require("../keystore/bob") //  address and private key in Ethereum (Youdex) and Bitcoin;
 var plasmoid = require("../keystore/plasmoid") //  address and private key in Ethereum (Youdex);


 //  Route - check connect to API provider
 app.get("/YODA/api/:token", (req, res) => {
     YODA3 = new Web3(new Web3.providers.HttpProvider(urlEth))
     const provider = YODA3.currentProvider
     tokenContract = YODA3.eth.contract(YODA.abi).at(YODA.adrress) // YODA token smart contract in YODAx
     dExContract = YODA3.eth.contract(dex.abi).at(dex.address) //  Dex smart contract in Youdex
     console.log('YODA: ' + YODA.adrress + '  abi: ' + YODA.abi)
     YODA3.eth.getGasPrice(function(error, result) { //  calculate gas price
         if (!error) {
             gasPrice = result
             res.header("Access-Control-Allow-Origin", "*")
             res.json({ error: false, host: provider.host, gasPrice: result })
             console.log('p: ' + provider.host + '  gP' + result)
         } else {
             res.header("Access-Control-Allow-Origin", "*")
             res.json({ error: true })
             console.log('Error! p: ' + provider.host + ' not connected!!!')
         }
     })
 })

 //  Route - check balance of YODA tokens
 app.get("/YODA/balance/:name", (req, res) => {
     balance = tokenContract.balanceOf(eval(req.params.name).ethAddrs) / 10 ** 9
     res.header("Access-Control-Allow-Origin", "*")
     res.json({ balance: balance })
 })

 //  Route - startDex function 
 app.get("/YODA/startdex/:data", (req, res) => {
     const data = JSON.stringify(req.params.data)
     console.log('data: valueA=' + data.valueA + ' valueB=' + data.valueB)
     const valueA = req.params.data.valueA //  value of Alice's coins
     const valueB = req.params.data.valueB //  value of Bob's coins
     const valueL = req.params.data.valueL //  value of YODA tokens for pledge
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
     res.header("Access-Control-Allow-Origin", "*")
     res.json({ balance: data }) //  
 })

 const port = process.env.PORT_YODA || 8201

 app.listen(port, () => {
     console.log(`microservice YODA_svc listening on ${port}`)
 })