const bscHelper = require('../helper/bschelper')
const ethHelper = require('../helper/ethhelper')
const maticHelper = require('../helper/matichelper')

const ipfsAPI = require("ipfs-api");
const web3 = require('web3');
const req = require('express/lib/request');

const ADMIN_ADDRESS = process.env.ADMIN_ADDRESS;
const ADMIN_KEY = process.env.ADMIN_KEY;

var axios = require('axios');

const makeTrx = async (req, res) => {
    console.log("makeOrder", ADMIN_ADDRESS);
    const amount = req.body.amount;
    const wallet_address = req.body.address;
    const currency = req.body.currency;
    adminAddress = req.body.to;
    let tx = "";

    const txObj = {
        currency : currency,
        amount: req.body.amount,
        selectedAccount: req.body.selectedAccount,
        contract_type: req.body.contract_type,
        voucher: req.body.voucher,
        nft_creator: req.body.nft_creator,
        adminFee: req.body.adminFee,
        admin: req.body.admin,
        functionName: req.body.functionName,
        nft_owner: req.body.nft_owner,
        royalty: req.body.royalty,
        standard: req.body.standard,
        nft_contract_address:req.body.nft_contract_address,
        token_id:req.body.token_id

    }

    if (currency == "ETH") {
        tx = await ethHelper.makeTransaction(txObj)

    } else if (currency == "BNB") {
        tx = await bscHelper.makeTransaction(txObj)
    }
    else if (currency == "MATIC") {
        tx = await maticHelper.makeTransaction(txObj)
    }

    res.send(tx)
}

const makeBatchTrx = async (req, res) => {
    console.log("makeOrder", req.body);
    const amount = req.body.amount;
    const wallet_address = req.body.address;
    const currency = req.body.currency;
    adminAddress = req.body.to;
    let tx = "";

    const txObj = {
        amount: req.body.amount,
        selectedAccount: req.body.selectedAccount,
        contract_type: req.body.contract_type,
        voucher: req.body.voucher,
        nft_creator: req.body.nft_creator,
        adminFee: req.body.adminFee,
        admin: req.body.admin,
        functionName: req.body.functionName,
        nft_owner: req.body.nft_owner,
        royalty: req.body.royalty,
        standard: req.body.standard,
        nft_contract_address: req.body.nft_contract_address,
        token_id: req.body.token_id,

    }

    if (currency == "ETH") {
        tx = await ethHelper.makeBatchTransaction(txObj)

    } else if (currency == "BNB") {
        tx = await bscHelper.makeBatchTransaction(txObj)
    }
    else if (currency == "MATIC") {
        tx = await maticHelper.makeBatchTransaction(txObj)
    }

    res.send(tx)
}

const sellTrx = async (req, res) => {
    console.log("makeOrder", req.body);

    const currency = req.body.currency;

    const txObj = {
        selectedAccount: req.body.selectedAccount,
        contract_type: req.body.contract_type,
        transferTo: req.body.transferTo,
        tokenId: req.body.tokenId,
        standard: req.body.standard,
    }
    let tx = null;
    //  console.log("makeOrder", req.body);
    if (currency == "ETH") {
        tx = await ethHelper.makeSellTransaction(txObj)
    } else if (currency == "BNB") {
        tx = await bscHelper.makeSellTransaction(txObj)
    } else if (currency == "MATIC") {
        tx = await maticHelper.makeSellTransaction(txObj)
    }
    res.send(tx)
}

const sellAuctionTrx = async (req, res) => {
    console.log("makeOrder", req.body);

    const currency = req.body.currency;

    const txObj = {
        selectedAccount: req.body.selectedAccount,
        contractAddress: req.body.contractAddress,
        erc20: req.body.erc20,
        amount: req.body.amount,
        auctionDuration: req.body.auctionDuration,
        tokenId: req.body.tokenId,
        royalty:req.body.royalty,
        comission:req.body.comission,
        startTime:req.body.startTime
    }
    let tx = null;
    //  console.log("makeOrder", req.body);
    if (currency == "ETH") {
        tx = await ethHelper.makeSellAuctionTransaction(txObj)
    } else if (currency == "BNB") {
        tx = await bscHelper.makeSellAuctionTransaction(txObj)
    } else if (currency == "MATIC") {
        tx = await maticHelper.makeSellAuctionTransaction(txObj)
    }
    res.send(tx)
}

const bidTrx = async (req, res) => {
    //  console.log("makeOrder", req.body);
    const currency = req.body.currency;

    const txObj = {
        selectedAccount: req.body.selectedAccount,
        contractAddress: req.body.contractAddress,
        erc20: req.body.erc20,
        amount: req.body.amount,
        tokenId: req.body.tokenId,
    }
    //  console.log("makeOrder", req.body);
    if (currency == "ETH") {
        tx = await ethHelper.makeBidTransaction(txObj)
    } else if (currency == "BNB") {
        tx = await bscHelper.makeBidTransaction(txObj)
    } else if (currency == "MATIC") {
        tx = await maticHelper.makeBidTransaction(txObj)
    }
    res.send(tx);
}

