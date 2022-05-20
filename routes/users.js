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

router.post('/get-proposal-trx',  transactionController.proposalTrx);

router.post('/make-batch-trx',  transactionController.makeBatchTrx);

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

router.post('/get-single-collection-trx',  importController.getSingleCollectionTrx);

router.post('/remove-from-sale',  transactionController.removeFromSale);
// router.post('/remove-from-sale',  transactionController.transferNftToOwner);

router.post('/remove-from-auction',  transactionController.removeAuction);

router.post('/transfer-to-admin',  transactionController.transferToAdmin);

router.post('/check-nft-owner',  transactionController.ownerOf);

router.post('/uploadFileToIpfs',  blockchainController.uploadFileToIpfs);

router.post('/sign-message',  blockchainController.signMsg);

router.post('/read-sale',  transactionController.readSale);

router.post('/change-price',  transactionController.changePrice);

router.post('/get-balance',  transactionController.getBalance);

module.exports = router;
