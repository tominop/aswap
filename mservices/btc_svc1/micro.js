/*!
 * @title btc3_svc BTC API WS microservice for tesnet3
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


//  Route - userActive function 
app.get("/btc3/user/:data", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.json({ busy: false });
})

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
    axios.post(btcUrl + '/txs/new', JSON.stringify(newtx))
        .then(response => {
            var tmptx = response.data;
            tmptx.pubkeys = [];
            //            console.log(tmptx);
            tmptx.signatures = tmptx.tosign.map(function(tosign, n) {
                    tmptx.pubkeys.push(keys.getPublicKeyBuffer().toString("hex"));
                    return keys.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
                })
                // sending back the transaction with all the signatures to broadcast
            axios.post(btcUrl + '/txs/send', JSON.stringify(tmptx))
                .then(response => {
                    //                  console.log('Tx hash ' + response.data.tx.hash);
                    res.header("Access-Control-Allow-Origin", "*");
                    res.json({ hash: response.data.tx.hash, time: response.data.tx.received });
                })
                .catch(error => {
                    console.log(error);
                    err = new Error('BTC API service dropped Tx');
                    err.status = 504;
                    res.header("Access-Control-Allow-Origin", "*");
                    res.send(err);
                })
        })
        .catch(error => {
            console.log(error);
            err = new Error('BTC API service not aviable');
            err.status = 501;
            res.header("Access-Control-Allow-Origin", "*");
            res.send(err);
        })
})

app.get("/btc3/makeTx/:data", (req, res) => {

            var rootUrl = "https://api.blockcypher.com/v1/btc/test3";
            // please do not drain our test account, if you need testnet BTC use a faucet
            // https://tpfaucet.appspot.com/
            var source = {
                private: "1af97b1f428ac89b7d35323ea7a68aba8cad178a04eddbbf591f65671bae48a2",
                public: "03bb318b00de944086fad67ab78a832eb1bf26916053ecd3b14a3f48f9fbe0821f",
                address: "mtWg6ccLiZWw2Et7E5UqmHsYgrAi5wqiov"
            }
            var key = new bitcoin.ECKey(bigi.fromHex(source.private), true);
            var dest = null;

            // 0. We get a newly generated address

            // 1. Post our simple transaction information to get back the fully built transaction,
            //    includes fees when required.
            function newTransaction() {
                var newtx = {
                    "inputs": [{ "addresses": [source.address] }],
                    "outputs": [{ "addresses": [dest.address], "value": 25000 }]
                }
                return $.post(rootUrl + "/txs/new", JSON.stringify(newtx));
            }

            // 2. Sign the hexadecimal strings returned with the fully built transaction and include
            //    the source public address.
            function signAndSend(newtx) {
                if (checkError(newtx)) return;

                newtx.pubkeys = [];
                newtx.signatures = newtx.tosign.map(function(tosign) {
                    newtx.pubkeys.push(source.public);
                    return key.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
                });
                return $.post(rootUrl + "/txs/send", JSON.stringify(newtx));
            }

            // 3. Open a websocket to wait for confirmation the transaction has been accepted in a block.
            function waitForConfirmation(finaltx) {
                if (checkError(finaltx)) return;
                log("Transaction " + finaltx.tx.hash + " to " + dest.address + " of " +
                    finaltx.tx.outputs[0].value / 100000000 + " BTC sent.");

                var ws = new WebSocket("wss://socket.blockcypher.com/v1/btc/test3");

                // We keep pinging on a timer to keep the websocket alive
                var ping = pinger(ws);

                ws.onmessage = function(event) {
                    if (JSON.parse(event.data).confirmations > 0) {
                        log("Transaction confirmed.");
                        ping.stop();
                        ws.close();
                    }
                }
                ws.onopen = function(event) {
                    ws.send(JSON.stringify({ filter: "event=new-block-tx&hash=" + finaltx.tx.hash }));
                }
                log("Waiting for confirmation... (may take > 10 min)")
            }

            function checkError(msg) {
                if (msg.errors && msg.errors.length) {
                    log("Errors occured!!/n" + msg.errors.join("/n"));
                    return true;
                }
            }

            function pinger(ws) {
                var timer = setInterval(function() {
                    if (ws.readyState == 1) {
                        ws.send(JSON.stringify({ event: "ping" }));
                    }
                }, 5000);
                return { stop: function() { clearInterval(timer); } };
            }

            function log(msg) {
                $("div.log").append("<div>" + msg + "</div>")
            }

            // Chaining
            $.post(rootUrl + "/addrs")
                .then(logAddr)
                .then(newTransaction)
                .then(signAndSend)
                .then(waitForConfirmation);
        }

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

        const port = process.env.PORT_BTC3 || 8103

        app.listen(port, () => {
            console.log(`Microservice btc_svc listening on ${port}`)
        })