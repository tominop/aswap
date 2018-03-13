/*!
 * @title btc3_svc BTC API microservice for tesnet3
 * @author Oleg Tomin - <2tominop@gmail.com>
 * @dev Basic implementaion of BTC3 API functions  
 * MIT Licensed Copyright(c) 2018-2019
 */

const express = require('express'),
    app = express(),
    axios = require('axios'), //  AXIOS - compact lib for HttpRequest
    token = 'c97f6432c2ba4d3b8d3ced1407e9ec0a', // for main net
    alice = require('../../private/keystore/alice'), //  address and private key in Ethereum (Youdex) and Bitcoin;
    bob = require('../../private/keystore/bob'), //  address and private key in Ethereum (Youdex) and Bitcoin;
    btcUrl = 'https://api.blockcypher.com/v1/btc/test3', //  Blochcypher API provider for Bitcoin testnet3
    bitcoin = require('bitcoinjs-lib'),
    testnet = bitcoin.networks.testnet,
    bigi = require('bigi'),
    buffer = require('buffer'),
    WebSocket = require('ws');

unconfirmedTxHash = 'Nan, try get btc/ws/addr';
isConfirmed = false;

Date.prototype.toYMDTString = function() {
    return isNaN(this) ? 'NaN' : [this.getFullYear(), this.getMonth() > 8 ? this.getMonth() + 1 : '0' + (this.getMonth() + 1),
        this.getDate() > 9 ? this.getDate() : '0' + this.getDate()
    ].join('/') + ' ' + [this.getUTCHours() < 10 ? '0' + this.getUTCHours() : this.getUTCHours(),
        this.getMinutes() < 10 ? '0' + this.getMinutes() : this.getMinutes(),
        this.getSeconds() < 10 ? '0' + this.getSeconds() : this.getSeconds()
    ].join(':')
};

myErrorHandler = function(message, res) {
    if (res) res.json({ error: true, response: 'Error: ' + message });
    console.log(new Date().toYMDTString() + 'Error: ' + message);
};

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

//  Route - userActive function
app.get('/btc3/user/:data', (req, res) => {

    res.json({ busy: false });
});

//  Route - userActive function
app.get('/btc3/txhash/', (req, res) => {
    res.json({ hash: unconfirmedTxHash, confirmation: isConfirmed });
    //    unconfirmedTxHash = 'Nan, try get btc/ws/addr';
});


//  Route - check connect to API provider
app.get('/btc3/api/', (req, res) => {
    axios
        .get(btcUrl)
        .then(response => {

            res.json({
                error: false,
                host: btcUrl,
                btcFee: response.data.medium_fee_per_kb
            });
        })
        .catch(error => {

            res.json({ error: true });
            console.log('Error! p: ' + btcUrl + ' not connected!!!' + '\n');
        });
});

//  Route - balance of address
app.get('/btc3/balance/:name', (req, res) => {
    //  Standart format API
    const addrsBTC = eval(req.params.name).btcAddrs;
    axios
        .get(btcUrl + '/addrs/' + addrsBTC + '/balance')
        .then(response => {

            res.json({
                balance: response.data.final_balance / 10 ** 8,
                address: addrsBTC
            });
        })
        .catch(error => {
            console.log(error);
            var err = new Error('BTC API service not aviable');
            err.status = 501;

            res.send(err);
        });
});

//  Route - make, sign, send transfer Tx
app.get('/btc3/makeTx/:data', (req, res) => {
    const data = JSON.parse(req.params.data),
        from = [eval(data.from).btcAddrs],
        to = [eval(data.to).btcAddrs],
        valueB = Number.parseInt(data.valueB),
        privateKey = eval(data.from).btcKey;
    var keys = bitcoin.ECPair.fromWIF(privateKey, testnet);
    //     var keys = bitcoin.ECPair.fromWIF(my_wif_private_key);   //  for main net
    var newtx = {
        inputs: [{ addresses: from }],
        outputs: [{ addresses: to, value: valueB }]
    };
    axios
        .post(btcUrl + '/txs/new?token=' + token, JSON.stringify(newtx))
        .then(response => {
            var tmptx = response.data;
            tmptx.pubkeys = [];
            //            console.log(tmptx);
            tmptx.signatures = tmptx.tosign.map(function(tosign, n) {
                tmptx.pubkeys.push(keys.getPublicKeyBuffer().toString('hex'));
                return keys
                    .sign(new buffer.Buffer(tosign, 'hex'))
                    .toDER()
                    .toString('hex');
            });
            // sending back the transaction with all the signatures to broadcast
            axios
                .post(btcUrl + '/txs/send?token=' + token, JSON.stringify(tmptx))
                .then(response => {
                    console.log('Tx hash ' + response.data.tx.hash);

                    res.json({
                        error: false,
                        hash: response.data.tx.hash,
                        time: response.data.tx.received
                    });
                })
                .catch(error => {
                    console.log(error);
                    err = new Error('BTC API service dropped Tx');
                    err.status = 504;

                    res.json({ error: true });
                });
        })
        .catch(error => {
            console.log(error);

            res.json({ error: true });
        });
});

