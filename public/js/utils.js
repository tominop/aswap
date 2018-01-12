var hostBtcApi = 'http://localhost:8100/btc/';
var hostEthApi = 'http://localhost:8200/eth/';
var hostLimeApi = 'http://localhost:8201/lime/';
//  Show wallets function

function initApi() {
    $.get(hostEthApi + 'api/' + tokenEthApi)
        .then(function(d) {
            console.log('ETH API enabled on host: ' + d.host);
            //            summETHA = Eth3.fromWei(Eth3.eth.getBalance(addrsETHA), "ether");
            // document.getElementById('aliceEthBalance').innerText = ' ' + summETHA.toFixed(3) + ' ';
        });
}

function showWallets() {
    //  Alice's wallet
    document.getElementById('aliceEth').innerText = ' ' + addrsETHA + ' ';
    document.getElementById('aliceBtc').innerText = ' ' + addrsBTCA + ' ';
    document.getElementById('aliceLime').innerText = ' ' + addrsETHA + ' ';
    //  Bob's wallet
    document.getElementById('bobEth').innerText = ' ' + addrsETHB + ' ';
    document.getElementById('bobBtc').innerText = ' ' + addrsBTCB + ' ';
    document.getElementById('bobLime').innerText = ' ' + addrsETHB + ' ';
    document.getElementById('plasmaLime').innerText = ' ' + addrsETHP + ' ';
}


//  ShowBalanses function
function showBalances() {
    //  Alice's wallet
    $.get(hostEthApi + 'balance/' + addrsETHA)
        .then(function(d) {
            summETHA = d.balance;
            //            summETHA = Eth3.fromWei(Eth3.eth.getBalance(addrsETHA), "ether");
            document.getElementById('aliceEthBalance').innerText = ' ' + summETHA.toFixed(3) + ' ';
        });
    $.get(hostBtcApi + 'balance/' + addrsBTCA)
        .then(function(d) {
            summBTCA = d.balance;
            document.getElementById('aliceBtcBalance').innerText = ' ' + summBTCA.toFixed(6) + ' '
        });
    summLIMEA = tokenContract.balanceOf(addrsETHA) / 10 ** 9;
    document.getElementById('aliceLimeBalance').innerText = ' ' + summLIMEA.toFixed(3) + ' ';
    //  Bob's wallet
    $.get(hostEthApi + 'balance/' + addrsETHB)
        .then(function(d) {
            summETHB = d.balance;
            //            summETHA = Eth3.fromWei(Eth3.eth.getBalance(addrsETHA), "ether");
            document.getElementById('bobEthBalance').innerText = ' ' + summETHB.toFixed(3) + ' ';
        });
    $.get(hostBtcApi + 'balance/' + addrsBTCB)
        .then(function(d) {
            summBTCB = d.balance;
            document.getElementById('bobBtcBalance').innerText = ' ' + summBTCB.toFixed(6) + ' '
        });
    summLIMEB = tokenContract.balanceOf(addrsETHB) / 10 ** 9;
    document.getElementById('bobLimeBalance').innerText = ' ' + summLIMEB.toFixed(3) + ' ';
    summLIMEP = tokenContract.balanceOf(addrsETHP) / 10 ** 9;
    document.getElementById('plasmaLimeBalance').innerText = ' ' + summLIMEP.toFixed(3) + ' ';
}

function showPrices() {
    $.get(hostPrice + '/ethereum/')
        .then(function(d) {
            var ethPriceBTC_s = d[0].price_btc;
            var ethPriceUSD_s = d[0].price_usd;
            ethPriceBTC = parseFloat(ethPriceBTC_s);
            ethPriceUSD = parseFloat(ethPriceUSD_s);
            limePrice = (1.0 / ethPriceUSD).toFixed(6);
            limePrice_s = limePrice.toString();
            document.getElementById('plasmaPrices').innerText = 'ETH/BTC= ' + ethPriceBTC_s + '; ETH/USD= ' + ethPriceUSD_s + '; LIME/ETH= ' + limePrice_s + ';';
            valueBTC = summBTCA;
            document.getElementById('summBTCA').value = valueBTC.toFixed(6);
            valueETH = valueBTC / ethPriceBTC;
            valueLIME = valueETH / limePrice;
            document.getElementById('summETHA').value = valueETH.toFixed(3);
            document.getElementById('summLIMEA').value = valueLIME.toFixed(3);
        });
}

