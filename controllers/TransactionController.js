const bscHelper = require('../helper/bschelper')
const ethHelper = require('../helper/ethhelper')
const maticHelper = require('../helper/matichelper')

const ipfsAPI = require("ipfs-api");
const web3 = require('web3');

const makeTrx = async (req, res) => {
    // console.log("makeOrder", req.body);
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
    const currency = req.body.currency;

    const txObj = {
        selectedAccount: req.body.selectedAccount,
        contract_type: req.body.contract_type,
        transferTo: req.body.transferTo,
        tokenId: req.body.tokenId,
    }
    //  console.log("makeOrder", req.body);
    if (currency == "ETH") {
        tx = await ethHelper.makeSellTransaction(txObj)
    }
    res.send(tx)
}
module.exports = {
    makeTrx,
    sellTrx
};