app.get('/btc3/ws/:addrs', (req, res) => {
    // Get latest unconfirmed transactions live
    const addrs = req.params.addrs;
    var ws = new WebSocket('wss://socket.blockcypher.com/v1/btc/test3');
    var count = 0;
    ws.on('message', function incoming(event) {
        // console.log(event);
        var tx = JSON.parse(event);
        unconfirmedTxHash = tx.hash;
        console.log('unconfirmed tx hash ' + unconfirmedTxHash);
        waitConfirmation(unconfirmedTxHash);
        var shortHash = tx.hash.substring(0, 6) + '...';
        var total = tx.total / 100000000;
        var addrs = tx.addresses.join(', ');
        count++;
        if (count > 0) ws.close();
    });
    ws.on('open', function open() {
        ws.send(JSON.stringify({ event: 'unconfirmed-tx', address: addrs }), function ask(error) {
            if (error) myErrorHandler('error.message', res);
            else {
                res.send('ws connected on wss://socket.blockcypher.com/v1/btc/test3');
                console.log(
                    'ws connected on wss://socket.blockcypher.com/v1/btc/test3'
                );
            };
        });
    });
    ws.on('close', function close() {
        console.log('ws disconnected' + '\n');
    });
});

//  Route - waitTx function
app.get('/btc3/waitTx/:data', (req, res) => {
    hash = req.params.data;
    var interval;
    var timeOut = setTimeout(function() {
        clearInterval(interval);
        var err = new Error('Error while mining BTC Tx in next 30 min.');
        err.status = 504;
        console.log(err);

        res.send(err);
    }, 1800000);
    interval = setInterval(function() {
        axios
            .get(btcUrl + '/txs/' + hash)
            .then(response => {
                console.log('tx ' + response.data.hash);
                if (response.data.confirmations > 0) {
                    console.log('BTC Tx block ' + response.data.block_height);

                    res.json({ block: response.data.block_height });
                    clearTimeout(timeOut);
                    clearInterval(interval);
                }
            })
            .catch(error => {
                console.log(error);
                err = new Error('BTC API service not aviable');
                err.status = 501;

                res.send(err);
            });
    }, 30000);
});

//  Route - balance of address
app.post('/btc3/txconfirm', (req, res) => {
    console.log(req);
    isConfirmed = true;
});


const port = process.env.PORT_BTC3 || 8103;

app.listen(port, () => {
    console.log(
        new Date().toString() + `: Microservice btc_svc listening on ${port}`
    );
});

function waitConfirmation(hash) {
    console.log('creating webhook');
    var webhook = {
        "event": "tx-confirmation",
        "hash": hash,
        "confirmations": 1,
        "url": "http://178.62.224.216:8201/btc3/txconfirm"
    }
    var url = 'https://api.blockcypher.com/v1/btc/test3/hooks?token=' + token;
    axios.post(url, JSON.stringify(webhook))
        .then(function(d) { console.log(d) })
        .catch(function(err) {
            myErrorHandler(err.message);
        });
};
/*
    wss.on('connection', (ws: ExtWebSocket) => {

        ws.isAlive = true;

        ws.on('pong', () => {
            ws.isAlive = true;
        });

        //connection is up, let's add a simple simple event
        ws.on('message', (message: string) => { 
            //[...]
        }
    });

    setInterval(() => {
        wss.clients.forEach((ws: ExtWebSocket) => {
            
            if (!ws.isAlive) return ws.terminate();
            
            ws.isAlive = false;
            ws.ping(null, false, true);
        });
    }, 10000);
    */