function showMess(s) {
    nStr = nStr + 1;
    document.getElementById('progressStatus').innerText = s;
    console.log(timeNow + ': ' + s);
}

//  Order's functions

function calcEth() {
    valueBTC = document.getElementById('summBTCA').value;
    valueETH = valueBTC / ethPriceBTC;
    valueLIME = valueETH / limePrice;
    document.getElementById('summETHA').value = valueETH.toFixed(3);
    document.getElementById('summLIMEA').value = valueLIME.toFixed(3);
}

function calcBtc() {
    valueETH = document.getElementById('summETHA').value;
    valueBTC = valueETH * ethPriceBTC;
    valueLIME = valueETH / limePrice;
    document.getElementById('summBTCA').value = valueBTC.toFixed(6);
    document.getElementById('summLIMEA').value = valueLIME.toFixed(3);
}

function placeOrder() {
    nStr = 0;
    valueBTC = parseFloat(document.getElementById('summBTCA').value);
    valueETH = parseFloat(document.getElementById('summETHA').value);
    valueLIME = parseFloat(document.getElementById('summLIMEA').value);
    var err = false;
    var errStr = '';
    showMess("Alice places order: " + valueBTC.toFixed(6) + "BTC to  " + valueETH.toFixed(3) + "ETH with pledge:" + valueLIME.toFixed(3) + "LIME");
    if (valueBTC > summBTCA) {
        errStr = 'Alice has not enough BTC! ';
        err = true;
    };
    if (valueETH > summETHB) {
        errStr = errStr + 'Bob has not enough ETH! ';
        err = true;
    };
    if (valueLIME > summLIMEA) {
        errStr = errStr + 'Alice has not enough LIME! ';
        err = true;
    };
    if (valueLIME > summLIMEB) {
        errStr = errStr + 'Bob has not enough LIME! ';
        err = true;
    };
    if (err) {
        document.getElementById('aliceStatus').innerText = errStr + 'Please, correct this!';
        return
    };
    document.getElementById('summBTCB').value = valueBTC.toFixed(6);
    document.getElementById('summETHB').value = valueETH.toFixed(3);
    document.getElementById('summLIMEB').value = valueLIME.toFixed(3);
    document.getElementById('aliceStatus').innerText = 'Order sent, waiting for order accept';
    document.getElementById('bobStatus').innerText = 'Order received, waiting for order accept';
    semafor(0, 1, 0);
}

function fillOrder() {
    showMess("Bob accepts order: " + valueBTC.toFixed(3) + "BTC to  " + valueETH.toFixed(3) + "ETH with pledge:" + valueLIME.toFixed(3) + "LIME");
    stepN = 0;
    orderID = 0;
    nextStep();
    semafor(0, 0, 1);
}

function semafor(a, b, c) {
    if (a == 1) document.getElementById('aliceLed').style = redLed;
    else if (a == 0) document.getElementById('aliceLed').style = greenLed;
    if (b == 1) document.getElementById('bobLed').style = redLed;
    else if (b == 0) document.getElementById('bobLed').style = greenLed;
    if (c == 1) document.getElementById('plasmoidLed').style = redLed;
    else if (c == 0) document.getElementById('plasmoidLed').style = greenLed;
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > 2 * 1000) {
            break;
        }
    }
    return false;
}

function sendEth1() {
    var Tx = makeEthTX(addrsETHB, ethPrivateKeyB, addrsETHA, valueETH);
    Eth3.eth.sendRawTransaction(Tx, function(err, hash) {
        if (!err)
            console.log('Success, TXhash: ' + hash);
        else
            console.log('Error: ' + err);
    });
}

function sendCoin(value) {
    valueLIME = value;
    stepN = 6;
    nextStep();
}

function digitalWatch() {
    var s = " a.m.";
    var date = new Date();
    var hours = date.getUTCHours();
    var hours1 = date.getHours();

    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    if (hours > 12) {
        hours = hours - 12;
        s = " p.m.";
    }
    if (hours < 10) hours = "0" + hours.toString();
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    timeNow = hours + ":" + minutes + ":" + seconds;
    document.getElementById("digital_watch").innerText = hours + ":" + minutes + ":" + seconds + s;
}

function nSleep(n, seconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > seconds * 1000) {
            break;
        }
    }
    return n + 1;
}

function showDate() {
    var date = new Date();
    document.getElementById("dateNow").innerText = date.toDateString()
}