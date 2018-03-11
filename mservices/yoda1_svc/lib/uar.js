const uar = require("./uar_abi"); // address and ABI of UserAddrReg smart contract in Youdex
const uarContract = YODA3.eth.contract(uar.abi).at(uar.address); //  Dex smart contract in Youdex

//  Route - newUser function
app.get("/YODA/uar/newuser/:data", function (req, res, next) {
//    const data = YODA3.toHex((req.params.data).replace(/-/g, ''));
    const data = '0x' + (req.params.data).replace(/-/g, '');
    console.log('uid: ' + data);
    makeYoudexTx('plasmoid', uar.address, 0, uarContract.newUser.getData(data), res, next);
})

//  Route - newAddr function
app.get("/YODA/uar/newaddrs/:data", function (req, res, next) {
    const data = JSON.parse(req.params.data);
    if (data.symbol == 'ET') {
        if ((data.address).length != 42) next(new Error('Error: invalid ETH address string (<>42) (' + (data.address).length + ')'));
        else {
            data.symbol = YODA3.toHex(data.symbol);
        };
    }
    else if (data.symbol == 'BT' || data.symbol == 'B3') {
        if ((data.address).length > 34 || (data.address).length < 26) next(new Error('Error: invalid BTC address string (<26, >42) (' + (data.address).length + ')'));
        else {
            symbol = YODA3.toHex(data.symbol + (data.address).substring(20, (data.address).length));
            data.address = YODA3.toHex((data.address).substring(0, 20));
        };
    }
    else next(new Error('Error: invalid currency symbol: ' + data.symbol));
//    data.uid = YODA3.toHex((data.uid).replace(/-/g, ''));
    data.uid = '0x' + (data.uid).replace(/-/g, '');
    console.log('symbol: ' + data.symbol + ' addrs: ' + data.address + ' uid: ' + data.uid);
    makeYoudexTx('plasmoid', uar.address, 0, uarContract.newAddrs.getData(data.symbol, data.address, data.uid), res, next);
})

//  Route - setUserStatus function
app.get("/YODA/uar/setuser/:data", function (req, res, next) {
    if ((req.params.data).length == 35) {
        const uid = (req.params.data).substring(0, 34),
            status = parseInt((req.params.data).substring(34, 35));
        makeYoudexTx('plasmoid', uar.address, 0, uarContract.setUserStatus.getData(uid, status), res, next);
    }
    else next(new Error('Error: length of data string not equal 35! (' + (req.params.data).length + ')'));
})

//  Route - checkUser function
app.get("/YODA/uar/checkuser/:data", function (req, res, next) {
//    const data = YODA3.toHex((req.params.data).replace(/-/g, ''));
    const data = '0x' + (req.params.data).replace(/-/g, '');
    console.log('uid: ' + data);
    uarContract.checkUser(data, function (error, result) {
        if (error) next(error)
        else res.json(result);
    });
})

//  Route - checkAddrs function
app.get("/YODA/uar/checkaddrs/:data", function (req, res, next) {
    uarContract.checkAddrs(req.params.data, function (error, result) {
        if (error) next(error)
        else res.json(result);
    });
})
