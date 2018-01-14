//var hostBtcApi = 'http://localhost:8100/btc/'; //  main net
var hostBtcApi = 'http://localhost:8103/btc3/'    // testnet3
var hostEthApi = 'http://localhost:8200/eth/'
var isEthApi = isBtcApi = isLmxApi = false
var hostLmxApi = 'http://localhost:8201/lmx/'

//  Init ETH API function
function initApi() {
    $.get(hostEthApi + 'api/' + tokenEthApi)
        .then(function(d) {
            if (!d.error) {
                isEthApi = true
                gasPrice = d.gasPrice
                console.log('ETH API enabled on host: ' + d.host + ', gasPrice=' + gasPrice/10**9 + ' Gwei')
            }
            else {
                isEthApi = false
                gasPrice = 0
                console.log('!!!ETH API NOT enabled. Microservice says: Infura.io not response')
                //            alice[1] = Eth3.fromWei(Eth3.eth.getBalance(addrsETHA), "ether");
                // document.getElementById('aliceEthBalance').innerText = ' ' + alice[1].toFixed(3) + ' ';
            }
        })
        .fail(function(err) {
            isEthApi = false
            if (err.status == 0) console.log('!!!ETH API Microservice not runs')
            else console.log('!!!ETH API NOT enabled!!! Microservice says: ' + err.responseText)
        })
    $.get(hostBtcApi + 'api/' + tokenBtcApi)
        .then(function(d) {
            if (!d.error) {
                isBtcApi = true
                btcFee = d.btcFee
                console.log('BTC API enabled on host: ' + d.host + ', limit=' + d.btcFee + ' s')
            }
            else {
                isBtcApi = false
                console.log('!!!BTC API NOT enabled. Microservice says: Blockcypher.com not response')
            }
        })
        .fail(function(err) {
            isBtcApi = false
            if (err.status == 0) console.log('!!!BTC API Microservice not runs')
            else console.log('!!!BTC API NOT enabled!!! Microservice says: ' + err.responseText)
        })
    $.get(hostLmxApi + 'api/' + tokenAddrs)
        .then(function(d) {
            if (!d.error) {
                isLmxApi = true
                gasPrice = d.gasPrice
                console.log('LMX API enabled on host: ' + d.host + ', gasPrice=' + gasPrice/10**9 + ' Gwei')
            }
            else {
                isLmxApi = false
                gasPrice = 0
                console.log('!!!LMX API NOT enabled. Microservice says: Limex node not response')
                //            alice[1] = Eth3.fromWei(Eth3.eth.getBalance(addrsETHA), "ether");
                // document.getElementById('aliceEthBalance').innerText = ' ' + alice[1].toFixed(3) + ' ';
            }
        })
        .fail(function(err) {
            isLmxApi = false
            if (err.status == 0) console.log('!!!LMX API Microservice not runs')
            else console.log('!!!LMX API NOT enabled!!! Microservice says: ' + err.responseText)
        })
}

//  Show wallets function
function showWallets() {
    //  Alice's wallet
    document.getElementById('aliceEth').innerText = ' ' + addrsETHA + ' ';
    document.getElementById('aliceBtc').innerText = ' ' + addrsBTCA + ' ';
    document.getElementById('aliceLmx').innerText = ' ' + addrsETHA + ' ';
    //  Bob's wallet
    document.getElementById('bobEth').innerText = ' ' + addrsETHB + ' ';
    document.getElementById('bobBtc').innerText = ' ' + addrsBTCB + ' ';
    document.getElementById('bobLmx').innerText = ' ' + addrsETHB + ' ';
    document.getElementById('plasmaLmx').innerText = ' ' + addrsETHP + ' ';
}


//  ShowBalanses function
function showBalances() {

    var timeOut = timeOut1 = timeOut2 = ""
    //  Alice's wallet
 //   alice.balanceEth();
 //   bob.balanceEth();
    if (!isEthApi) {
        timeOut = setTimeout(function() {
        showMess('Init ETH API error!')
        }, 3000)
    }        
    if (isEthApi) {
        clearTimeout(timeOut);
        balanceEth('alice', addrsETHA)
        balanceEth('bob', addrsETHB)
    }
    if (!isBtcApi) {
        timeOut1 = setTimeout(function() {
        showMess('Init BTC API error!')
        }, 3000)
    }        
    if (isBtcApi) {
        clearTimeout(timeOut1);
        balanceBtc('alice', addrsBTCA)
        balanceBtc('bob', addrsBTCB)
    }
    if (!isLmxApi) {
        timeOut2 = setTimeout(function() {
        showMess('Init LMX API error!')
        }, 3000)
    }        
    if (isLmxApi) {
        clearTimeout(timeOut2);
        balanceLmx('alice', addrsETHA)
        balanceLmx('bob', addrsETHB)
        balanceLmx('plasma', addrsETHP)
    }

   //    alice[1] = tokenContract.balanceOf(addrsETHA) / 10 ** 9;
    document.getElementById('aliceLmxBalance').innerText = ' ' + alice[1].toFixed(3) + ' ';
    //  Bob's wallet
//    summLIMEB = tokenContract.balanceOf(addrsETHB) / 10 ** 9;
    document.getElementById('bobLmxBalance').innerText = ' ' + summLIMEB.toFixed(3) + ' ';
//    summLIMEP = tokenContract.balanceOf(addrsETHP) / 10 ** 9;
    document.getElementById('plasmaLmxBalance').innerText = ' ' + summLIMEP.toFixed(3) + ' ';
}

