const web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common');
const matic_lazy = require('../contract/matic-lazy')
const matic_normal = require('../contract/matic-normal')

const web3js = new web3(
    new web3.providers.HttpProvider(
      "https://rpc-mumbai.maticvigil.com/"
    //   "https://testnet.matic.network"
    )
);

const maticTransfer =  async (address_from, address_to, tokenid, contract_type, privatekey) => {
    let coinABI = "";
    let coinAddress = "";
    if(contract_type == "lazy")
    {
       coinABI = matic_lazy.ABI;
       coinAddress = matic_lazy.contractAddress;
    }
    if(contract_type == "normal")
    {
        coinABI = matic_normal.ABI;
       coinAddress = matic_normal.contractAddress;
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
    console.log("estimates_gas", estimates_gas);

    let gasLimit = web3js.utils.toHex(estimates_gas * 4);
    let gasPrice_bal = await web3js.eth.getGasPrice();
    let gasPrice = web3js.utils.toHex(gasPrice_bal * 4);
    let v = await web3js.eth.getTransactionCount(address_from)

    let rawTransaction = {
        "from": address_from,
        // "chainId" : web3js.utils.toHex('1221'),
        "gasPrice": gasPrice,
        // "gasLimit": gasLimit,
        'gas': 5000000,
        "to": coinAddress,
        "data": tokenContract.methods.transferFrom(address_from, address_to, tokenid).encodeABI(),
        "nonce": web3js.utils.toHex(v)
    }
    
    // let transaction = new Tx(rawTransaction, { chain:'ropsten' });
    let transaction = new Tx(rawTransaction, { chain:'80001' });
    transaction.sign(privateKey);
    let hash = web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
    return hash;
}


const Adminmatictransfer =  async (address_from, privatekey, address_to, amount) => {
    try 
    {
        let sender_address = address_from;
        let sender_private_key = privatekey;
        const privateKey = Buffer.from(sender_private_key, 'hex');
        
        console.log("matic sender_address", sender_address, "privateKey", privateKey);
        // amount = parseFloat(amount)

        let estimates_gas = await web3js.eth.estimateGas({
            from: sender_address,
            to: address_to,
            amount: web3js.utils.toWei(amount, "ether"),
        });

        console.log("estimates_gas", estimates_gas);

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

        console.log("rawTransaction", rawTransaction);
        
        const common = Common.default.forCustomChain('mainnet', {
            name: 'Matic',
            networkId: 80001,
            chainId: 80001
        }, 'petersburg');
        let transaction = new Tx(rawTransaction, { common });
        transaction.sign(privateKey);
        let hash = web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
        return hash;
           
    }
    catch (error)
    {
        console.log("error", error)
    }
}

module.exports = {
    maticTransfer,
    Adminmatictransfer
}