module.exports = {
    'address': '0xc3e79faed95fc6c11ca3863b0659047e550db110',
    'abi': [{
            "constant": true,
            "inputs": [],
            "name": "numUsers",
            "outputs": [{
                "name": "",
                "type": "uint8"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "numAddrs",
            "outputs": [{
                "name": "",
                "type": "uint8"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [{
                "name": "_uID",
                "type": "bytes16"
            }],
            "name": "newUser",
            "outputs": [{
                "name": "",
                "type": "bool"
            }],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [{
                    "name": "_symbol",
                    "type": "bytes16"
                },
                {
                    "name": "_addrs",
                    "type": "address"
                },
                {
                    "name": "_uID",
                    "type": "bytes16"
                }
            ],
            "name": "newAddrs",
            "outputs": [{
                "name": "",
                "type": "bool"
            }],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [{
                    "name": "_uID",
                    "type": "bytes16"
                },
                {
                    "name": "_status",
                    "type": "uint8"
                }
            ],
            "name": "setUserStatus",
            "outputs": [{
                "name": "",
                "type": "bool"
            }],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [{
                    "name": "_addrs",
                    "type": "address"
                },
                {
                    "name": "_status",
                    "type": "uint8"
                }
            ],
            "name": "setAddrsStatus",
            "outputs": [{
                "name": "",
                "type": "bool"
            }],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [{
                "name": "_uID",
                "type": "bytes16"
            }],
            "name": "checkUser",
            "outputs": [{
                    "name": "status",
                    "type": "uint8"
                },
                {
                    "name": "numaddrs",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [{
                "name": "_addrs",
                "type": "address"
            }],
            "name": "checkAddrs",
            "outputs": [{
                    "name": "symbol",
                    "type": "bytes16"
                },
                {
                    "name": "status",
                    "type": "uint8"
                },
                {
                    "name": "uID",
                    "type": "bytes16"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]
}