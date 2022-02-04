const bscHelper = require('../helper/bschelper')
const ethHelper = require('../helper/ethhelper')
const maticHelper = require('../helper/matichelper')

const ipfsAPI = require("ipfs-api");
const web3 = require('web3');
const req = require('express/lib/request');

const makeTrx = async (req, res) => {
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

module.exports = {
    makeTrx,
    sellTrx,
    bidTrx,
    bidInfo,
    auctionSettleTrx,
    sellAuctionTrx
};