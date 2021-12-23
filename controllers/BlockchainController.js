const { balanceMainETH, ETHTransfer } = require('../helper/ethHelper');
const { balanceMainBNB, coinBalanceBNB, BNBTransfer, CoinTransfer, AdminCoinTransfer } = require('../helper/bscHelper');

const transferNFT = async (req, res) => {
    console.log("Post Method transferNFT");
    console.log("req body", req.body);
    let address_from = req.body.address_from;
    let address_to = req.body.address_to;
    let tokenid = req.body.tokenid;
    let network_type= req.body.network_type;
    let contract_type = req.body.contract_type;
    
}

module.exports = {
    transferNFT
};