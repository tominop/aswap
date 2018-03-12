const uar = require("./uar_abi"); // address and ABI of UserAddrReg smart contract in Youdex
const uarContract = YODA3.eth.contract(uar.abi).at(uar.address); //  Dex smart contract in Youdex

//  Route - newUser function
<<<<<<< HEAD
app.get("/YODA/uar/newuser/:data", function (req, res, next) {
//    const data = YODA3.toHex((req.params.data).replace(/-/g, ''));
=======
app.get("/YODA/uar/newuser/:data", function(req, res, next) {
>>>>>>> 5ecb0bd7258cafef6669d577355069e7eaeabc58
    const data = '0x' + (req.params.data).replace(/-/g, '');
    console.log('uid: ' + data);
    makeYoudexTx('plasmoid', uar.address, 0, uarContract.newUser.getData(data), res, next);
})

//  Route - newAddr function
app.get("/YODA/uar/newaddrs/:data", function(req, res, next) {
    const data = JSON.parse(req.params.data);
    if (data.symbol == 'ET') {
        if ((data.address).length != 42) next(new Error('Error: invalid ETH address string (<>42) (' + (data.address).length + ')'));
        else {
            data.symbol = YODA3.toHex(data.symbol);
        };
    } else if (data.symbol == 'BT' || data.symbol == 'B3') {
        const len = (data.address).length;
        if (len > 34 || len < 26) next(new Error('Error: invalid BTC address string = ' + len.toString() + ',(must 26-34)'));
        else {
            //  n = 20 - 2 - (len - 20) = 40 - len - 2
            data.symbol = YODA3.toHex(data.symbol + ('*').repeat(40 - len - 2) + (data.address).substring(20, len));
            data.address = YODA3.toHex((data.address).substring(0, 20));
        };
<<<<<<< HEAD
    }
    else next(new Error('Error: invalid currency symbol: ' + data.symbol));
//    data.uid = YODA3.toHex((data.uid).replace(/-/g, ''));
=======
    } else next(new Error('Error: invalid currency symbol: ' + data.symbol));
>>>>>>> 5ecb0bd7258cafef6669d577355069e7eaeabc58
    data.uid = '0x' + (data.uid).replace(/-/g, '');
    console.log('symbol: ' + data.symbol + ' addrs: ' + data.address + ' uid: ' + data.uid);
    makeYoudexTx('plasmoid', uar.address, 0, uarContract.newAddrs.getData(data.symbol, data.address, data.uid), res, next);
})

//  Route - setUserStatus function
app.get("/YODA/uar/setuser/:data", function(req, res, next) {
    if ((req.params.data).length == 38) {
        var uid = (req.params.data).substring(0, 36),
            status = parseInt((req.params.data).substring(37, 38));
        uid = '0x' + (uid).replace(/-/g, '');
        makeYoudexTx('plasmoid', uar.address, 0, uarContract.setUserStatus.getData(uid, status), res, next);
    } else next(new Error('Error: length of data string not equal 38! (' + (req.params.data).length + ')'));
})

//  Route - checkUser function
<<<<<<< HEAD
app.get("/YODA/uar/checkuser/:data", function (req, res, next) {
//    const data = YODA3.toHex((req.params.data).replace(/-/g, ''));
=======
app.get("/YODA/uar/checkuser/:data", function(req, res, next) {
>>>>>>> 5ecb0bd7258cafef6669d577355069e7eaeabc58
    const data = '0x' + (req.params.data).replace(/-/g, '');
    console.log('uid: ' + data);
    uarContract.checkUser(data, function(error, result) {
        if (error) next(error)
        else if (result[0] == 0) next(new Error('user not found'))
        else res.json({ status: result[0], numAddrs: result[1] });
    });
})

//  Route - checkAddrs function
app.get("/YODA/uar/checkaddrs/:data", function(req, res, next) {
    var symbol = (req.params.data).substring(0, 2),
        address = (req.params.data).substring(2, (req.params.data).length);
    console.log(symbol + '  ' + address);
    if (symbol != 'ET') address = YODA3.toHex((address).substring(0, 20))
    uarContract.checkAddrs(address, function(error, result) {
        if (error) next(error)
        else res.json({ symbol: result[0], status: result[1], uid: result[2] });
    });
<<<<<<< HEAD
})
=======
})
>>>>>>> 5ecb0bd7258cafef6669d577355069e7eaeabc58
