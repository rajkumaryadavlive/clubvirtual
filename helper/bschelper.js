const web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common');
const bsc_lazy = require('../contract/bsc-lazy')
const bsc_normal = require('../contract/bsc-normal')
const lazy_1155 = require('../contract/1155/bsc-lazy')
const normal_1155 = require('../contract/1155/bsc-normal')
var axios = require('axios');

const auctionContract = require('../contract/bsc-auction')

const web3js = new web3(
    new web3.providers.HttpProvider(
        "https://bsc-dataseed.binance.org/"
        // "https://data-seed-prebsc-1-s1.binance.org:8545"
        // "https://bsc-dataseed1.binance.org:443"
    )
);

const makeTransaction = async (data) => {
    try {

        console.log(data);
        let apiUrl = process.env.API_URL + "get-abi";

        let rpcurl = "";
        let contractAddress = "";
        let contractAbi = "";
        if (data.functionName == "redeem") {
            let result = await axios.post(apiUrl, {
                blockchain: data.currency,
                address: data.nft_contract_address,
            });

            if (result.data.status != 1) {
                res.send('0')
            }
            contractAbi = result.data.data.contract_abi;

            contractAbi = JSON.parse(contractAbi);
            contractAddress = result.data.data.contract_address;
            rpcurl = result.data.data.rpc_url;
        } else {
            let result = await axios.post(apiUrl, {
                blockchain: data.currency,
                type: 'auction'
            });
            if (result.data.status != 1) {
                res.send('0')
            }

            // console.log(result.data);
            contractAbi = result.data.data.abi;

            contractAbi = JSON.parse(contractAbi);
            contractAddress = result.data.data.address;
            rpcurl = result.data.rpc_url;

        }

        newweb3js = new web3(
            new web3.providers.HttpProvider(rpcurl)
        );

        const nonce = await newweb3js.eth.getTransactionCount(data.selectedAccount, 'latest');

        let nftContract = new newweb3js.eth.Contract(contractAbi, contractAddress);

        let trData = "";
        
        let amt = data.amount * 1e18;
        // amt = amt.toFixed(0); 
        console.log(amt);
        amt = BigInt(amt).toString();

        let adminFee = data.adminFee * 100;
        let royalty = data.royalty * 10000000000;
        royalty = royalty.toFixed(0);
        adminFee = adminFee.toFixed(0);

        console.log(amt);
        if (data.functionName == "redeem") {
            let voucher = JSON.parse(data.voucher);
            let minPrice = voucher.minPrice * 1000000000000000000;
            minPrice = minPrice.toFixed(0);
            minPrice = BigInt(minPrice).toString();

            voucher.minPrice = minPrice;

            trData = nftContract.methods.redeem(data.selectedAccount, voucher, data.nft_creator, data.admin, amt, adminFee, (data.royalty * 100),(data.platform_fee * 100)).encodeABI();
        } else if (data.standard == "1155" && data.is_offer == "yes") {
            trData = nftContract.methods.buyFromProposalERC1155(data.token_id).encodeABI();
        } else if (data.standard == "1155") {
            trData = nftContract.methods.buyERC1155NFT(data.token_id).encodeABI();
        } else if (data.is_offer == "yes") {
            trData = nftContract.methods.buyFromProposal(data.nft_contract_address, data.token_id).encodeABI();
        } else {
            trData = nftContract.methods.buyNFT(data.nft_contract_address, data.token_id).encodeABI();
            // trData = nftContract.methods.transferamount(data.nft_creator, data.admin, data.nft_owner, amt, adminFee, royalty).encodeABI();
        }

        // let estimates_gas = await newweb3js.eth.estimateGas({
        //     'from': data.selectedAccount,
        //     'to': contractAddress,
        //     'value': amt,
        //     'data': trData
        // });

        // let gasLimit = newweb3jsz.utils.toHex(estimates_gas * 2);
        let gasPrice_bal = await newweb3js.eth.getGasPrice();
        let gasPrice = newweb3js.utils.toHex(gasPrice_bal * 2);


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

const makeProposal = async (data) => {
    try {

        console.log(data);
        let apiUrl = process.env.API_URL + "get-abi";

        let rpcurl = "";
        let contractAddress = "";
        let contractAbi = "";

        let result = await axios.post(apiUrl, {
            blockchain: data.currency,
            type: 'auction'
        });
        if (result.data.status != 1) {
            res.send('0')
        }

        contractAbi = result.data.data.abi;

        contractAbi = JSON.parse(contractAbi);
        contractAddress = result.data.data.address;
        rpcurl = result.data.rpc_url;

        newweb3js = new web3(
            new web3.providers.HttpProvider(rpcurl)
        );

        const nonce = await newweb3js.eth.getTransactionCount(data.selectedAccount, 'latest');

        let nftContract = new newweb3js.eth.Contract(contractAbi, contractAddress);

        let trData = "";
        let amt = data.amount * 1000000000000000000;
        amt = amt.toFixed(0);
        amt = BigInt(amt).toString();
        
        trData = nftContract.methods.acceptBuyProposal(data.contractAddress, data.tokenId, amt, data.buyerAccount).encodeABI();

        // let gasLimit = newweb3jsz.utils.toHex(estimates_gas * 2);
        let gasPrice_bal = await newweb3js.eth.getGasPrice();
        let gasPrice = newweb3js.utils.toHex(gasPrice_bal * 2);


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

        let apiUrl = process.env.API_URL + "get-abi";

        let rpcurl = "";
        let contractAddress = "";
        let contractAbi = "";

        let result = await axios.post(apiUrl, {
            blockchain: data.currency,
            type: 'auction'
        });
        if (result.data.status != 1) {
            res.send('0')
        }

        contractAbi = result.data.data.abi;

        contractAbi = JSON.parse(contractAbi);
        contractAddress = result.data.data.address;
        rpcurl = result.data.rpc_url;

        let newweb3js = new web3(
            new web3.providers.HttpProvider(rpcurl)
        );

        let amt = data.amount * 1000000000000000000;
        amt = amt.toFixed(0);
        amt = BigInt(amt).toString();

        console.log(amt);

        const nonce = await newweb3js.eth.getTransactionCount(data.selectedAccount, 'latest');

        let nftContract = new newweb3js.eth.Contract(contractAbi, contractAddress);

        let trData = "";

        if (data.standard == "1155") {
            trData = nftContract.methods.createResaleERC1155(data.tokenId,'1',amt, "0x0000000000000000000000000000000000000000", (data.comission * 100), (data.platformFee * 100),(data.royalty * 100)).encodeABI();
        } else if (data.type == "switch") {
            trData = nftContract.methods.switchAuctionToSale(data.contractAddress, data.tokenId, "0x0000000000000000000000000000000000000000", (data.comission * 100), (data.platformFee * 100), amt, (data.royalty * 100)).encodeABI();
        } else {
            trData = nftContract.methods.createResale(data.contractAddress, data.tokenId, "0x0000000000000000000000000000000000000000", (data.comission * 100), (data.platformFee * 100), amt, (data.royalty * 100)).encodeABI();
        }

        let estimates_gas = await newweb3js.eth.estimateGas({
            'from': data.selectedAccount,
            'to': contractAddress,
            'data': trData
        });

        let gasLimit = newweb3js.utils.toHex(estimates_gas * 2);
        let gasPrice_bal = await newweb3js.eth.getGasPrice();
        let gasPrice = newweb3js.utils.toHex(gasPrice_bal * 2);


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

const removeSale = async (data) => {
    try {
        let apiUrl = process.env.API_URL + "get-abi";

        let rpcurl = "";
        let contractAddress = "";
        let contractAbi = "";

        let result = await axios.post(apiUrl, {
            blockchain: data.currency,
            type: 'auction'
        });
        if (result.data.status != 1) {
            res.send('0')
        }

        contractAbi = result.data.data.abi;

        contractAbi = JSON.parse(contractAbi);
        contractAddress = result.data.data.address;
        rpcurl = result.data.rpc_url;

        let newweb3js = new web3(
            new web3.providers.HttpProvider(rpcurl)
        );

        const nonce = await newweb3js.eth.getTransactionCount(data.selectedAccount, 'latest');

        let nftContract = new newweb3js.eth.Contract(contractAbi, contractAddress);

        let trData = "";
        
        if(data.standard == "1155"){
            trData = nftContract.methods.withdrawERC1155Sale(data.tokenId).encodeABI();
        } else{
            trData = nftContract.methods.withdrawSale(data.contractAddress, data.tokenId).encodeABI();
        }

        let estimates_gas = await newweb3js.eth.estimateGas({
            'from': data.selectedAccount,
            'to': contractAddress,
            'data': trData
        });

        let gasLimit = newweb3js.utils.toHex(estimates_gas * 2);
        let gasPrice_bal = await newweb3js.eth.getGasPrice();
        let gasPrice = newweb3js.utils.toHex(gasPrice_bal * 2);

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
        let apiUrl = process.env.API_URL + "get-abi";

        let rpcurl = "";
        let contractAddress = "";
        let contractAbi = "";

        let result = await axios.post(apiUrl, {
            blockchain: data.currency,
            type: 'auction'
        });
        if (result.data.status != 1) {
            res.send('0')
        }

        contractAbi = result.data.data.abi;

        contractAbi = JSON.parse(contractAbi);
        contractAddress = result.data.data.address;
        rpcurl = result.data.rpc_url;

        let newweb3js = new web3(
            new web3.providers.HttpProvider(rpcurl)
        );

        const nonce = await newweb3js.eth.getTransactionCount(data.selectedAccount, 'latest');

        let nftContract = new newweb3js.eth.Contract(contractAbi, contractAddress);

        let amt = data.amount * 1000000000000000000;
        amt = amt.toFixed(0);
        amt = BigInt(amt).toString();

        let trData = "";
        if (data.type == "switch") {
            trData = nftContract.methods.switchSaleToAuction(data.contractAddress, data.tokenId, data.erc20, amt, (data.royalty * 100), (data.comission * 100), (data.platformFee * 100), data.auctionDuration, 10, data.startTime).encodeABI();
        } else {
            trData = nftContract.methods.createNewNFTAuction(data.contractAddress, data.tokenId, data.erc20, amt, (data.royalty * 100), (data.comission * 100), (data.platformFee * 100), data.auctionDuration, 10, data.startTime, "ftfffh").encodeABI();
        }
        // console.log("RUN");
        let estimates_gas = await newweb3js.eth.estimateGas({
            'from': data.selectedAccount,
            'to': contractAddress,
            'data': trData
        });

        let gasLimit = newweb3js.utils.toHex(estimates_gas * 2);
        let gasPrice_bal = await newweb3js.eth.getGasPrice();
        let gasPrice = newweb3js.utils.toHex(gasPrice_bal * 2);


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
        let apiUrl = process.env.API_URL + "get-abi";

        let rpcurl = "";
        let contractAddress = "";
        let contractAbi = "";

        let result = await axios.post(apiUrl, {
            blockchain: data.currency,
            type: 'auction'
        });
        if (result.data.status != 1) {
            res.send('0')
        }

        contractAbi = result.data.data.abi;

        contractAbi = JSON.parse(contractAbi);
        contractAddress = result.data.data.address;
        rpcurl = result.data.rpc_url;

        let web3Obj = new web3(
            new web3.providers.HttpProvider(rpcurl)
        );

        const nonce = await web3Obj.eth.getTransactionCount(data.selectedAccount, 'latest');

        let nftContract = new web3Obj.eth.Contract(contractAbi, contractAddress);

        let amt = data.amount * 1000000000000000000;
        amt = amt.toFixed(0);
        amt = BigInt(amt).toString();
        let trData = nftContract.methods.makeBid(data.contractAddress, data.tokenId, data.erc20, "0").encodeABI();

        let estimates_gas = await web3Obj.eth.estimateGas({
            'from': data.selectedAccount,
            'to': contractAddress,
            'value': amt,
            'data': trData
        });

        let gasLimit = web3Obj.utils.toHex(estimates_gas * 2);
        let gasPrice_bal = await web3Obj.eth.getGasPrice();
        let gasPrice = web3Obj.utils.toHex(gasPrice_bal * 2);

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

    try {
        // console.log(data);
        let apiUrl = process.env.API_URL + "get-abi";

        let rpcurl = "";
        let contractAddress = "";
        let contractAbi = "";

        let result = await axios.post(apiUrl, {
            blockchain: data.currency,
            type: 'auction'
        });
        if (result.data.status != 1) {
            res.send('0')
        }

        contractAbi = result.data.data.abi;

        contractAbi = JSON.parse(contractAbi);
        contractAddress = result.data.data.address;
        rpcurl = result.data.rpc_url;

        let web3Obj = new web3(
            new web3.providers.HttpProvider(rpcurl)
        );

        let Contract = new web3Obj.eth.Contract(contractAbi, contractAddress);

        let res = Contract.methods.nftContractAuctions(data.contractAddress, data.tokenId).call();
        return res;
    } catch (error) {
        console.log("error", error);
        return null;
    }
}

const settleAuctionTrx = async (data) => {
    try {

        let apiUrl = process.env.API_URL + "get-abi";

        let rpcurl = "";
        let contractAddress = "";
        let contractAbi = "";

        let result = await axios.post(apiUrl, {
            blockchain: data.currency,
            type: 'auction'
        });
        if (result.data.status != 1) {
            res.send('0')
        }

        contractAbi = result.data.data.abi;
        
        contractAbi = JSON.parse(contractAbi);
        contractAddress = result.data.data.address;
        rpcurl = result.data.rpc_url;

        let web3Obj = new web3(
            new web3.providers.HttpProvider(rpcurl)
        );

        const nonce = await web3Obj.eth.getTransactionCount(data.selectedAccount, 'latest');

        let nftContract = new web3Obj.eth.Contract(contractAbi, contractAddress);

        let trData = nftContract.methods.settleAuction(data.contractAddress, data.tokenId).encodeABI();

        let estimates_gas = await web3Obj.eth.estimateGas({
            'from': data.selectedAccount,
            'to': contractAddress,
            'data': trData
        });

        let gasLimit = web3Obj.utils.toHex(estimates_gas * 2);
        let gasPrice_bal = await web3Obj.eth.getGasPrice();
        let gasPrice = web3Obj.utils.toHex(gasPrice_bal * 2);

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
        blockchain: 'BNB',
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
    let trData = "";
    if (nft_standard == "1155") {
        let readContract = await nftContract.methods.balanceOf(data.adminAddress, data.tokenId).call();

        trData = nftContract.methods.transferFrom(data.adminAddress, data.selectedAccount, data.tokenId, readContract).encodeABI();
    } else {
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

    const common = Common.default.forCustomChain('mainnet', {
        name: 'bnb',
        networkId: 97,
        chainId: 97
    }, 'petersburg');
    let transaction = new Tx(rawTransaction, { common });
    transaction.sign(adminKey);
    let hash = web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
    return hash;

}

const transferToAdmin = async (data) => {
    let contractAbi = "";
    let contractAddress = data.contractAddress;
    let apiUrl = process.env.API_URL + "get-abi";
    let result = await axios.post(apiUrl, {
        blockchain: 'BNB',
        address: data.contractAddress
    });

    if (result.data.status != 1) {
        res.send('0')
    }

    contractAbi = result.data.data.contract_abi;

    contractAbi = JSON.parse(contractAbi);

    let nftContract = new web3js.eth.Contract(contractAbi, contractAddress);

    let trData = nftContract.methods.transferFrom(data.selectedAccount, data.adminAddress, data.tokenId).encodeABI();
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
    console.log(data);
    let apiUrl = process.env.API_URL + "get-abi";

    let rpcurl = "";
    let contractAddress = "";
    let contractAbi = "";

    let result = await axios.post(apiUrl, {
        blockchain: data.currency,
        type: 'auction'
    });
    if (result.data.status != 1) {
        res.send('0')
    }

    contractAbi = result.data.data.abi;

    contractAbi = JSON.parse(contractAbi);
    contractAddress = result.data.data.address;
    rpcurl = result.data.rpc_url;

    let web3Obj = new web3(
        new web3.providers.HttpProvider(rpcurl)
    );

    const nonce = await web3Obj.eth.getTransactionCount(data.selectedAccount, 'latest');

    let nftContract = new web3Obj.eth.Contract(contractAbi, contractAddress);

    let trData = nftContract.methods.withdrawAuction(data.nftContract, data.tokenId).encodeABI();

    let estimates_gas = await web3Obj.eth.estimateGas({
        'from': data.selectedAccount,
        'to': contractAddress,
        'data': trData
    });

    let gasLimit = web3Obj.utils.toHex(estimates_gas * 2);
    let gasPrice_bal = await web3Obj.eth.getGasPrice();
    let gasPrice = web3Obj.utils.toHex(gasPrice_bal * 2);

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

const BNBTransfer = async (address_from, address_to, tokenid, contract_type, privatekey, standard) => {
    let coinABI = "";
    let coinAddress = "";
    if (standard == "721") {
        if (contract_type == "lazy") {
            coinABI = bsc_lazy.ABI;
            coinAddress = bsc_lazy.contractAddress;
        }
        if (contract_type == "normal") {
            coinABI = bsc_normal.ABI;
            coinAddress = bsc_normal.contractAddress;
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

    let trData = "";
    if (standard == "721") {
        trData = tokenContract.methods.transferFrom(address_from, address_to, tokenid).encodeABI();
    } else {
        trData = tokenContract.methods.transferFrom(address_from, address_to, tokenid, 1).encodeABI();
    }

    let estimates_gas = await web3js.eth.estimateGas({
        from: address_from,
        to: address_to,
        data: trData,
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

const CoinTransfer = async (receiver_address, amount, sender_address, sender_private_key) => {
    let tokenContract = new web3js.eth.Contract(coinABI, coinAddress);

    if (sender_private_key.length > 64) {
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
        "chainId": web3js.utils.toHex('1221'),
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

const AdminCoinTransfer = async (address_from, privatekey, address_to, amount) => {


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
    if (status) {
        return status.blockNumber;
    }
}

const balanceMainBNB = async (account) => {
    let balance = await web3js.eth.getBalance(account);
    if (balance) {
        balance = balance / Math.pow(10, 18);
        return balance;
    }
};

const coinBalanceBNB = async (account) => {
    let tokenContract = new web3js.eth.Contract(coinABI, coinAddress);
    let balance;
    try {
        balance = await tokenContract.methods.balanceOf(account).call();
        balance = parseFloat(balance) / Math.pow(10, 10);
    } catch (error) {
        balance = 0;
    }
    return balance;
};

const createWalletHelper = async () => {
    let newData = await web3js.eth.accounts.create();
    if (newData) {
        return newData.privateKey;
    }
};

const checkWalletPrivateHelper = async (pk) => {
    let newData = await web3js.eth.accounts.privateKeyToAccount(pk);
    if (newData) {
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
    checkWalletPrivateHelper,
    makeTransaction,
    makeSellTransaction,
    makeBidTransaction,
    getBidInfo,
    settleAuctionTrx,
    makeSellAuctionTransaction,
    makeBatchTransaction,
    transferToAdmin,
    transferNftToOwner,
    removeFromAuction,
    removeSale,
    makeProposal
}