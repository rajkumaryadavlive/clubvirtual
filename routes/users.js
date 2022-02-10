var express = require('express');
var router = express.Router();
const blockchainController = require('../controllers/BlockchainController')
const transactionController = require('../controllers/TransactionController')
const importController = require('../controllers/ImportController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//***************** get create wallet **************//
router.post('/Transfer-NFT',  blockchainController.transferNFT);

router.post('/Admin-transfer',  blockchainController.admintransfer);

router.post('/make-trx',  transactionController.makeTrx);

router.post('/make-sell-trx',  transactionController.sellTrx);

router.post('/make-sell-auction-trx',  transactionController.sellAuctionTrx);

router.post('/make-bid-trx',  transactionController.bidTrx);

router.post('/get-bid-info',  transactionController.bidInfo);

router.post('/get-settle-trx',  transactionController.auctionSettleTrx);

router.post('/ipfs-upload',  blockchainController.ipfsUpload);

router.post('/ipfs-upload-new',  blockchainController.ipfsUploadNew);

router.post('/ipfs-upload-attr',  blockchainController.ipfsUploadWithAttr);

router.post('/sign-trx',  blockchainController.signTrx);

router.post('/get-collection',  importController.getCollection);

router.post('/get-metadata',  importController.getMetadata);

router.post('/get-approval',  importController.getApproval);

router.post('/get-collection-trx',  importController.getCollectionTrx);


module.exports = router;
