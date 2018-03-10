/*!
 * @title yoda_svc Youdex API microservice
 * @author Oleg Tomin - <2tominop@gmail.com>
 * @dev Basic implementaion of YouDEX API functions  
 * MIT Licensed Copyright(c) 2018-2019
 */

//  Local variables    
const express = require("express");
//  Global variables    
app = express();
 //   axios = require('axios'), //  AXIOS - compact lib for HttpRequest
//    uar = require("./lib/uar_abi"), // address and ABI of UserAddrsReg smart contract in Youdex

//  CORS
app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

//  YODA API common functions & token YODA routes     
require('./lib/yoda');
    
//  DEx smart contract routes     
require('./lib/dex');

//  UserAddrsReg smart contract routes     
require('./lib/uar');

app.set('env', 'development');
// development error handler
// will print stacktrace

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err)
    if (app.get('env') === 'development') console.log(err);
});



const port = process.env.PORT_YODA1 || 8201

app.listen(port, () => {
    console.log((new Date()).toString() + `: microservice YODA1_svc listening on ${port}`)
})