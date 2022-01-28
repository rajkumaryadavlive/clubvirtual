var express = require('express');
var router = express.Router();
const blockchainController = require('../controllers/BlockchainController')
const transactionController = require('../controllers/TransactionController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//***************** get create wallet **************//
router.post('/Transfer-NFT',  blockchainController.transferNFT);

router.post('/Admin-transfer',  blockchainController.admintransfer);

router.post('/make-trx',  transactionController.makeTrx);

router.post('/make-sell-trx',  transactionController.sellTrx);

router.post('/ipfs-upload',  blockchainController.ipfsUpload);

router.post('/ipfs-upload-new',  blockchainController.ipfsUploadNew);

router.post('/ipfs-upload-attr',  blockchainController.ipfsUploadWithAttr);

router.post('/sign-trx',  blockchainController.signTrx);


module.exports = router;
