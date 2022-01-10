const { balanceMainETH, ETHTransfer, Admintransfer } = require('../helper/ethhelper');
const { balanceMainBNB, coinBalanceBNB, BNBTransfer, CoinTransfer, AdminCoinTransfer } = require('../helper/bschelper');
const { maticTransfer, Adminmatictransfer } = require('../helper/matichelper')
const ipfsAPI = require("ipfs-api");
const web3 = require('web3');

const transferNFT = async (req, res) => {
    console.log("Post Method transferNFT");
    console.log("req body", req.body);
    let address_from = req.body.address_from;
    let address_to = req.body.address_to;
    let tokenid = req.body.tokenid;
    let network_type = req.body.network_type;
    let contract_type = req.body.contract_type;
    let privatekey = req.body.privatekey;
    if (network_type == "ETH") {
        let transfer = await ETHTransfer(address_from, address_to, tokenid, contract_type, privatekey)
        let hash = transfer.transactionHash
        let status = "1";
        console.log("transfer", transfer);
        res.send({ hash, status })
    }
    if (network_type == "BNB") {
        let transfer = await BNBTransfer(address_from, address_to, tokenid, contract_type, privatekey)
        let hash = transfer.transactionHash
        let status = "1";
        console.log("transfer", transfer);
        res.send({ hash, status })
    }
    if (network_type == "MATIC") {
        let transfer = await maticTransfer(address_from, address_to, tokenid, contract_type, privatekey)
        let hash = transfer.transactionHash
        let status = "1";
        console.log("transfer", transfer);
        res.send({ hash, status })
    }
}

const admintransfer = async (req, res) => {
    console.log("Post Method admin transfer");
    console.log("req body", req.body);
    let address_to = req.body.address_to;
    let amount = req.body.amount;
    amount = amount.toString()
    let network_type = req.body.network_type;
    let address_from = req.body.address_from;
    let privatekey = req.body.privatekey;

    if (network_type == "ETH") {
        let transfer = await Admintransfer(address_from, privatekey, address_to, amount)
        let hash = transfer.transactionHash
        let status = "1";
        console.log("transfer", transfer);
        res.send({ hash, status })
    }
    if (network_type == "BNB") {
        let transfer = await AdminCoinTransfer(address_from, privatekey, address_to, amount)
        let hash = transfer.transactionHash
        let status = "1";
        console.log("transfer", transfer);
        res.send({ hash, status })
    }
    if (network_type == "MATIC") {
        let transfer = await Adminmatictransfer(address_from, privatekey, address_to, amount)
        let hash = transfer.transactionHash
        let status = "1";
        console.log("transfer", transfer);
        res.send({ hash, status })
    }
}

const ipfsUpload = async (req, res) => {
    const ipfs = ipfsAPI("ipfs.infura.io", "5001", { protocol: "https" });

    let testFile1 = {
        name: `${req.body.name}`,
        price: `${req.body.price}`,
        uri: `${req.body.uri}`,
    };
    let testBuffer2 = new Buffer.from(JSON.stringify(testFile1));
    await ipfs.files.add(testBuffer2, function (err2, file2) {
        if (err2) {
            console.log(err2);
        }
        //console.log(file2);
        console.log(`https://gateway.ipfs.io/ipfs/${file2[0].path}`);
        let hash2 = file2[0].path;

        res.send(hash2);
    });
}
const signTrx = async (req, res) => {

    const web3js = new web3(
        new web3.providers.HttpProvider(
        //   "https://mainnet.infura.io/v3/8ee6b6fda80f40c3826c75ff9afa3d05"
        "https://ropsten.infura.io/v3/8ee6b6fda80f40c3826c75ff9afa3d05"
    
        )
    );

    const msgParams = [
        {
            type: 'string',      // Any valid solidity type
            name: 'Message',     // Any string label you want
            value: 'Hi, Alice!'  // The value to sign
        },
        {
            type: 'uint32',
            name: 'A number',
            value: '1337'
        }
    ]
    let from = "0xAE0F55181eb2F538418024B1b04743eD33fb3F1E";
    web3js.sendAsync({
        method: 'eth_signTypedData',
        params: [msgParams, from],
        from: from,
    }, function (err, result) {
        if (err) return console.error(err)
        if (result.error) {
            return console.error(result.error.message)
        }
        res.send(result);
    })
}
module.exports = {
    transferNFT,
    admintransfer,
    ipfsUpload,
    signTrx
};