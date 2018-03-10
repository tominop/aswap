const dex = require("./dex_abi"); // address and ABI of DEX smart contract in Youdex
const DExContract = YODA3.eth.contract(dex.abi).at(dex.address); //  Dex smart contract in Youdex

//  Route - startDex function 
app.get("/YODA/startDEX/:data", function(req, res) {
    const data = JSON.parse(req.params.data),
        valueA = data.valueA, //  value of Alice's coins
        valueB = data.valueB, //  value of Bob's coins
        valueY = data.valueY; //  value of YODA tokens for pledge
    orderID = 0;
    myCallData = DExContract.openDEx.getData(alice.ethAddrs, plasmoid.ethAddrs, valueB * 10 ** 18, valueA * 10 ** 8, valueY * 10 ** 9);
    makeYoudexTx('bob', dex.address, 0, myCallData, res);
});


//  Route - inDepo function 
app.get("/YODA/inDepo/:data", function(req, res) {
    const order = parseInt(req.params.data),
        myCallData = DExContract.inDepo.getData(order);
    makeYoudexTx('plasmoid', dex.address, 0, myCallData, res);
})

//  Route - outDepo function 
app.get("/YODA/outDepo/:data", function(req, res) {
    const order = parseInt(req.params.data),
        myCallData = DExContract.outDepo.getData(order, plasmoid.ethAddrs);
        makeYoudexTx('plasmoid', dex.address, 0, myCallData, res);
})
