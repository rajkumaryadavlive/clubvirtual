var axios = require('axios');
const web3 = require('web3');
const maticAuction = require('../contract/matic-auction')
const ethAuction = require('../contract/eth-auction')
const bscAuction = require('../contract/bsc-auction')

let ethRpc = "https://ropsten.infura.io/v3/8ee6b6fda80f40c3826c75ff9afa3d05";
let bscRpc = "https://data-seed-prebsc-1-s1.binance.org:8545/";
let maticRpc = "https://matic-testnet-archive-rpc.bwarelabs.com/";

const getCollection = async (req, res) => {
    console.log("makeOrder", req.body);
    const contract_address = req.body.contract_addreess;
    const wallet_addreess = req.body.wallet_address;
    const type = req.body.type;

    let providerUrl = "";
    let apiUrl = "http://18.223.117.55/api/get-abi";

    if (type == "ETH") {
        providerUrl = ethRpc;
        // apiUrl = `https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contract_address}&apikey=DANQTF6918JFWUEDUS7YEVNMITR7PCH5EA`;
    } else if (type == "BNB") {
        providerUrl = bscRpc;
        // apiUrl = `https://api.bscscan.com/api?module=contract&action=getabi&address=${contract_address}&apikey=DANQTF6918JFWUEDUS7YEVNMITR7PCH5EA`;
    } else if (type == "MATIC") {
        providerUrl = maticRpc;
        // apiUrl = `https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=${contract_address}&apikey=DANQTF6918JFWUEDUS7YEVNMITR7PCH5EA`;
    }

    const web3js = new web3(
        new web3.providers.HttpProvider(
            providerUrl
        )
    );

    let result = await axios.post(apiUrl,{
        blockchain:type,
        address:contract_address
    });
    // console.log(result);
    if(result.data.status != 1){
        res.send('0')
    }

    let contractAbi = result.data.data.abi;
    
    contractAbi = JSON.parse(contractAbi);
    console.log(contractAbi);
    let nftContract = new web3js.eth.Contract(contractAbi, contract_address);

    let info = await nftContract.methods.tokensOwned(wallet_addreess).call();

    console.log(info);

    info = JSON.stringify(info);
    res.send(info)
}

const getMetadata = async (req, res) => {
    console.log("makeOrder", req.body);
    const contract_address = req.body.contract_addreess;
    const token_id = req.body.token_id;
    const type = req.body.type;

    let providerUrl = "";

    if (type == "ETH") {
        providerUrl = ethRpc;
        // apiUrl = `https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contract_address}&apikey=DANQTF6918JFWUEDUS7YEVNMITR7PCH5EA`;
    } else if (type == "BNB") {
        providerUrl = bscRpc;
        // apiUrl = `https://api.bscscan.com/api?module=contract&action=getabi&address=${contract_address}&apikey=DANQTF6918JFWUEDUS7YEVNMITR7PCH5EA`;
    } else if (type == "MATIC") {
        providerUrl = maticRpc;
        // apiUrl = `https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=${contract_address}&apikey=DANQTF6918JFWUEDUS7YEVNMITR7PCH5EA`;
    }
    let apiUrl = "http://127.0.0.1:8001/api/get-abi";
    const web3js = new web3(
        new web3.providers.HttpProvider(
            providerUrl
        )
    );

    // console.log("apiUrl");
    // console.log(apiUrl);
    let result = await axios.post(apiUrl,{
        blockchain:type,
        address:contract_address
    });
    // console.log(result);
    if(result.data.status != 1){
        res.send('0')
    }

    let contractAbi = result.data.data.abi;

    contractAbi = JSON.parse(contractAbi);
    let nftContract = new web3js.eth.Contract(contractAbi, contract_address);

    let info = await nftContract.methods.tokenURI(token_id).call();

    res.send(info)
}

const getCollectionTrx = async (req, res) => {
    console.log("makeOrder", req.body);
    const contract_address = req.body.contractAddress;
    let token_ids = req.body.tokenIds;
    let priceArr = req.body.priceArr;
    const erc20 = req.body.erc20;
    const selectedAccount = req.body.selectedAccount;

    const type = req.body.type;

    token_ids = JSON.parse(token_ids);
    priceArr = JSON.parse(priceArr);

    let token_price = [];
    priceArr.forEach(element => {
        let amt = element * 1000000000000000000;
        amt = amt.toFixed(0);
        amt = BigInt(amt).toString();

        token_price.push(amt);
    });
    
    let providerUrl = "";
    let contractAddress = "";
    let contractAbi = "";

    if (type == "ETH") {
        providerUrl = ethRpc;
        contractAddress = ethAuction.contractAddress;
        contractAbi = ethAuction.ABI;
    } else if (type == "BNB") {
        providerUrl = bscRpc;
        contractAddress = bscAuction.contractAddress;
        contractAbi = bscAuction.ABI;
    } else if (type == "MATIC") {
        providerUrl = maticRpc;
        contractAddress = maticAuction.contractAddress;
        contractAbi = maticAuction.ABI;
    }

    const web3js = new web3(
        new web3.providers.HttpProvider(
            providerUrl
        )
    );

    let nftContract = new web3js.eth.Contract(contractAbi, contractAddress);

    let v = await web3js.eth.getTransactionCount(selectedAccount);

    let rawTransaction1 = {
        "from": selectedAccount,
        "to": contractAddress,
        "data": nftContract.methods.createBatchSale(contract_address, token_ids,token_price,erc20).encodeABI(),
        "nonce": web3js.utils.toHex(v)
    };

    res.send(rawTransaction1)
}

