//  Local variables
const yoda = require("./yoda_abi"),  // address and ABI of YODA smart contract in Youdex
    urlYoudex = 'http://10.20.40.5:8080/', //  JSON-RPC server Youdex node
    Web3 = require("web3"),
    EthJS = require("ethereumjs-tx");

//  Global variables
YODA3 = new Web3(new Web3.providers.HttpProvider(urlYoudex));
alice = require("../../../private/keystore/alice"); //  address and private key in Ethereum (Youdex) and Bitcoin;
bob = require("../../../private/keystore/bob"); //  address and private key in Ethereum (Youdex) and Bitcoin;
plasmoid = require("../../../private/keystore/plasmoid"); //  address and private key in Ethereum (Youdex);
gasLimit = gasPrice = '';
userActive = 0; //  init variables

// YODA token smart contract in Youdex
const yodaContract = YODA3.eth.contract(yoda.abi).at(yoda.address);

initYoudexApi = function (mess, res) {
    YODA3.eth.getGasPrice(function (error, result) { //  calculate gas price
        if (error) next(error)
        else {
            gasPrice = YODA3.toHex(result);
            gasLimit = YODA3.toHex(4700000);
            if (res) res.json({ error: false, host: urlYoudex, gasPrice: result });
            console.log((new Date()).toYMDTString() +  ' ' + mess + ', ' + 'gasPrice ' + result);
        };
    });
};

initYoudexApi('connect to Youdex RPC server at ' + urlYoudex);

makeYoudexTx = function (walletFrom, To, amount, data, res, next) {
    YODA3.eth.getTransactionCount(eval(walletFrom).ethAddrs, function (error, result) {
        if (error) next(error)
        else {
            const countTx = result;
            var txParams = {
                nonce: YODA3.toHex(countTx),
                gasPrice: gasPrice,
                gasLimit: gasLimit,
                to: To,
                value: YODA3.toHex(amount),
                data: data
                // EIP 155 chainId - mainnet: 1, ropsten: 3, 1337 - private
                // chainId: YODA3.toHex(1337)
            };
            //            console.log(txParams.nonce + ' ' + txParams.gasPrice + ' ' + txParams.gasLimit + ' ' + txParams.to + ' ' + txParams.value + ' ' + txParams.data);
            var tx = new EthJS(txParams);
            //            console.log('tx success key ' + eval(data.from).ethKey);
            const privateKey = new Buffer(eval(walletFrom).ethKey, 'hex');
            tx.sign(privateKey);
            const serializedTx = tx.serialize();
            YODA3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
                if (err) next(err)
                else res.json({ hash: hash });
            });
        };
    });
}

//  Route - userActive function 
app.get("/YODA/user/:data", function (req, res) {
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
    res.json({ busy: busy });
});

//  Route - connect to API provider, set global variables YODA3, gasPrice
app.get("/YODA/api/:data", function (req, res) {
    const mess = 'service ' + req.params.data + ' connected';
    initYoudexApi(mess, res);
});

//  Route - check balance of YODA tokens
app.get("/YODA/balance/:name", function (req, res) {
    const addrs = eval(req.params.name).ethAddrs;
    yodaContract.balanceOf(addrs, function (error, result) {
        if (error) next(error)
        else res.json({ balance: result / 10 ** 9, address: addrs });
    });
})


//  Route - yoda token transfer function 
app.get('/YODA/tokenTX/:data', function (req, res) {
    const data = JSON.parse(req.params.data);
    const myCallData = yodaContract.transfer.getData(eval(data.to).ethAddrs, data.valueY * 10 ** 9);
    makeYoudexTx(data.from, yoda.address, 0, myCallData, res);
})


//  Route - eth transfer function 
app.get("/YODA/makeTx/:data", function (req, res) {
    const data = JSON.parse(req.params.data);
    makeYoudexTx(data.from, eval(data.to).ethAddrs, data.valueE, '0x0', res);
})

//  Route - getTransactionReceipt 
app.get("/YODA/getTx/:data", function (req, res) {
    YODA3.eth.getTransactionReceipt(req.params.data, function (error, result) {
        if (error) next(error)
        else res.json(result)
    });
})

//  Route - waitTx function 
app.get("/YODA/waitTx/:data", function (req, res) {
    hash = req.params.data;
    var interval;
    var timeOut = setTimeout(function () {
        clearInterval(interval);
        var err = new Error("Error while mining Youdex Tx in next 30 sec.")
        err.status = 504
        next(err);
    }, 30000);
    interval = setInterval(function () {
        var block
        YODA3.eth.getTransaction(hash, function (error, result) {
            if (error) next(error)
            else {
                block = result;
                if (block != null) {
                    if (block.blockNumber > 0) {
                        console.log("Tx is confirmed in block " + block.blockNumber);
                        res.json({ block: block.blockNumber });
                        clearTimeout(timeOut);
                        clearInterval(interval);
                    }
                };
            };
        });
    }, 1000);
})
