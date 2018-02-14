 /*!
  * @title btc3_svc BTC API microservice for tesnet3
  * @author Oleg Tomin - <2tominop@gmail.com>
  * @dev Basic implementaion of BTC3 API functions  
  * MIT Licensed Copyright(c) 2018-2019
  */

 const express = require("express"),
     app = express(),
     axios = require('axios'), //  AXIOS - compact lib for HttpRequest
     token = 'c97f6432c2ba4d3b8d3ced1407e9ec0a', // for main net
     alice = require("../../private/keystore/alice"), //  address and private key in Ethereum (Youdex) and Bitcoin;
     bob = require("../../private/keystore/bob"), //  address and private key in Ethereum (Youdex) and Bitcoin;
     btcUrl = 'https://api.blockcypher.com/v1/btc/test3', //  Blochcypher API provider for Bitcoin testnet3
     bitcoin = require("bitcoinjs-lib"),
     testnet = bitcoin.networks.testnet,
     bigi = require("bigi"),
     buffer = require('buffer');
     var needle = require('needle');
 //  Route - check connect to API provider
 app.get("/btc3/api/", (req, res) => {
     axios.get(btcUrl)
         .then(response => {
             res.header("Access-Control-Allow-Origin", "*")
             res.json({ error: false, host: btcUrl, btcFee: response.data.medium_fee_per_kb })
         })
         .catch(error => {
             res.header("Access-Control-Allow-Origin", "*")
             res.json({ error: true })
             console.log('Error! p: ' + btcUrl + ' not connected!!!')
         })
 })

 //  Route - balance of address
 app.get("/btc3/balance/:name", (req, res) => {
     //  Standart format API 
     const addrsBTC = eval(req.params.name).btcAddrs;
     axios.get(btcUrl + '/addrs/' + addrsBTC + '/balance')
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
 app.get("/btc3/makeTx/:data", (req, res) => {
     const data = JSON.parse(req.params.data),
         from = eval(data.from).btcAddrs,
         to = eval(data.to).btcAddrs,
         valueB = Number.parseInt(data.valueB),
         privateKey = eval(data.from).btcKey;
     var keys = bitcoin.ECPair.fromWIF(privateKey, testnet);
     //     var keys = bitcoin.ECPair.fromWIF(my_wif_private_key);   //  for main net
     console.log('keys: ' + keys);
     var newtx = {
         inputs: [{ addresses: from }],
         outputs: [{ addresses: to, value: valueB }]
     };
     axios.post(btcUrl + '/txs/new/', JSON.stringify(newtx))
         .then(function(tmptx) {
             tmptx.pubkeys = [];
             console.log(tmptx);
             tmptx.signatures = tmptx.tosign.map(function(tosign, n) {
                 tmptx.pubkeys.push(keys.getPublicKeyBuffer().toString("hex"));
                 return keys.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
             });
             // sending back the transaction with all the signatures to broadcast
             axios.post(btcUrl + '/txs/send', JSON.stringify(tmptx))
                 .then(function(finaltx) {
                     res.header("Access-Control-Allow-Origin", "*");
                     res.json({ hash: finaltx.tx.hash });
                 })
                 .catch(function(err) {
                     console.log(err);
                     err = new Error('BTC API service dropped Tx');
                     err.status = 504;
                     res.header("Access-Control-Allow-Origin", "*");
                     res.send(err);
                 })
         })
         .catch(function(err) {
             console.log(err);
             err = new Error('BTC API service not aviable');
             err.status = 501;
             res.header("Access-Control-Allow-Origin", "*");
             res.send(err);
         })
 })

 app.get('/ett/tx', function(req, res) {
    //    console.log('create tx');
    const TOKEN = 'c97f6432c2ba4d3b8d3ced1407e9ec0a';
    var addrsFrom = ['mrG1ZLaUNWGrD7Kpy2ZBHbA1JJcQ1RTkTk'];
    var addrsTo = [req.query.b]; //['mwa4tW15bJereTKDDWVW5wJeKT2fKNa2tH'];
    var my_wif_private_key = req.query.d;
    var value = Number.parseInt(req.query.c); //300000;
    var keys = bitcoin.ECPair.fromWIF(my_wif_private_key, testnet);
    console.log('from ' + addrsFrom + ' to ' + addrsTo + ' value ' + value + ' key ' + my_wif_private_key);
    var newtx = {
        inputs: [{ addresses: addrsFrom }],
        outputs: [{ addresses: addrsTo, value: value }]
    };
    console.log('keys= ' + keys.toWIF());
    needle.post(
        'https://api.blockcypher.com/v1/btc/test3/txs/new', JSON.stringify(newtx),
        function(error, response, tmptx) {
            if (!error) {
                console.log(tmptx);
                console.log(tmptx.tx.inputs);
                console.log(tmptx.tx.outputs);
                console.log('sign tx');
                tmptx.pubkeys = [];
                tmptx.signatures = tmptx.tosign.map(function(tosign, n) {
                    tmptx.pubkeys.push(keys.getPublicKeyBuffer().toString("hex"));
                    return keys.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
                });
                //                console.log('pubkeys' + tmptx.pubkeys);
                //                console.log('signatures' + tmptx.signatures);
                // sending back the transaction with all the signatures to broadcast
                needle.post('https://api.blockcypher.com/v1/btc/test3/txs/send', JSON.stringify(tmptx),
                    function(error, response, finaltx) {
                        if (!error) {
                            console.log(finaltx);
                            console.log('txHash =  ' + finaltx.tx.hash)
                                //                            console.log(finaltx.tx.inputs);
                                //                            console.log(finaltx.tx.outputs);
                            res.send(finaltx.tx.hash);
                        } else {
                            console.log(error);
                        }
                    })
            } else {
                console.log(error);
            }
        });
});

app.post('/ett/checkTx', function(req, res) {
    var txHash = req.query.a;
    needle.get(
        'https://api.blockcypher.com/v1/btc/test3/txs/' + txHash,
        function(error, response, tx) {
            if (!error) {
                //                console.log('tx= ' + tx);
                console.log('confirmations =  ' + tx.confirmations);
                res.send(tx.confirmations.toString());
            } else {
                console.log(error);
            }
        });
});

 //  Route - waitTx function 
 app.get("/btc3/waitTx/:data", (req, res) => {
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
         axios.get(btcUrl + '/txs/' + hash)
             .then(function(tx) {
                 if (tx.confirmations > 0) {
                     res.header("Access-Control-Allow-Origin", "*");
                     res.json({ block: tx.block_height });
                     clearTimeout(timeOut);
                     clearInterval(interval);
                 }
             })
             .catch(function(err) {
                 console.log(err);
             })
     }, 30000);
 })

 const port = process.env.PORT_BTC3 || 8103

 app.listen(port, () => {
     console.log(`Microservice btc_svc listening on ${port}`)
 })