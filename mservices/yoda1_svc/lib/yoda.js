var router = express.Router();


//  Route - userActive function 
router.get("/YODA/user/:data", function(req, res) {
    const user = req.params.data;
    if (user == "old") {
        userActive = new Date().getTime();
        busy = false;
    } else if (user == "new") {
        const newTime = new Date().getTime();
        if (newTime - userActive > 10000) {
            busy = false;
            userActive = newTime;
        } else busy = true;
    };
    res.header("Access-Control-Allow-Origin", "*");
    res.json({ busy: busy });
});

//  Route - check balance of YODA tokens
router.get("/YODA/balance/:name", function(req, res) {
    const addrs = eval(req.params.name).ethAddrs;
    tokenContract.balanceOf(addrs, function (error, result) {
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


//  Route - yoda token transfer function 
router.get("/YODA/tx/yoda/:data", function(req, res) {
    const data = JSON.parse(req.params.data),
        from = eval(data.from).ethAddrs,
        to = eval(data.to).ethAddrs,
        valueY = data.valueY;
    var myCallData = tokenContract.transfer.getData(to, valueY * 10 ** 9);
    YODA3.eth.getTransactionCount(from, function (error, result) {
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
            YODA3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
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


//  Route - eth transfer function 
router.get("/YODA/make/:data", function(req, res) {
    const data = JSON.parse(req.params.data),
        from = eval(data.from).ethAddrs,
        to = eval(data.to).ethAddrs,
        valueE = data.valueE;
    YODA3.eth.getTransactionCount(from, function (error, result) {
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
            YODA3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
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


//  Route - waitTx function 
router.get("/YODA/waitTx/:data", function(req, res) {
    hash = req.params.data;
    var interval;
    var timeOut = setTimeout(function () {
        clearInterval(interval);
        var err = new Error("Error while mining YODA Tx in next 30 sec.")
        err.status = 504
        console.log(err)
        res.header("Access-Control-Allow-Origin", "*");
        res.send(err)
    }, 30000);
    interval = setInterval(function () {
        var block
        YODA3.eth.getTransaction(hash, function (error, result) {
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

module.exports = router;
