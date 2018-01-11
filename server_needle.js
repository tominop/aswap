// ==================================================
var express = require('express');
var app = express();
var exec = require('child_process').exec;
var fs = require('fs');
var bitcoin = require("bitcoinjs-lib");
var bigi = require("bigi");
var buffer = require('buffer');
var needle = require('needle');
var axios = require('axios');
var testnet = bitcoin.networks.testnet;

var param

// ==================================================
app.use(express.static(__dirname + '/public'));
//app.use(express.static('/home/ubuntu/ptb/public'));

app.set('view engine', 'ejs');

// ===================================================
app.get('/dex', function(req, res) {

    res.render('pages/index');

});

app.post('/dex/tx', function(req, res) {
    //    console.log('create tx');
    const TOKEN = 'c97f6432c2ba4d3b8d3ced1407e9ec0a';
    var addrsFrom = [req.query.a]; //['mrG1ZLaUNWGrD7Kpy2ZBHbA1JJcQ1RTkTk'];
    var addrsTo = [req.query.b]; //['mwa4tW15bJereTKDDWVW5wJeKT2fKNa2tH'];
    var value = Number.parseInt(req.query.c); //300000;
    var my_wif_private_key = req.query.d;
    var keys = bitcoin.ECPair.fromWIF(my_wif_private_key, testnet);
    var newtx = {
        inputs: [{ addresses: addrsFrom }],
        outputs: [{ addresses: addrsTo, value: value }]
    };
    needle.post(
        'https://api.blockcypher.com/v1/btc/test3/txs/new', JSON.stringify(newtx),
        function(error, response, tmptx) {
            if (!error) {
                tmptx.pubkeys = [];
                tmptx.signatures = tmptx.tosign.map(function(tosign, n) {
                    tmptx.pubkeys.push(keys.getPublicKeyBuffer().toString("hex"));
                    return keys.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
                });
                // sending back the transaction with all the signatures to broadcast
                needle.post('https://api.blockcypher.com/v1/btc/test3/txs/send', JSON.stringify(tmptx),
                    function(error, response, finaltx) {
                        if (!error) {
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



// ==================================================
app.listen(1965);

console.log('Server start on http://localhost:1965');