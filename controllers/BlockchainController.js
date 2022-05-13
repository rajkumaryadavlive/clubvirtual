const { balanceMainETH, ETHTransfer, Admintransfer } = require('../helper/ethhelper');
const { balanceMainBNB, coinBalanceBNB, BNBTransfer, CoinTransfer, AdminCoinTransfer } = require('../helper/bschelper');
const { maticTransfer, Adminmatictransfer } = require('../helper/matichelper')
const ipfsAPI = require("ipfs-api");
const web3 = require('web3');
// const { ethers } = require("ethers");
let fs = require("fs");
var axios = require('axios');
var abi = require('ethereumjs-abi')


const ADMIN_ADDRESS = process.env.ADMIN_ADDRESS;
const ADMIN_KEY = process.env.ADMIN_KEY;

const transferNFT = async (req, res) => {
    console.log("Post Method transferNFT");
    console.log("req body", req.body);
    let address_from = ADMIN_ADDRESS;//req.body.address_from;
    let address_to = req.body.address_to;
    let tokenid = req.body.tokenid;
    let network_type = req.body.network_type;
    let contract_type = req.body.contract_type;
    let standard = req.body.standard;

    let privatekey = ADMIN_KEY;//req.body.privatekey;
    if (network_type == "ETH") {
        let transfer = await ETHTransfer(address_from, address_to, tokenid, contract_type, privatekey, standard)
        let hash = transfer.transactionHash
        let status = "1";
        console.log("transfer", transfer);
        res.send({ hash, status })
    }
    if (network_type == "BNB") {
        let transfer = await BNBTransfer(address_from, address_to, tokenid, contract_type, privatekey, standard)
        let hash = transfer.transactionHash
        let status = "1";
        console.log("transfer", transfer);
        res.send({ hash, status })
    }
    if (network_type == "MATIC") {
        let transfer = await maticTransfer(address_from, address_to, tokenid, contract_type, privatekey, standard)
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

const uploadFileToIpfs = async (req, res) => {
    console.log(req.body);
    //res.redirect(`/addfile/${req.file.filename}`)
    ////////////////////
    let testFile = fs.readFileSync(`./${req.file.filename}`);
    //Creating buffer for ipfs function to add file to the system

    const path = `./${req.file.filename}`;

    try {
        fs.unlinkSync(path);
        //file removed
    } catch (err) {
        console.error(err);
    }

    let testBuffer = new Buffer(testFile);

    ipfs.files.add(testBuffer, async (err, file) => {
        if (err) {
            console.log(err);
        }
        ipfslink = `https://gateway.ipfs.io/ipfs/${file[0].path}`;
        res.send(ipfslink);
    });
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

const ipfsUploadNew = async (req, res) => {
    const ipfs = ipfsAPI("ipfs.infura.io", "5001", { protocol: "https" });
    console.log("req body", req.body);

    let start = req.body.start;
    start = parseInt(start);
    let end = start + 200;
    let ipfsArray = [];
    let promises = [];

    let arrayOfFiles = [];

    let fileCount
    // files.forEach(function (file) {
    //     arrayOfFiles.push({
    //         path: Math.random(),
    //         content: fs.readFileSync(`${__dirname}/export/${file}`),
    //         // mtime: fs.statSync(file).mtime
    //     })
    // })
    console.log(end);
    for (let f = start; f <= 9; f++) {
        // console.log(f);
        arrayOfFiles.push({
            path: Math.random(),
            content: fs.readFileSync(`${__dirname}/export/${f}.png`),
            // mtime: fs.statSync(file).mtime
        })
    }

    console.log(arrayOfFiles);

    let j = 1;
    await ipfs.add(arrayOfFiles, async (err2, result) => {
        console.info(result)
        if (result) {
            let ipfshash = [];
            result.forEach((element, index) => {
                ipfshash[index] = element.hash;
            })
            console.log(ipfshash);
            axios.post('http://127.0.0.1:8001/api/update-ipfs-link', {
                hash: ipfshash,
                start: start
            })
                .then(res => {
                    console.log(`statusCode: ${res.status}`)
                    console.log(res)
                })
                .catch(error => {
                    console.error(error)
                })
            res.send(ipfshash);
        }
    });
    res.send("done");
    return;
}

const ipfsUploadWithAttr = async (req, res) => {
    const ipfs = ipfsAPI("ipfs.infura.io", "5001", { protocol: "https" });
    console.log("req body", req.body);

    let path = req.body.path;
    console.log(path);
    let buffer = "";

    let arrayOfFiles = [];

    var config = {
        method: 'get',
        url: 'http://127.0.0.1:8001/all-data',
        headers: {
            'Content-Type': 'application/json'
        },
    };
    let response = await axios(config);
    //   console.log(response);
    let start = response.data.start;
    response = response.data.data;
    response.forEach(async (element, index) => {
        testFile1 = JSON.parse(element);
        // testFile1.attributes = JSON.parse(element.attributes);
        let testBuffer2 = new Buffer.from(JSON.stringify(testFile1));

        arrayOfFiles.push({
            path: Math.random(),
            content: testBuffer2,
            // mtime: fs.statSync(file).mtime
        })

    });

    await ipfs.add(arrayOfFiles, function (err2, resp) {
        if (err2) {
            console.log(err2);
        }
        console.log(resp);
        let ipfshash = [];
        resp.forEach((element, index) => {
            ipfshash[index] = element.hash;
        })
        console.log(ipfshash);
        axios.post('http://127.0.0.1:8001/api/update-ipfs-metadata', {
            hash: ipfshash,
            start: start
        })
            .then(res => {
                console.log(`statusCode: ${res.status}`)
                console.log(res)
            })
            .catch(error => {
                console.error(error)
            });

    });

    res.send("done");
    // upload attr
    // let attr =  JSON.parse(req.body.attributes);
    // let testFile1 = {
    //     name: `${req.body.name}`,
    //     image: 'https://gateway.ipfs.io/ipfs/'+hash2,
    //     attributes: attr,
    //   };
    // let testBuffer2 = new Buffer.from(JSON.stringify(testFile1));

    // await ipfs.files.add(testBuffer2, function (err2, resp) {
    //     if (err2) {
    //         console.log(err2);
    //     }

    //     console.log(resp);
    //     let newpath = resp ? resp[0].path : "";

    //     res.send(newpath);
    // });
}

const signTrx = async (req, res) => {

    const provider = new ethers.providers.Web3Provider(web3.currentProvider);

    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    const signer = provider.getSigner()
    signature = await signer.signMessage("Hello World");
    console.log(signature);


    // const web3js = new web3(
    //     new web3.providers.HttpProvider(
    //     //   "https://mainnet.infura.io/v3/8ee6b6fda80f40c3826c75ff9afa3d05"
    //     "https://ropsten.infura.io/v3/8ee6b6fda80f40c3826c75ff9afa3d05"

    //     )
    // );

    // const msgParams = [
    //     {
    //         type: 'string',      // Any valid solidity type
    //         name: 'Message',     // Any string label you want
    //         value: 'Hi, Alice!'  // The value to sign
    //     },
    //     {
    //         type: 'uint32',
    //         name: 'A number',
    //         value: '1337'
    //     }
    // ]
    // let from = "0xAE0F55181eb2F538418024B1b04743eD33fb3F1E";
    // web3.currentProvider.sendAsync({
    //     method: 'eth_signTypedData',
    //     params: [msgParams, from],
    //     from: from,
    // }, function (err, result) {
    //     if (err) return console.error(err)
    //     if (result.error) {
    //         return console.error(result.error.message)
    //     }
    //     res.send(result);
    // })
}

const signMsg = async(req,res) => {
    var hash = "0x" + abi.soliditySHA3(
        ["address", "uint256", "uint256", "address"],
        ['0xAE0F55181eb2F538418024B1b04743eD33fb3F1E', '0.01', '237', '0x524CbF476eb918d5Ffa47E8A24732B370F640FE9']
    ).toString("hex");
res.send(hash);
}
module.exports = {
    transferNFT,
    admintransfer,
    ipfsUpload,
    ipfsUploadNew,
    ipfsUploadWithAttr,
    signTrx,
    uploadFileToIpfs,
    signMsg
};