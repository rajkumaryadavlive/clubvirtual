var axios = require('axios');
const web3 = require('web3');
const maticAuction = require('../contract/matic-auction')
const ethAuction = require('../contract/eth-auction')
const bscAuction = require('../contract/bsc-auction')

const getCollection = async (req, res) => {
    console.log("makeOrder", req.body);
    const contract_address = req.body.contract_addreess;
    const wallet_addreess = req.body.wallet_address;
    const type = req.body.type;

    let providerUrl = "";
    let apiUrl = "";

    if (type == "ETH") {
        providerUrl = "https://ropsten.infura.io/v3/8ee6b6fda80f40c3826c75ff9afa3d05";
        apiUrl = `https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contract_address}&apikey=DANQTF6918JFWUEDUS7YEVNMITR7PCH5EA`;
    } else if (type == "BNB") {
        providerUrl = "https://ropsten.infura.io/v3/8ee6b6fda80f40c3826c75ff9afa3d05";
        apiUrl = `https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contract_address}&apikey=DANQTF6918JFWUEDUS7YEVNMITR7PCH5EA`;
    } else if (type == "MATIC") {
        providerUrl = "https://rpc-mumbai.maticvigil.com/";
        apiUrl = `https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contract_address}&apikey=DANQTF6918JFWUEDUS7YEVNMITR7PCH5EA`;
    }

    const web3js = new web3(
        new web3.providers.HttpProvider(
            providerUrl
        )
    );

    console.log(apiUrl);
    let result = await axios.get(apiUrl);

    let contractAbi = result.data.result;
    contractAbi = JSON.parse(contractAbi);
    let nftContract = new web3js.eth.Contract(contractAbi, contract_address);

    let info = await nftContract.methods.tokensOwned(wallet_addreess).call();

    info = JSON.stringify(info);
    res.send(info)
}

const getMetadata = async (req, res) => {
    console.log("makeOrder", req.body);
    const contract_address = req.body.contract_addreess;
    const token_id = req.body.token_id;
    const type = req.body.type;

    let providerUrl = "";
    let apiUrl = "";

    if (type == "ETH") {
        providerUrl = "https://ropsten.infura.io/v3/8ee6b6fda80f40c3826c75ff9afa3d05";
        apiUrl = `https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contract_address}&apikey=DANQTF6918JFWUEDUS7YEVNMITR7PCH5EA`;
    } else if (type == "BNB") {
        providerUrl = "https://ropsten.infura.io/v3/8ee6b6fda80f40c3826c75ff9afa3d05";
        apiUrl = `https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contract_address}&apikey=DANQTF6918JFWUEDUS7YEVNMITR7PCH5EA`;
    } else if (type == "MATIC") {
        providerUrl = "https://rpc-mumbai.maticvigil.com/";
        apiUrl = `https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contract_address}&apikey=DANQTF6918JFWUEDUS7YEVNMITR7PCH5EA`;
    }

    const web3js = new web3(
        new web3.providers.HttpProvider(
            providerUrl
        )
    );

    console.log(apiUrl);
    let result = await axios.get(apiUrl);
    let contractAbi = result.data.result;

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
    
    console.log(token_price);
    console.log(token_ids);
    let providerUrl = "";
    let contractAddress = "";
    let contractAbi = "";

    if (type == "ETH") {
        providerUrl = "https://ropsten.infura.io/v3/8ee6b6fda80f40c3826c75ff9afa3d05";
        contractAddress = ethAuction.contractAddress;
        contractAbi = ethAuction.ABI;
    } else if (type == "BNB") {
        providerUrl = "https://ropsten.infura.io/v3/8ee6b6fda80f40c3826c75ff9afa3d05";
        contractAddress = bscAuction;
        contractAbi = bscAuction.ABI;
    } else if (type == "MATIC") {
        providerUrl = "https://rpc-mumbai.maticvigil.com/";
        contractAddress = maticAuction;
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

const getApproval = async (req, res) => {
    console.log("makeOrder", req.body);
    const contract_address = req.body.contract_addreess;
    const sell_contract = req.body.sell_contract;
    const selectedAccount = req.body.selectedAccount;

    const type = req.body.type;

    let providerUrl = "";
    let apiUrl = "";

    if (type == "ETH") {
        providerUrl = "https://ropsten.infura.io/v3/8ee6b6fda80f40c3826c75ff9afa3d05";
        apiUrl = `https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contract_address}&apikey=DANQTF6918JFWUEDUS7YEVNMITR7PCH5EA`;
    } else if (type == "BNB") {
        providerUrl = "https://ropsten.infura.io/v3/8ee6b6fda80f40c3826c75ff9afa3d05";
        apiUrl = `https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contract_address}&apikey=DANQTF6918JFWUEDUS7YEVNMITR7PCH5EA`;
    } else if (type == "MATIC") {
        providerUrl = "https://rpc-mumbai.maticvigil.com/";
        apiUrl = `https://api-ropsten.etherscan.io/api?module=contract&action=getabi&address=${contract_address}&apikey=DANQTF6918JFWUEDUS7YEVNMITR7PCH5EA`;
    }

    const web3js = new web3(
        new web3.providers.HttpProvider(
            providerUrl
        )
    );

    console.log(apiUrl);
    let result = await axios.get(apiUrl);
    let contractAbi = result.data.result;

    contractAbi = JSON.parse(contractAbi);
    let nftContract = new web3js.eth.Contract(contractAbi, contract_address);

    let v = await web3js.eth.getTransactionCount(selectedAccount);

    let rawTransaction1 = {
        "from": selectedAccount,
        // "gasPrice": gasPrice,
        // "gasLimit": gasLimit,
        "to": contract_address,
        "data": nftContract.methods.setApprovalForAll(sell_contract, 1).encodeABI(),
        "nonce": web3js.utils.toHex(v)
    };

    res.send(rawTransaction1)
}

module.exports = {
    getCollection,
    getMetadata,
    getApproval,
    getCollectionTrx
};