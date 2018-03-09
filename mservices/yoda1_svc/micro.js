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
    YODA = require("./lib/yoda_abi"), // address and ABI of YODA smart contract in Youdex
    uar = require("./lib/uar_abi"), // address and ABI of UserAddrsReg smart contract in Youdex
    alice = require("../../private/keystore/alice"), //  address and private key in Ethereum (Youdex) and Bitcoin;
    bob = require("../../private/keystore/bob"), //  address and private key in Ethereum (Youdex) and Bitcoin;
    plasmoid = require("../../private/keystore/plasmoid"); //  address and private key in Ethereum (Youdex);

var gasPrice,
    YODA3 = tokenContract = dexContract = '',
    userActive = 0; //  init variables

//  Route - connect to API provider, set global variables YODA3, gasPrice
router.get("/YODA/api/", function(req, res) {
    YODA3 = new Web3(new Web3.providers.HttpProvider(urlYoudex));
    tokenContract = YODA3.eth.contract(YODA.abi).at(YODA.address) // YODA token smart contract in YODAx
    YODA3.eth.getGasPrice(function (error, result) { //  calculate gas price
        if (!error) {
            gasPrice =  YODA3.toHex(result);
            gasLimit = YODA3.toHex(4700000);
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



//  YODA API & token YODA routes     
const yodaRoutes = require('./lib/yoda');
app.use('/', yodaRoutes);

//  DEx smart contract routes     
const dexRoutes = require('./lib/dex');
app.use('/', dexRoutes);

//  UserAddrsReg smart contract routes     
const uarRoutes = require('./lib/uar');
app.use('/', uarRoutes);



const port = process.env.PORT_YODA1 || 8202

app.listen(port, () => {
    console.log((new Date()).toString() + `: microservice YODA1_svc listening on ${port}`)
})