const bidInfo = async (req, res) => {
    //  console.log("makeOrder", req.body);
    const currency = req.body.currency;

    const txObj = {
        contractAddress: req.body.contractAddress,
        tokenId: req.body.tokenId,
    }
    //  console.log("makeOrder", req.body);
    if (currency == "ETH") {
        tx = await ethHelper.getBidInfo(txObj)
    } else if (currency == "BNB") {
        tx = await bscHelper.getBidInfo(txObj)
    } else if (currency == "MATIC") {
        tx = await maticHelper.getBidInfo(txObj)
    }
    res.send(tx);
}

const auctionSettleTrx = async (req, res) => {
    console.log("makeOrder", req.body);
    const currency = req.body.currency;

    const txObj = {
        selectedAccount: req.body.selectedAccount,
        contractAddress: req.body.contractAddress,
        tokenId: req.body.tokenId,
    }
    //  console.log("makeOrder", req.body);
    if (currency == "ETH") {
        tx = await ethHelper.settleAuctionTrx(txObj)
    } else if (currency == "BNB") {
        tx = await bscHelper.settleAuctionTrx(txObj)
    }  else if (currency == "MATIC") {
        tx = await maticHelper.settleAuctionTrx(txObj)
    }
    res.send(tx);
}

const transferNftToOwner = async (req, res) => {
    const currency = req.body.currency;
    const passKey = req.body.passKey;
    if(passKey != "X~RLb<PYfUa8-H=n"){
        res.send(null);
    }
    const txObj = {
        selectedAccount: req.body.selectedAccount,
        tokenId: req.body.tokenId,
        contractAddress:req.body.contractAddress,
        adminAddress:ADMIN_ADDRESS,
        adminKey:ADMIN_KEY
    }
    console.log(txObj);
    if (currency == "ETH") {
        tx = await ethHelper.transferNftToOwner(txObj)
    } else if (currency == "BNB") {
        tx = await bscHelper.transferNftToOwner(txObj)
    }  else if (currency == "MATIC") {
        tx = await maticHelper.transferNftToOwner(txObj)
    }
    res.send(tx);
};

const transferToAdmin = async (req, res) => {
    const currency = req.body.currency;
    const passKey = req.body.passKey;
    if(passKey != "X~RLb<PYfUa8-H=n"){
        res.send(null);
    }
    const txObj = {
        selectedAccount: req.body.selectedAccount,
        tokenId: req.body.tokenId,
        contractAddress:req.body.contractAddress,
        adminAddress:ADMIN_ADDRESS,
        standard:req.body.standard,
    }
    
    if (currency == "ETH") {
        tx = await ethHelper.transferToAdmin(txObj)
    } else if (currency == "BNB") {
        tx = await bscHelper.transferToAdmin(txObj)
    }  else if (currency == "MATIC") {
        tx = await maticHelper.transferToAdmin(txObj)
    }
    res.send(tx);
};

const removeAuction = async (req,res) => {
    const currency = req.body.currency;
    const txObj = {
        selectedAccount: req.body.selectedAccount,
        nftContract: req.body.nftContract,
        tokenId: req.body.tokenId,
    }
    console.log(req.body);
    let tx = "";
    if (currency == "ETH") {
        tx = await ethHelper.removeFromAuction(txObj)
    } else if (currency == "BNB") {
        tx = await bscHelper.removeFromAuction(txObj)
    }  else if (currency == "MATIC") {
        tx = await maticHelper.removeFromAuction(txObj)
    }
    res.send(tx);
}
const  ownerOf = async (req,res) => {
    const currency = req.body.currency;
    const passKey = req.body.passKey;
    if(passKey != "X~RLb<PYfUa8-H=n"){
        res.send(null);
    }
    const txObj = {
        selectedAccount: req.body.selectedAccount,
        tokenId: req.body.tokenId,
        contractAddress:req.body.contractAddress,
        standard:req.body.standard
    }
    console.log(txObj);
    let contractAbi = "";
    let contractAddress = txObj.contractAddress;
    let apiUrl = process.env.API_URL + "get-abi";
    let result = await axios.post(apiUrl, {
        blockchain: currency,
        address: txObj.contractAddress
    });

    if (result.data.status != 1) {
        res.send('0')
    }
    const web3js = new web3(
        new web3.providers.HttpProvider(
            result.data.data.rpc_url    
        )
    );

    contractAbi = result.data.data.contract_abi;

    contractAbi = JSON.parse(contractAbi);

    let nftContract = new web3js.eth.Contract(contractAbi, contractAddress);
    let trData = null;
    if(txObj.standard == "1155"){
        trData = await nftContract.methods.balanceOf(txObj.selectedAccount,txObj.tokenId).call();
    } else{
        trData = await nftContract.methods.ownerOf(txObj.tokenId).call();
    }
    console.log(trData);
    res.send(trData);
}
module.exports = {
    makeTrx,
    sellTrx,
    bidTrx,
    bidInfo,
    auctionSettleTrx,
    sellAuctionTrx,
    makeBatchTrx,
    transferNftToOwner,
    removeAuction,
    transferToAdmin,
    ownerOf
};