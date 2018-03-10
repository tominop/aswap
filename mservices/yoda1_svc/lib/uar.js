const uar = require("./uar_abi"); // address and ABI of UserAddrReg smart contract in Youdex
const uarContract = YODA3.eth.contract(uar.abi).at(uar.address); //  Dex smart contract in Youdex

//  Route - newUser function
app.get("/YODA/uar/newuser/:data", function(req, res, next) {
    makeYoudexTx('plasmoid', uar.address, 0, uarContract.newUser.getData(req.params.data), res, next);
})

//  Route - newAddr function
app.get("/YODA/uar/newaddrs/:data", function(req, res) {
    const uid = (req.params.data).substring(0,18),
        address = (req.params.data).substring(18,60);
        console.log('uid: ' + uid + '  addrs: ' + address);
    makeYoudexTx('plasmoid', uar.address, 0, uarContract.newAddrs.getData(uid, address), res);
})

//  Route - setUserStatus function
app.get("/YODA/uar/setuser/:data", function(req, res) {
    const data = JSON.parse(req.params.data);
    makeYoudexTx('plasmoid', uar.address, 0, uarContract.setUserStatus.getData(data.uid, data.status), res);
})

//  Route - checkUserStatus function
app.get("/YODA/uar/checkuser/:data", function(req, res) {
    uarContract.checkUser(req.params.data, function (error, result) {
        if (error) next(error)
        else res.json(result);
    });
})

//  Route - checkAddrsStatus function
app.get("/YODA/uar/checkaddrs/:data", function(req, res) {
    uarContract.checkAddrs(req.params.data, function (error, result) {
        if (error) next(error)
        else res.json(result);
    });
})

//  Route - outDepo function 
app.get("/YODA/outUAR/:data", function(req, res) {
    const order = parseInt(req.params.data),
        myCallData = DExContract.outDepo.getData(order, plasmoid.ethAddrs);
        makeYoudexTx('plasmoid', uar.address, 0, myCallData, res);
})


//  Route - startDex function 
app.get("/YODA/startUAR/:data", function(req, res) {
    const data = JSON.parse(req.params.data),
        valueA = data.valueA, //  value of Alice's coins
        valueB = data.valueB, //  value of Bob's coins
        valueY = data.valueY; //  value of YODA tokens for pledge
    orderID = 0;
    myCallData = DExContract.openDEx.getData(alice.ethAddrs, plasmoid.ethAddrs, valueB * 10 ** 18, valueA * 10 ** 8, valueY * 10 ** 9);
    makeYoudexTx('bob', uar.address, 0, myCallData,res);
});

