var router = express.Router();
const dex = require("./dex_abi"); // address and ABI of DEX smart contract in Youdex
const DExContract = YODA3.eth.contract(dex.abi).at(dex.address); //  Dex smart contract in Youdex
var myCallData, sender;

//  Route - startDex function 
router.get("/YODA/tx/startDEX/:data", function(req, res) {
    const data = JSON.parse(req.params.data),
        valueA = data.valueA, //  value of Alice's coins
        valueB = data.valueB, //  value of Bob's coins
        valueY = data.valueY; //  value of YODA tokens for pledge
    orderID = 0;
    myCallData = DExContract.openDEx.getData(alice.ethAddrs, plasmoid.ethAddrs, valueB * 10 ** 18, valueA * 10 ** 8, valueY * 10 ** 9);
    YODA3.eth.getTransactionCount(bob.ethAddrs, function (error, result) {
        if (!error) {
            const countTx = result;
            var txParams = {
                nonce: YODA3.toHex(countTx),
                gasPrice: gasPrice,
                gasLimit: gasLimit,
                to: dex.address,
                value: '0x0',
                data: myCallData
                // EIP 155 chainId - mainnet: 1, ropsten: 3, 1337 - private
                // chainId: YODA3.toHex(1337)
            };
//            console.log(txParams.nonce + ' ' + txParams.gasPrice + ' ' + txParams.gasLimit + ' ' + txParams.to + ' ' + txParams.value + ' ' + txParams.data);
            var tx = new EthJS(txParams);
//            console.log('tx success bob_key ' + bob.ethKey);
            const privateKey = new Buffer(bob.ethKey, 'hex');
            tx.sign(privateKey);
            var serializedTx = tx.serialize();
            YODA3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
                if (!err) {
                    console.log("startDepo Tx hash " + hash);
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
            var err = new Error('Error! p: ' + provider.host + ' not connected!!!');
            err.status = 501;
            res.header("Access-Control-Allow-Origin", "*");
            res.send(err);
            console.log('Error! p: ' + provider.host + ' not connected!!!');
        };
    });
}, );


//  Route - inDepo function 
router.get("/YODA/tx/inDepo/:data", function(req, res) {
    const order = parseInt(req.params.data),
        myCallData = DExContract.inDepo.getData(order);
    YODA3.eth.getTransactionCount(plasmoid.ethAddrs, function (error, result) {
        if (!error) {
            const countTx = result;
            const txParams = {
                nonce: YODA3.toHex(countTx),
                gasPrice: gasPrice,
                gasLimit: gasLimit,
                to: dex.address,
                value: '0x0',
                data: myCallData
                // EIP 155 chainId - mainnet: 1, ropsten: 3, 1337 - private
                // chainId: YODA3.toHex(1337)
            };
            console.log(txParams.nonce + ' ' + txParams.gasPrice + ' ' + txParams.gasLimit + ' ' + txParams.to + ' ' + txParams.value + ' ' + txParams.data);
            var tx = new EthJS(txParams);
            console.log('tx success plasmoid_key ' + plasmoid.ethKey);
            const privateKey = new Buffer(plasmoid.ethKey, 'hex');
            tx.sign(privateKey);
            var serializedTx = tx.serialize();
            YODA3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
                if (!err) {
                    console.log("Plasmiod's inDepo Tx hash " + hash);
                    res.header("Access-Control-Allow-Origin", "*");
                    res.json({ hash: hash });
                } else {
                    console.log(err);
                    //            var err = new Error(err)
                    err.status = 501;
                    res.header("Access-Control-Allow-Origin", "*");
                    res.send(err);
                };
            });
        } else {
            var err = new Error('Error! p: ' + provider.host + ' not connected!!!');
            err.status = 501;
            res.header("Access-Control-Allow-Origin", "*");
            res.send(err);
            console.log('Error! p: ' + provider.host + ' not connected!!!');
        }
    })
})

//  Route - outDepo function 
router.get("/YODA/tx/outDepo/:data", function(req, res) {
    const order = parseInt(req.params.data),
        myCallData = DExContract.outDepo.getData(order, plasmoid.ethAddrs);
    YODA3.eth.getTransactionCount(plasmoid.ethAddrs, function (error, result) {
        if (!error) {
            const countTx = result;
            const txParams = {
                nonce: YODA3.toHex(countTx),
                gasPrice: gasPrice,
                gasLimit: gasLimit,
                to: dex.address,
                value: '0x0',
                data: myCallData
                // EIP 155 chainId - mainnet: 1, ropsten: 3, 1337 - private
                // chainId: YODA3.toHex(1337)
            };
//            console.log(txParams.nonce + ' ' + txParams.gasPrice + ' ' + txParams.gasLimit + ' ' + txParams.to + ' ' + txParams.value + ' ' + txParams.data);
            var tx = new EthJS(txParams);
//            console.log('tx success plasmoid_key ' + plasmoid.ethKey);
            const privateKey = new Buffer(plasmoid.ethKey, 'hex');
            tx.sign(privateKey);
            var serializedTx = tx.serialize();
            YODA3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
                if (!err) {
                    console.log("Plasmiod's inDepo Tx hash " + hash);
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


module.exports = router;
