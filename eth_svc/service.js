 /*!
 * @title eth_svc Ethereum API microservice
 * @author Oleg Tomin - <ot@limex.io>
 * @dev Basic implementaion of Ethereum API functions  
 * MIT Licensed Copyright(c) 2018-2019
 */

const express = require("express")
const app = express()
const axios = require('axios')
const urlEth = 'https://rinkeby.infura.io/'
var Web3 = require("web3")
var Eth3 = ''

app.get("/eth/api/:token", (req, res) => {
    const token = req.params.token
    Eth3 = new Web3(new Web3.providers.HttpProvider(urlEth + token))
    const provider = Eth3.currentProvider
    Eth3.eth.getGasPrice(function(error, result) {
        if (!error) {
            res.header("Access-Control-Allow-Origin", "*")
            res.json({error: false, host: provider.host, gasPrice: result})
            console.log('p: '+provider.host+'  gP' + result)
        }
        else {
            res.header("Access-Control-Allow-Origin", "*")
            res.json({error: true})
            console.log('Error! p: '+provider.host+' not connected!!!')
        }
    })
})

app.get("/eth/balance/:addrs", (req, res) => {
    const addrsETH = req.params.addrs
//    const balance = Eth3.eth.getBalance(addrsETH) / 10 ** 18
    const balance = 18
    res.header("Access-Control-Allow-Origin", "*")
    res.json({ balance: balance })
})

const port = process.env.PORT_ETH || 8200

app.listen(port, () => {
    console.log(`Microservice eth_svc listening on ${port}`)
})