 /*!
  * @title btc_svc BTC API microservice for mainnet
  * @author Oleg Tomin - <2tominop@gmail.com>
  * @dev Basic implementaion of BTC API functions  
  * MIT Licensed Copyright(c) 2018-2019
  */


 const express = require("express"),
     app = express(),
     axios = require('axios'), //  AXIOS - compact lib for HttpRequest
     alice = require("../../private/keystore/alice"), //  address and private key in Ethereum (Youdex) and Bitcoin;
     bob = require("../../private/keystore/bob"), //  address and private key in Ethereum (Youdex) and Bitcoin;
     btc = require("../../private/keystore/btc"), //  Blochcypher API provider for Bitcoin mainnet
     bitcoin = require("bitcoinjs-lib"),
     bigi = require("bigi"),
     buffer = require('buffer');


 //  Route - userActive function 
 app.get("/btc/user/:data", (req, res) => {
     res.header("Access-Control-Allow-Origin", "*");
     res.json({ busy: false });
 })

 //  Route - check connect to API provider
 app.get("/btc/api/", (req, res) => {
     axios.get(btc.url)
         .then(response => {
             res.header("Access-Control-Allow-Origin", "*")
             res.json({ error: false, host: btc.url, btcFee: response.data.medium_fee_per_kb })
         })
         .catch(error => {
             res.header("Access-Control-Allow-Origin", "*")
             res.json({ error: true })
             console.log('Error! p: ' + btc.url + ' not connected!!!')
         })
 })

 //  Route - balance of address
 app.get("/btc/balance/:name", (req, res) => {
     //  Standart format API 
     const addrsBTC = eval(req.params.name).btcAddrs;
     axios.get(btc.url + '/addrs/' + addrsBTC + '/balance')
         .then(response => {
             res.header("Access-Control-Allow-Origin", "*")
             res.json({ balance: response.data.final_balance / 10 ** 8, address: addrsBTC })
         })
         .catch(error => {
             console.log(error)
             var err = new Error('BTC API service not aviable')
             err.status = 501
             res.header("Access-Control-Allow-Origin", "*")
             res.send(err)
         })
 })

 //  Route - make, sign, send transfer Tx 
 app.get("/btc/makeTx/:data", (req, res) => {
     const data = JSON.parse(req.params.data),
         from = [eval(data.from).btcAddrs],
         to = [eval(data.to).btcAddrs],
         valueB = Number.parseInt(data.valueB),
         privateKey = eval(data.from).btcKey;
     var keys = bitcoin.ECPair.fromWIF(privateKey); //  for main net
     var newtx = {
         inputs: [{ addresses: from }],
         outputs: [{ addresses: to, value: valueB }]
     };
     axios.post(btc.url + '/txs/new?token=' + btc.token, JSON.stringify(newtx))
         .then(response => {
             var tmptx = response.data;
             tmptx.pubkeys = [];
             console.log(tmptx.errors);
             tmptx.signatures = tmptx.tosign.map(function(tosign, n) {
                     tmptx.pubkeys.push(keys.getPublicKeyBuffer().toString("hex"));
                     return keys.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
                 })
                 // sending back the transaction with all the signatures to broadcast
             axios.post(btc.url + '/txs/send?token=' + btc.token, JSON.stringify(tmptx))
                 .then(response => {
                     console.log('Tx hash ' + response.data.tx.hash);
                     res.header("Access-Control-Allow-Origin", "*");
                     res.json({ hash: response.data.tx.hash, time: response.data.tx.received });
                 })
                 .catch(error => {
                     console.log(error.response);
                     err = new Error('BTC API service dropped Tx');
                     err.status = 504;
                     res.header("Access-Control-Allow-Origin", "*");
                     res.send(err);
                 })
         })
         .catch(error => {
             console.log(error.response);
             err = new Error('BTC API service not aviable');
             err.status = 501;
             res.header("Access-Control-Allow-Origin", "*");
             res.send(err);
         })
 })

 //  Route - waitTx function 
 app.get("/btc/waitTx/:data", (req, res) => {
     hash = req.params.data;
     var interval;
     var timeOut = setTimeout(function() {
         clearInterval(interval);
         var err = new Error("Error while mining BTC Tx in next 30 min.");
         err.status = 504;
         console.log(err)
         res.header("Access-Control-Allow-Origin", "*");
         res.send(err);
     }, 1800000);
     interval = setInterval(function() {
         axios.get(btc.url + '/txs/' + hash)
             .then(response => {
                 console.log('tx ' + response.data.hash)
                 if (response.data.confirmations > 0) {
                     console.log("BTC Tx block " + response.data.block_height);
                     res.header("Access-Control-Allow-Origin", "*");
                     res.json({ block: response.data.block_height });
                     clearTimeout(timeOut);
                     clearInterval(interval);
                 }
             })
             .catch(error => {
                 console.log(error);
                 err = new Error('BTC API service not aviable');
                 err.status = 501;
                 res.header("Access-Control-Allow-Origin", "*");
                 res.send(err);
             })
     }, 30000);
 })




 const port = process.env.PORT_BTC || 8100

 app.listen(port, () => {
     console.log(`Microservice btc_svc listening on ${port}`)
 })