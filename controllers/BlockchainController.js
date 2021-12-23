const { balanceMainETH, ETHTransfer } = require('../helper/ethhelper');
const { balanceMainBNB, coinBalanceBNB, BNBTransfer, CoinTransfer, AdminCoinTransfer } = require('../helper/bschelper');

const transferNFT = async (req, res) => {
    console.log("Post Method transferNFT");
    console.log("req body", req.body);
    let address_from = req.body.address_from;
    let address_to = req.body.address_to;
    let tokenid = req.body.tokenid;
    let network_type= req.body.network_type;
    let contract_type = req.body.contract_type;
    let privatekey = req.body.privatekey;
    if(network_type == "ETH")
    {
        let transfer = await ETHTransfer(address_from, address_to, tokenid, contract_type, privatekey)
        let hash = transfer.transactionHash
        let status = "1";
        console.log("transfer", transfer);
        res.send({ hash,status })
    }
    if(network_type == "BNB")
    {
        let transfer = await BNBTransfer(address_from, address_to, tokenid, contract_type, privatekey)
        console.log("transfer", transfer);
        res.send({ transfer })
    }
}

module.exports = {
    transferNFT
};