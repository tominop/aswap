module.exports = {
    'address': '0x04e6f1f9035b0a22ce36d8eed10364c019ba855c',
    'abi': [{
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
        "name": "checkUserStatus",
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
        "constant": true,
        "inputs": [
            {
                "name": "_addrs",
                "type": "address"
            }
        ],
        "name": "checkAddrsStatus",
        "outputs": [
            {
                "name": "addrs",
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
    }
    ]
}