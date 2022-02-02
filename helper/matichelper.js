const web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common');
const matic_lazy = require('../contract/matic-lazy')
const matic_normal = require('../contract/matic-normal')
const auctionContract = require('../contract/matic-auction')

const web3js = new web3(
    new web3.providers.HttpProvider(
        // "https://rpc-mainnet.matic.network"
      "https://rpc-mumbai.maticvigil.com/"
    // "https://polygon-rpc.com/"
    //   "https://testnet.matic.network"
    )
);

const makeTransaction = async (data) => {
    try {

       console.log(data);
        const nonce = await web3js.eth.getTransactionCount(data.selectedAccount, 'latest');

        let contractAddress = "";
        let contractAbi = "";
        if (data.contract_type == "lazy") {
            contractAbi = matic_lazy.ABI;
            contractAddress = matic_lazy.contractAddress;
        }else{
            contractAbi = matic_normal.ABI;
            contractAddress = matic_normal.contractAddress;
        }
        let nftContract = new web3js.eth.Contract(contractAbi, contractAddress);

        let trData = "";
        let amt =  data.amount * 1000000000000000000;
        amt = amt.toFixed(0);
        amt = BigInt(amt).toString();

        let adminFee = data.adminFee * 10000000000;
        let royalty = data.royalty * 10000000000;
        royalty = royalty.toFixed(0);
        adminFee = adminFee.toFixed(0);

        if(data.functionName == "redeem"){
            let voucher = JSON.parse(data.voucher);
            let minPrice =  voucher.minPrice * 1000000000000000000;
            minPrice = minPrice.toFixed(0);
            minPrice = BigInt(minPrice).toString();

            voucher.minPrice = minPrice;
            
            trData = nftContract.methods.redeem(data.selectedAccount, voucher, data.nft_creator, data.admin, amt, data.adminFee).encodeABI();
        } else{
            trData = nftContract.methods.transferamount(data.nft_creator, data.admin, data.nft_owner, amt, adminFee,royalty).encodeABI();
        }

        let estimates_gas = await web3js.eth.estimateGas({
            'from': data.selectedAccount,
            'to': contractAddress,
            'value' : amt,
            'data' : trData
        });

        let gasLimit = web3js.utils.toHex(estimates_gas * 2);
        let gasPrice_bal = await web3js.eth.getGasPrice();
        let gasPrice = web3js.utils.toHex(gasPrice_bal * 2);

        
        // amt = data.amt * 1000000000000000000;
        // amt = amt.toFixed(0);
        // amt = BigInt(amt).toString();

        tx = {
            'from': data.selectedAccount,
            'to': contractAddress,
            'nonce': nonce,
            'gas': 500000,
            'gasPrice': gasPrice,
            'value': amt,
            'data' : trData,
        };

        return tx;
    } catch (e) {
        console.log(e);
        return null;
    }
}


const makeSellTransaction = async (data) => {
    try {
       console.log(data);
        const nonce = await web3js.eth.getTransactionCount(data.selectedAccount, 'latest');

        let contractAddress = "";
        let contractAbi = "";
        if (data.contract_type == "lazy") {
            contractAbi = matic_lazy.ABI;
            contractAddress = matic_lazy.contractAddress;
        }else{
            contractAbi = matic_normal.ABI;
            contractAddress = matic_normal.contractAddress;
        }
        let nftContract = new web3js.eth.Contract(contractAbi, contractAddress);

        let trData = nftContract.methods.transferFrom(data.selectedAccount, data.transferTo, data.tokenId).encodeABI();

        let estimates_gas = await web3js.eth.estimateGas({
            'from': data.selectedAccount,
            'to': contractAddress,
            'data' : trData
        });

        let gasLimit = web3js.utils.toHex(estimates_gas * 2);
        let gasPrice_bal = await web3js.eth.getGasPrice();
        let gasPrice = web3js.utils.toHex(gasPrice_bal * 2);

        
        // amt = data.amt * 1000000000000000000;
        // amt = amt.toFixed(0);
        // amt = BigInt(amt).toString();

        tx = {
            'from': data.selectedAccount,
            'to': contractAddress,
            'nonce': nonce,
            // 'gas': 500000,
            'gasPrice': gasPrice,
            'data' : trData,
        };

        return tx;
    } catch (e) {
        console.log(e);
        return null;
    }
}

