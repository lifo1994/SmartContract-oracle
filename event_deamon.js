var Web3 = require('web3');
var fs = require('fs');
var set = require('./intersection.js');

const web3 = new Web3(new Web3.providers.WebsocketProvider('http://127.0.0.1:1235'))

function Listen_contract(filename){
	//private var
	var _contract_list = {};

	//constructor
	try{
		//to lower case, address is Hex A = a
		_contract_list = JSON.parse( fs.readFileSync(filename, 'utf8').toLowerCase() );
	}catch(err){
		console.log("Can't find file : " + filename);
	}

	//public 
	return {
		show : function(){
			console.log("-------listen_contract.show()-------");
			//console.log(_contract_list);
			console.log(JSON.stringify(_contract_list, null, "    "));
			console.log("-----listen_contract.show() END-----");
		},
		
		abi : function(search_address){
			return _contract_list[search_address];
		},

		address_list : Object.keys(_contract_list)
	}
}

function instersection_contracts(_tar_contracts, meta_contracts){
	return set.intersect(_tar_contracts, meta_contracts);
}

async function related_contract_address_list(transactions){
	var contract_list = [];
	////*****change to parallel version
	for(transaction of transactions){

		var receipt = await web3.eth.getTransactionReceipt(transaction);
		//the contract address is what user interact to.
		contract_list.push(receipt.to);
		//console.log(receipt);
	}
	return contract_list;
}

function Block_surveillance(address_list){
	var _block_num_last = -1;
	var _tar_contracts = address_list;

	async function listen(){
		let checking_block_num = await web3.eth.getBlockNumber();

		if(_block_num_last != checking_block_num){
			_block_num_last = checking_block_num;
			console.log("block : " + checking_block_num);

			let block_info = await web3.eth.getBlock(checking_block_num);
			var trigger_contract = await related_contract_address_list(block_info.transactions);

			return trigger_contract;
			// var instersection1 = instersection_contracts(_tar_contracts, trigger_contract);

			// //console.log(instersection1);
			// if( instersection1.length > 0 ){
			//  	console.log(instersection1);
			//  	console.log('event!!');
			// }
		}
	}

	return{
		//***change***block from
		listen_all : async function(){
			return await listen();
		},
		listen_own : async function(){
			return instersection_contracts(_tar_contracts, await listen());
		}
	}
}



// my_listen_contract = listen_contract("file")
// transactions._tar_contracts = my_listen_contract.address_list;
// console.log(transactions._tar_contracts);
// var interval = setInterval(transactions, 1000);


my_listen_contract = Listen_contract("file");
surveillance = Block_surveillance(my_listen_contract.address_list);

var interval = setInterval(surveillance.listen_own, 1000);


//transactions();
//transactions("file");

