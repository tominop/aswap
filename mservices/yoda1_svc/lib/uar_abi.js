module.exports = {
    'address': '0x48bf06f92de7853b1bb01be22deaad3c5969efd3',
    'abi': [
        {
            "constant": true,
            "inputs": [],
            "name": "numUsers",
            "outputs": [
              {
                "name": "",
                "type": "uint8"
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
                "type": "uint8"
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
                "type": "bytes32"
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
                "name": "_symbol",
                "type": "bytes16"
              },
              {
                "name": "_addrs",
                "type": "address"
              },
              {
                "name": "_uID",
                "type": "bytes32"
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
                "type": "bytes32"
              },
              {
                "name": "_status",
                "type": "uint8"
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
                "type": "uint8"
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
                "type": "bytes32"
              }
            ],
            "name": "checkUser",
            "outputs": [
              {
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
            "inputs": [
              {
                "name": "_addrs",
                "type": "address"
              }
            ],
            "name": "checkAddrs",
            "outputs": [
              {
                "name": "symbol",
                "type": "bytes16"
              },
              {
                "name": "status",
                "type": "uint8"
              },
              {
                "name": "uID",
                "type": "bytes32"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          }
                ]
}