const makeBidTransaction = async (data) => {
    try {
        console.log(data);
        const nonce = await web3js.eth.getTransactionCount(data.selectedAccount, 'latest');

        let contractAddress = auctionContract.contractAddress;
        let contractAbi = auctionContract.ABI;

        let nftContract = new web3js.eth.Contract(contractAbi, contractAddress);

        let amt = data.amount * 1000000000000000000;
        amt = amt.toFixed(0);
        amt = BigInt(amt).toString();
        let trData = nftContract.methods.makeBid(data.contractAddress, data.tokenId, data.erc20, "0").encodeABI();

        let estimates_gas = await web3js.eth.estimateGas({
            'from': data.selectedAccount,
            'to': contractAddress,
            'value': amt,
            'data': trData
        });

        let gasLimit = web3js.utils.toHex(estimates_gas * 2);
        let gasPrice_bal = await web3js.eth.getGasPrice();
        let gasPrice = web3js.utils.toHex(gasPrice_bal * 2);

        tx = {
            'from': data.selectedAccount,
            'to': contractAddress,
            'nonce': nonce,
            // 'gas': 500000,
            'gasPrice': gasPrice,
            'value': amt,
            'data': trData,
        };

        return tx;
    } catch (e) {
        console.log(e);
        return null;
    }
}

const makeSellAuctionTransaction = async (data) => {
    try {
        console.log(data);
        const nonce = await web3js.eth.getTransactionCount(data.selectedAccount, 'latest');

        let contractAddress = auctionContract.contractAddress;
        let contractAbi = auctionContract.ABI;
        let nftContract = new web3js.eth.Contract(contractAbi, contractAddress);

        let amt = data.amount * 1000000000000000000;
        amt = amt.toFixed(0);
        amt = BigInt(amt).toString();

        let trData = nftContract.methods.createNewNFTAuction(data.contractAddress, data.tokenId,data.erc20,amt,(data.royalty*100),(data.comission*100),data.auctionDuration,10*100,10).encodeABI();

        let estimates_gas = await web3js.eth.estimateGas({
            'from': data.selectedAccount,
            'to': contractAddress,
            'data': trData
        });

        let gasLimit = web3js.utils.toHex(estimates_gas * 2);
        let gasPrice_bal = await web3js.eth.getGasPrice();
        let gasPrice = web3js.utils.toHex(gasPrice_bal * 2);


        // amt = data.amt * 1000000000000000000;
        // amt = amt.toFixed(0);
        // amt = BigInt(amt).toString();

        tx = {
            'from': data.selectedAccount,
            'to': contractAddress,
            'nonce': nonce,
            // 'gas': 500000,
            'gasPrice': gasPrice,
            'data': trData,
        };

        return tx;
    } catch (e) {
        console.log(e);
        return null;
    }
}

const settleAuctionTrx = async (data) => {
    try {
        console.log(data);
        const nonce = await web3js.eth.getTransactionCount(data.selectedAccount, 'latest');

        let contractAddress = auctionContract.contractAddress;
        let contractAbi = auctionContract.ABI;
        let nftContract = new web3js.eth.Contract(contractAbi, contractAddress);

        let trData = nftContract.methods.settleAuction(data.contractAddress, data.tokenId).encodeABI();

        let estimates_gas = await web3js.eth.estimateGas({
            'from': data.selectedAccount,
            'to': contractAddress,
            'data': trData
        });

        let gasLimit = web3js.utils.toHex(estimates_gas * 2);
        let gasPrice_bal = await web3js.eth.getGasPrice();
        let gasPrice = web3js.utils.toHex(gasPrice_bal * 2);

        tx = {
            'from': data.selectedAccount,
            'to': contractAddress,
            'nonce': nonce,
            // 'gas': 500000,
            'gasPrice': gasPrice,
            'data': trData,
        };

        return tx;
    } catch (e) {
        console.log(e);
        return null;
    }
}

const getBidInfo = async (data) => {
    try {
        let Contract = new web3js.eth.Contract(auctionContract.ABI, auctionContract.contractAddress);

        let res = Contract.methods.nftContractAuctions(data.contractAddress, data.tokenId).call();
        return res;
    } catch (error) {
        console.log("errror", error);
        return null;
    }
}

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
    Adminmatictransfer,
    makeTransaction,
    makeSellTransaction,
    getBidInfo,
    makeBidTransaction,
    makeSellAuctionTransaction,
    settleAuctionTrx
}