function balanceEth(user, addrsETH) {
    console.log(user + '  ' + addrsETH)            
    $.get(hostEthApi + 'balance/' + addrsETH)
    .then(function(d) {
        summETH = d.balance;
        document.getElementById(user + 'EthBalance').innerText = ' ' + summETH.toFixed(3) + ' ';
    })
    .fail(function(err) {
        document.getElementById(user + 'EthBalance').innerText = ' NaN ';
        console.log(err.status + err.responseText)            
    })
}

function balanceBtc(user, addrsBTC) {
    console.log(user + '  ' + addrsBTC)            
    $.get(hostBtcApi + 'balance/' + addrsBTC)
    .then(function(d) {
        summBTC = d.balance;
        document.getElementById(user + 'BtcBalance').innerText = ' ' + summBTC.toFixed(6) + ' ';
    })
    .fail(function(err) {
        document.getElementById(user + 'BtcBalance').innerText = ' NaN ';
        console.log(err.status + err.responseText)            
    })
}

function balanceLmx(user, addrsETH) {
    console.log(user + '  ' + addrsETH)            
    $.get(hostLmxApi + 'balance/' + addrsETH)
    .then(function(d) {
        summETH = d.balance;
        document.getElementById(user + 'LmxBalance').innerText = ' ' + summETH.toFixed(3) + ' ';
    })
    .fail(function(err) {
        document.getElementById(user + 'LmxBalance').innerText = ' NaN ';
        console.log(err.status + err.responseText)            
    })
}

function showPrices() {
    $.get(hostPrice + '/ethereum/')
        .then(function(d) {
            var ethPriceBTC_s = d[0].price_btc;
            var ethPriceUSD_s = d[0].price_usd;
            ethPriceBTC = parseFloat(ethPriceBTC_s);
            ethPriceUSD = parseFloat(ethPriceUSD_s);
            lmxPrice = (1.0 / ethPriceUSD).toFixed(6);
            lmxPrice_s = lmxPrice.toString();
            document.getElementById('plasmaPrices').innerText = 'ETH/BTC= ' + ethPriceBTC_s + '; ETH/USD= ' + ethPriceUSD_s + '; LIME/ETH= ' + lmxPrice_s + ';';
            valueBTC = alice[0];
            document.getElementById('summBTCA').value = valueBTC.toFixed(6);
            valueETH = valueBTC / ethPriceBTC;
            valueLIME = valueETH / lmxPrice;
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
    valueLIME = valueETH / lmxPrice;
    document.getElementById('summETHA').value = valueETH.toFixed(3);
    document.getElementById('summLIMEA').value = valueLIME.toFixed(3);
}

function calcBtc() {
    valueETH = document.getElementById('summETHA').value;
    valueBTC = valueETH * ethPriceBTC;
    valueLIME = valueETH / lmxPrice;
    document.getElementById('summBTCA').value = valueBTC.toFixed(6);
    document.getElementById('summLIMEA').value = valueLIME.toFixed(3);
}

function placeOrder() {
    nStr = 0;
    valueBTC = parseFloat(document.getElementById('alice[0]').value);
    valueETH = parseFloat(document.getElementById('summETHA').value);
    valueLIME = parseFloat(document.getElementById('summLIMEA').value);
    var err = false;
    var errStr = '';
    showMess("Alice places order: " + valueBTC.toFixed(6) + "BTC to  " + valueETH.toFixed(3) + "ETH with pledge:" + valueLIME.toFixed(3) + "LIME");
    if (valueBTC > alice[0]) {
        errStr = 'Alice has not enough BTC! ';
        err = true;
    };
    if (valueETH > summETHB) {
        errStr = errStr + 'Bob has not enough ETH! ';
        err = true;
    };
    if (valueLIME > alice[1]) {
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