module.exports = {
    'address': '0xee4a61d377a277772c9a9fe885029c74f010bb46',
    'abi': [
        {
            "constant": true,
            "inputs": [],
            "name": "numUsers",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "numAddrs",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_uID",
                    "type": "bytes8"
                }
            ],
            "name": "newUser",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_uID",
                    "type": "bytes8"
                },
                {
                    "name": "_addrs",
                    "type": "address"
                }
            ],
            "name": "newAddrs",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_uID",
                    "type": "bytes8"
                },
                {
                    "name": "_status",
                    "type": "uint256"
                }
            ],
            "name": "setUserStatus",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_addrs",
                    "type": "address"
                },
                {
                    "name": "_status",
                    "type": "uint256"
                }
            ],
            "name": "setAddrsStatus",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_uID",
                    "type": "bytes8"
                }
            ],
            "name": "checkUser",
            "outputs": [
                {
                    "name": "status",
                    "type": "uint256"
                },
                {
                    "name": "numaddrs",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_addrs",
                    "type": "address"
                }
            ],
            "name": "checkAddrs",
            "outputs": [
                {
                    "name": "status",
                    "type": "uint256"
                },
                {
                    "name": "uID",
                    "type": "bytes8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]
}