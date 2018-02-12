 /*!
 * @title btc_svc BTC API microservice for mainnet
 * @author Oleg Tomin - <ot@limex.io>
 * @dev Basic implementaion of BTC API functions  
 * MIT Licensed Copyright(c) 2018-2019
 */

const express = require("express")
const app = express()
const axios = require('axios')
const btcUrl = 'https://api.blockcypher.com/v1/btc/main'

app.get("/btc/balance/:addrs", (req, res) => {
    const addrsBTC = req.params.addrs
    axios.get(btcUrl + '/addrs/' + addrsBTC + '/balance')
        .then(response => {
            //        console.log(response.data.url);
            //        console.log(response.data.explanation);
            res.header("Access-Control-Allow-Origin", "*")
                //            res.json({ balance: response.data.final_balance / 10 ** 8 })
            res.json({ balance: response.data.balance / 10 ** 8 }) //for my transaction
        })
        .catch(error => {
            console.log(error);
        });
})




const port = process.env.PORT_BTC || 8100

app.listen(port, () => {
    console.log(`Microservice btc_svc listening on ${port}`)
})