const getSingleCollectionTrx = async (req, res) => {
    console.log("makeOrder", req.body);
    const contract_address = req.body.contractAddress;
    let token_ids = req.body.tokenIds;
    let token_price = req.body.priceArr;
    const erc20 = req.body.erc20;
    const selectedAccount = req.body.selectedAccount;

    const type = req.body.type;


    
    let providerUrl = "";
    let contractAddress = "";
    let contractAbi = "";

    if (type == "ETH") {
        providerUrl = ethRpc;
        contractAddress = ethAuction.contractAddress;
        contractAbi = ethAuction.ABI;
    } else if (type == "BNB") {
        providerUrl = bscRpc;
        contractAddress = bscAuction.contractAddress;
        contractAbi = bscAuction.ABI;
    } else if (type == "MATIC") {
        providerUrl = maticRpc;
        contractAddress = maticAuction.contractAddress;
        contractAbi = maticAuction.ABI;
    }

    const web3js = new web3(
        new web3.providers.HttpProvider(
            providerUrl
        )
    );

    let amt = token_price * 1000000000000000000;
        amt = amt.toFixed(0);
        amt = BigInt(amt).toString();

    let nftContract = new web3js.eth.Contract(contractAbi, contractAddress);

    let v = await web3js.eth.getTransactionCount(selectedAccount);

    let rawTransaction1 = {
        "from": selectedAccount,
        "to": contractAddress,
        "data": nftContract.methods.createSale(contract_address, token_ids,erc20,amt).encodeABI(),
        "nonce": web3js.utils.toHex(v)
    };

    res.send(rawTransaction1)
}

const getApproval = async (req, res) => {
    console.log("makeOrder", req.body);
    const contract_address = req.body.contract_addreess;
    const sell_contract = req.body.sell_contract;
    const selectedAccount = req.body.selectedAccount;

    const type = req.body.type;

    let providerUrl = "";
    // let apiUrl = "";

    if (type == "ETH") {
        providerUrl = ethRpc;
        // apiUrl = `https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contract_address}&apikey=DANQTF6918JFWUEDUS7YEVNMITR7PCH5EA`;
    } else if (type == "BNB") {
        providerUrl = bscRpc;
        // apiUrl = `https://api.bscscan.com/api?module=contract&action=getabi&address=${contract_address}&apikey=DANQTF6918JFWUEDUS7YEVNMITR7PCH5EA`;
    } else if (type == "MATIC") {
        providerUrl = maticRpc;
        // apiUrl = `https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=${contract_address}&apikey=DANQTF6918JFWUEDUS7YEVNMITR7PCH5EA`;
    }

    let apiUrl = "http://18.223.117.55/api/get-abi";
    const web3js = new web3(
        new web3.providers.HttpProvider(
            providerUrl
        )
    );

    // console.log("apiUrl");
    // console.log(apiUrl);
    let result = await axios.post(apiUrl,{
        blockchain:type,
        address:contract_address
    });
    // console.log(result);
    if(result.data.status != 1){
        res.send('0')
    }
    console.log(result);
    let contractAbi = result.data.data.abi;

    contractAbi = JSON.parse(contractAbi);
    let nftContract = new web3js.eth.Contract(contractAbi, contract_address);

    let v = await web3js.eth.getTransactionCount(selectedAccount);

    let isApproved = await nftContract.methods.isApprovedForAll(selectedAccount,sell_contract).call();

    let rawTransaction1 = {
        "from": selectedAccount,
        // "gasPrice": gasPrice,
        // "gasLimit": gasLimit,
        "to": contract_address,
        "data": nftContract.methods.setApprovalForAll(sell_contract, 1).encodeABI(),
        "nonce": web3js.utils.toHex(v)
    };
    console.log(isApproved);
    let r = {
        'trx' : rawTransaction1,
        'isApproved':isApproved
    };
    // rawTransaction1 = JSON.stringify(rawTransaction1);
    res.send(r);
}

module.exports = {
    getCollection,
    getMetadata,
    getApproval,
    getCollectionTrx,
    getSingleCollectionTrx
};