const web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const eth_lazy = require('../contract/eth-lazy')
const eth_normal = require('../contract/eth-normal')
const lazy_1155 = require('../contract/1155/eth-lazy')
const normal_1155 = require('../contract/1155/eth-normal')
const auctionContract = require('../contract/eth-auction')
var axios = require('axios');



const web3js = new web3(
    new web3.providers.HttpProvider(
        //   "https://mainnet.infura.io/v3/8ee6b6fda80f40c3826c75ff9afa3d05"
        // "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
        "https://mainnet.infura.io/v3/a07044e72bae444c8a07f2f454904ab5"
        
    )
);

const makeTransaction = async (data) => {
    try {

        // console.log(data);
        const nonce = await web3js.eth.getTransactionCount(data.selectedAccount, 'latest');

        let contractAddress = "";
        let contractAbi = "";
        if (data.standard == "721") {
            if (data.contract_type == "lazy") {
                contractAbi = eth_lazy.ABI;
                contractAddress = eth_lazy.contractAddress;
            } else {
                contractAbi = eth_normal.ABI;
                contractAddress = eth_normal.contractAddress;
            }
        } else {
            if (data.contract_type == "lazy") {
                contractAbi = lazy_1155.ABI;
                contractAddress = lazy_1155.contractAddress;
            } else {
                contractAbi = normal_1155.ABI;
                contractAddress = normal_1155.contractAddress;
            }
        }
        console.log(contractAddress);
        let nftContract = new web3js.eth.Contract(contractAbi, contractAddress);

        let trData = "";
        let amt = data.amount * 1000000000000000000;
        amt = amt.toFixed(0);
        amt = BigInt(amt).toString();

        let adminFee = data.adminFee * 10000000000;
        let royalty = data.royalty * 10000000000;
        royalty = royalty.toFixed(0);
        adminFee = adminFee.toFixed(0);
        // adminFee = BigInt(adminFee).toString();

        if (data.functionName == "redeem") {
            let voucher = JSON.parse(data.voucher);
            let minPrice = voucher.minPrice * 1000000000000000000;
            minPrice = minPrice.toFixed(0);
            minPrice = BigInt(minPrice).toString();

            voucher.minPrice = minPrice;

            trData = nftContract.methods.redeem(data.selectedAccount, voucher, data.nft_creator, data.admin, amt, data.adminFee).encodeABI();
        } else {
            trData = nftContract.methods.transferamount(data.nft_creator, data.admin, data.nft_owner, amt, adminFee, royalty).encodeABI();
        }

        let estimates_gas = await web3js.eth.estimateGas({
            'from': data.selectedAccount,
            'to': contractAddress,
            'value': amt,
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
            'value': amt,
            'data': trData,
        };

        return tx;
    } catch (e) {
        console.log(e);
        return null;
    }
}

const makeBatchTransaction = async (data) => {
    try {

        // console.log(data);
        const nonce = await web3js.eth.getTransactionCount(data.selectedAccount, 'latest');

        let contractAddress = auctionContract.contractAddress;
        let contractAbi = auctionContract.ABI;

        let nftContract = new web3js.eth.Contract(contractAbi, contractAddress);

        let trData = "";
        let amt = data.amount * 1000000000000000000;
        amt = amt.toFixed(0);
        amt = BigInt(amt).toString();

        let adminFee = data.adminFee * 100;
        adminFee = adminFee.toFixed(0);
        // adminFee = BigInt(adminFee).toString();
        trData = nftContract.methods.buyNFT(data.nft_contract_address, data.token_id, adminFee).encodeABI();

        let estimates_gas = await web3js.eth.estimateGas({
            'from': data.selectedAccount,
            'to': contractAddress,
            'value': amt,
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
            'value': amt,
            'data': trData,
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
        if (data.standard == "721") {
            if (data.contract_type == "lazy") {
                contractAbi = eth_lazy.ABI;
                contractAddress = eth_lazy.contractAddress;
            } else {
                contractAbi = eth_normal.ABI;
                contractAddress = eth_normal.contractAddress;
            }
        } else {
            if (data.contract_type == "lazy") {
                contractAbi = lazy_1155.ABI;
                contractAddress = lazy_1155.contractAddress;
            } else {
                contractAbi = normal_1155.ABI;
                contractAddress = normal_1155.contractAddress;
            }
        }
        let nftContract = new web3js.eth.Contract(contractAbi, contractAddress);

        let trData = "";
        if (data.standard == "721") {
            trData = nftContract.methods.transferFrom(data.selectedAccount, data.transferTo, data.tokenId).encodeABI();
        } else {
            trData = nftContract.methods.transferFrom(data.selectedAccount, data.transferTo, data.tokenId, 1).encodeABI();
        }


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

        let trData = nftContract.methods.createNewNFTAuction(data.contractAddress, data.tokenId, data.erc20, amt, (data.royalty * 100), (data.comission * 100), data.auctionDuration, 10 * 100, data.startTime).encodeABI();

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
        let trData = nftContract.methods.makeBid(data.contractAddress, data.tokenId, data.erc20, 0).encodeABI();

        let estimates_gas = await web3js.eth.estimateGas({
            'from': data.selectedAccount,
            'to': contractAddress,
            'value': amt,
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
            'value': amt,
            'data': trData,
        };

        return tx;
    } catch (e) {
        console.log(e);
        return null;
    }
}

const getBidInfo = async (data) => {
    console.log(data);
    try {
        let Contract = new web3js.eth.Contract(auctionContract.ABI, auctionContract.contractAddress);

        let res = Contract.methods.nftContractAuctions(data.contractAddress, data.tokenId).call();
        return res;
    } catch (error) {
        console.log("errror", error);
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
const transferNftToOwner = async (data) => {
    let contractAbi = "";
    let contractAddress = data.contractAddress;
    let apiUrl = process.env.API_URL + "get-abi";
    
    let result = await axios.post(apiUrl, {
        blockchain: 'ETH',
        address: data.contractAddress
    });

    if (result.data.status != 1) {
        res.send('0')
    }

    let nft_standard = result.data.data.standard;

    contractAbi = result.data.data.contract_abi;

    contractAbi = JSON.parse(contractAbi);

    let privatekey = data.adminKey;
    
    let nftContract = new web3js.eth.Contract(contractAbi, contractAddress);
    if (privatekey.length > 64) {
        let num = privatekey.length - 64;
        privatekey = privatekey.slice(num);
    }
    const adminKey = Buffer.from(privatekey, 'hex');

    let trData ="";
    if(nft_standard == "1155"){
        let readContract = await nftContract.methods.balanceOf( data.adminAddress,data.tokenId).call();
        
        trData = nftContract.methods.transferFrom(data.adminAddress, data.selectedAccount, data.tokenId,readContract).encodeABI();
    } else{
        trData = nftContract.methods.transferFrom(data.adminAddress, data.selectedAccount, data.tokenId).encodeABI();
    }
    
    // let estimates_gas = await web3js.eth.estimateGas({
    //     'from': data.adminAddress,
    //     'to': contractAddress,
    //     'data': trData
    // });

    let gasPrice_bal = await web3js.eth.getGasPrice();
    let gasPrice = web3js.utils.toHex(gasPrice_bal * 4);
    let v = await web3js.eth.getTransactionCount(data.adminAddress)

    let rawTransaction = {
        "from": data.adminAddress,
        // "chainId" : web3js.utils.toHex('1221'),
        "gasPrice": gasPrice,
        // "gasLimit": gasLimit,
        'gas': 5000000,
        "to": contractAddress,
        "data": trData,
        "nonce": web3js.utils.toHex(v)

    }

    let transaction = new Tx(rawTransaction, { chain: 'ropsten' });
    transaction.sign(adminKey);
    let hash = web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
    return hash;

}
const transferToAdmin = async (data) => {
    let contractAbi = "";
    let contractAddress = data.contractAddress;
    let apiUrl = process.env.API_URL + "get-abi";
    let result = await axios.post(apiUrl, {
        blockchain: 'ETH',
        address: data.contractAddress
    });

    if (result.data.status != 1) {
        res.send('0')
    }

    contractAbi = result.data.data.contract_abi;

    contractAbi = JSON.parse(contractAbi);

    let nftContract = new web3js.eth.Contract(contractAbi, contractAddress);
    let trData = null;
    if(data.standard == "1155"){
        let readContract = await nftContract.methods.balanceOf( data.selectedAccount,data.tokenId).call();
        
        trData = nftContract.methods.transferFrom(data.selectedAccount, data.adminAddress, data.tokenId,readContract).encodeABI();
    } else{
        trData = nftContract.methods.transferFrom(data.selectedAccount, data.adminAddress, data.tokenId).encodeABI();
    }
    // let estimates_gas = await web3js.eth.estimateGas({
    //     'from': data.adminAddress,
    //     'to': contractAddress,
    //     'data': trData
    // });

    let gasPrice_bal = await web3js.eth.getGasPrice();
    let gasPrice = web3js.utils.toHex(gasPrice_bal * 4);
    let v = await web3js.eth.getTransactionCount(data.adminAddress)

    let rawTransaction = {
        "from": data.selectedAccount,
        // "chainId" : web3js.utils.toHex('1221'),
        "gasPrice": gasPrice,
        // "gasLimit": gasLimit,
        'gas': 5000000,
        "to": contractAddress,
        "data": trData,
        "nonce": web3js.utils.toHex(v)

    }

    return rawTransaction;

}
const removeFromAuction = async (data) => {
    const nonce = await web3js.eth.getTransactionCount(data.selectedAccount, 'latest');

    let contractAddress = auctionContract.contractAddress;
    let contractAbi = auctionContract.ABI;
    let nftContract = new web3js.eth.Contract(contractAbi, contractAddress);

    let trData = nftContract.methods.withdrawAuction(data.nftContract, data.tokenId).encodeABI();

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
}

const ETHTransfer = async (address_from, address_to, tokenid, contract_type, privatekey, standard) => {
    try {
        let coinABI = "";
        let coinAddress = "";
        if (standard == "721") {
            if (contract_type == "lazy") {
                coinABI = eth_lazy.ABI;
                coinAddress = eth_lazy.contractAddress;
            }
            if (contract_type == "normal") {
                coinABI = eth_normal.ABI;
                coinAddress = eth_normal.contractAddress;
            }
        } else {
            if (contract_type == "lazy") {
                coinABI = lazy_1155.ABI;
                coinAddress = lazy_1155.contractAddress;
            }
            if (contract_type == "normal") {
                coinABI = normal_1155.ABI;
                coinAddress = normal_1155.contractAddress;
            }
        }

        let tokenContract = new web3js.eth.Contract(coinABI, coinAddress);

        if (privatekey.length > 64) {
            let num = privatekey.length - 64;
            privatekey = privatekey.slice(num);
        }
        const privateKey = Buffer.from(privatekey, 'hex');
        console.log("privateKey", privateKey);

        let trData = "";
        if (standard == "721") {
            trData = tokenContract.methods.transferFrom(address_from, address_to, tokenid).encodeABI();
        } else {
            trData = tokenContract.methods.transferFrom(address_from, address_to, tokenid, 1).encodeABI();
        }
        let estimates_gas = await web3js.eth.estimateGas({
            from: address_from,
            to: address_to,
            data: trData
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
            "data": trData,
            "nonce": web3js.utils.toHex(v)

        }

        let transaction = new Tx(rawTransaction, { chain: 'ropsten' });
        transaction.sign(privateKey);
        let hash = web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
        return hash;
    }
    catch (error) {
        console.log("error", error)
        return null;
    }
}

const Admintransfer = async (address_from, privatekey, address_to, amount) => {
    try {
        let sender_address = address_from;
        let sender_private_key = privatekey;
        const privateKey = Buffer.from(sender_private_key, 'hex');

        // amount = parseFloat(amount)

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

        var transaction = new Tx(rawTransaction, { chain: 'ropsten' });
        transaction.sign(privateKey);
        let hash = web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
        return hash;
    }
    catch (error) {
        console.log("error", error)
    }
}

// const ETHCoinTransfer =  async (receiver_address, amount, sender_address, sender_private_key) => {
//     if(sender_private_key.length > 64){
//         let num = sender_private_key.length - 64;
//         sender_private_key = sender_private_key.slice(num);
//     }
//     const privateKey = Buffer.from(sender_private_key, 'hex');
//     let tokenContract = new web3js.eth.Contract(coinABI, coinAddress);
//     let estimates_gas = await web3js.eth.estimateGas({
//         from: sender_address,
//         to: receiver_address,
//         amount: web3js.utils.toWei(amount, "ether"),
//     });
//     let gasLimit = web3js.utils.toHex(estimates_gas * 2);
//     let gasPrice_bal = await web3js.eth.getGasPrice();
//     let gasPrice = web3js.utils.toHex(gasPrice_bal * 2);
//     let count = await web3js.eth.getTransactionCount(sender_address);
//     let sendAmount = amount * Math.pow(10, 10);
//     sendAmount = sendAmount.toString();
//     let rawTransaction = {
//         "from": sender_address,
//         "gasPrice": gasPrice,
//         "gasLimit": gasLimit,
//         "to": coinAddress,
//         "data": tokenContract.methods.transfer(receiver_address, sendAmount).encodeABI(),
//         "nonce": web3js.utils.toHex(count)
//     };
//     let transaction = new Tx(rawTransaction,{ chain: 'mainnet' });
//     transaction.sign(privateKey);
//     let hash = web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
//     return hash;
// }

const hashStatusETH = async (hash) => {
    let status = await web3js.eth.getTransactionReceipt(hash);
    if (status) {
        return status.blockNumber;
    }
}

const balanceMainETH = async (account) => {
    let balance = await web3js.eth.getBalance(account);
    if (balance) {
        balance = balance / Math.pow(10, 18);
        return balance;
    }
};

// const coinBalanceETH = async (account) => {
//     let tokenContract = new web3js.eth.Contract(coinABI, coinAddress);
//     let balance;
//     try {
//         balance = await tokenContract.methods.balanceOf(account).call();
//         balance = parseFloat(balance) / Math.pow(10,18);
//     } catch (error) {
//         balance = 0;
//     }
//     return balance;
// };

module.exports = {
    ETHTransfer,
    // ETHCoinTransfer,
    hashStatusETH,
    balanceMainETH,
    // coinBalanceETH,
    Admintransfer,
    makeTransaction,
    makeSellTransaction,
    makeSellAuctionTransaction,
    getBidInfo,
    makeBidTransaction,
    settleAuctionTrx,
    makeBatchTransaction,
    transferNftToOwner,
    removeFromAuction,
    transferToAdmin
}