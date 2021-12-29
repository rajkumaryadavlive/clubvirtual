const web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common');
const bsc_lazy = require('../contract/bsc-lazy') 
const bsc_normal = require('../contract/bsc-normal') 

const web3js = new web3(
    new web3.providers.HttpProvider(
      "https://data-seed-prebsc-1-s1.binance.org:8545/"
    // "https://bsc-dataseed1.binance.org:443"
    )
);

const BNBTransfer =  async (address_from, address_to, tokenid, contract_type, privatekey) => {
    let coinABI = "";
    let coinAddress = "";
    if(contract_type == "Lazy")
    {
       coinABI = bsc_lazy.ABI;
       coinAddress = bsc_lazy.contractAddress;
    }
    if(contract_type == "normal")
    {
        coinABI = bsc_normal.ABI;
       coinAddress = bsc_normal.contractAddress;
    }

    let tokenContract = new web3js.eth.Contract(coinABI, coinAddress);

    if(privatekey.length > 64){
        let num = privatekey.length - 64;
        privatekey = privatekey.slice(num);
    }
    const privateKey = Buffer.from(privatekey, 'hex');

    let estimates_gas = await web3js.eth.estimateGas({
        from: address_from,
        to: address_to,
        data: tokenContract.methods.transferFrom(address_from, address_to, tokenid).encodeABI(),
    });

    let gasLimit = web3js.utils.toHex(estimates_gas * 2);
    let gasPrice_bal = await web3js.eth.getGasPrice();
    let gasPrice = web3js.utils.toHex(gasPrice_bal * 2);
    let v = await web3js.eth.getTransactionCount(address_from)

    let rawTransaction = {
        "from": address_from,
        // "chainId" : web3js.utils.toHex('1221'),
        "gasPrice": gasPrice,
        "gasLimit": gasLimit,
        "to": coinAddress,
        // "value": "0x0",
        "data": tokenContract.methods.transferFrom(address_from, address_to, tokenid).encodeABI(),
        "nonce": web3js.utils.toHex(v)
    }
    const common = Common.default.forCustomChain('mainnet', {
        name: 'bnb',
        networkId: 97,
        chainId: 97
    }, 'petersburg');
    let transaction = new Tx(rawTransaction, { common });
    transaction.sign(privateKey);
    let hash = web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
    return hash;
}

const CoinTransfer =  async (receiver_address, amount, sender_address, sender_private_key) => {
    let tokenContract = new web3js.eth.Contract(coinABI, coinAddress);

    if(sender_private_key.length > 64){
        let num = sender_private_key.length - 64;
        sender_private_key = sender_private_key.slice(num);
    }
    const privateKey = Buffer.from(sender_private_key, 'hex');
        
    let estimates_gas = await web3js.eth.estimateGas({
        from: sender_address,
        to: receiver_address,
        amount: web3js.utils.toWei(amount, "ether"),
    });
    let gasLimit = web3js.utils.toHex(estimates_gas * 3);
    let gasPrice_bal = await web3js.eth.getGasPrice();
    let gasPrice = web3js.utils.toHex(gasPrice_bal * 2);
    let count = await web3js.eth.getTransactionCount(sender_address);
    let sendAmount = amount * Math.pow(10, 10);
    sendAmount = sendAmount.toString();

    let rawTransaction = {
        "from": Sender_address,
        "chainId" : web3js.utils.toHex('1221'),
        "gasPrice": gasPrice,
        "gasLimit": gasLimit,
        "to": contractAddress,
        "value": "0x0",
        "data": tokenContract.methods.transferFrom(address_from, address_to, tokenid).encodeABI(),
        "nonce": web3js.utils.toHex(v)
        
    }

    const common = Common.default.forCustomChain('mainnet', {
        name: 'bnb',
        networkId: 56,
        chainId: 56
    }, 'petersburg');

    let transaction = new Tx(rawTransaction, { common });
    transaction.sign(privateKey);
    let hash = web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
    return hash;
}

const AdminCoinTransfer =  async (address_from, privatekey, address_to, amount) => {


    let sender_address = address_from;
    let sender_private_key = privatekey;
    const privateKey = Buffer.from(sender_private_key, 'hex');
    
    amount = parseFloat(amount)

    let estimates_gas = await web3js.eth.estimateGas({
        from: sender_address,
        to: address_to,
        amount: web3js.utils.toWei(amount, "ether"),
    });


    let gasLimit = web3js.utils.toHex(estimates_gas * 3);
    let gasPrice_bal = await web3js.eth.getGasPrice();
    let gasPrice = web3js.utils.toHex(gasPrice_bal * 2);
    let count = await web3js.eth.getTransactionCount(sender_address);

    let sendAmount = amount * Math.pow(10, 18);
    sendAmount = sendAmount.toString();

    let rawTransaction = {
        "from": sender_address,
        "gasPrice": gasPrice,
        "gasLimit": gasLimit,
        "to": address_to,
        "value": web3js.utils.toHex(sendAmount),
        "nonce": web3js.utils.toHex(count)
    };

    const common = Common.default.forCustomChain('mainnet', {
        name: 'bnb',
        networkId: 97,
        chainId: 97
    }, 'petersburg');
    let transaction = new Tx(rawTransaction, { common });
    transaction.sign(privateKey);
    let hash = web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
    return hash;
}

const hashStatus = async (hash) => {
    let status = await web3js.eth.getTransactionReceipt(hash);
    if(status){
        return status.blockNumber;
    }
}

const balanceMainBNB = async (account) => {
    let balance = await web3js.eth.getBalance(account);
    if(balance){
        balance = balance / Math.pow(10,18);
        return balance;
    }
};

const coinBalanceBNB = async (account) => {
    let tokenContract = new web3js.eth.Contract(coinABI, coinAddress);
    let balance;
    try {
        balance = await tokenContract.methods.balanceOf(account).call();
        balance = parseFloat(balance) / Math.pow(10,10);
    } catch (error) {
        balance = 0;
    }
    return balance;
};

const createWalletHelper = async () => {
    let newData = await web3js.eth.accounts.create();
    if(newData){
        return newData.privateKey;
    }
};

const checkWalletPrivateHelper = async (pk) => {
    let newData = await web3js.eth.accounts.privateKeyToAccount(pk);
    if(newData){
        return newData.address;
    }
};

module.exports = {
    BNBTransfer,
    CoinTransfer,
    AdminCoinTransfer,
    hashStatus,
    balanceMainBNB,
    coinBalanceBNB,
    createWalletHelper,
    checkWalletPrivateHelper
}