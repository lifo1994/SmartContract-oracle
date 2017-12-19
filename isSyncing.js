var Web3 = require('web3');
const EventEmitter = require('events');

const web3 = new Web3(new Web3.providers.WebsocketProvider('http://127.0.0.1:1235'))

class BlockLine extends EventEmitter {
	constructor() {
		super();
		//menber
		this.block_low = 1394621;
		//maybe init high here???
		this.block_high = 0;

		//events
		this.on("start_work", function(){
			//consume to the latest block
			while(true){
				if(this.block_low < this.block_high){
					//trigger event here
					
					this.block_low++;
					console.log("consume block");
					continue;
				}
				else{
					console.log("consume fail");
					break;
				}
			}
		});

		this.on("renew_block_hight", function(high){
			if(high >= this.block_high){
				this.block_high = high;
			}
			else{
				console.log("update high should higher than original not")
			}
		});	
	}
}





var subscription = web3.eth.subscribe('newBlockHeaders');
//"data" : Fires on each incoming block header.
subscription.on("data", function(blockHeader){
	//console.log("found block : " + blockHeader.number);
	//console.log(blockHeader);
	my_BlockLine.emit("renew_block_hight", blockHeader.number);
});

my_BlockLine = new BlockLine();


var interval = setInterval(()=>{console.log(my_BlockLine)}, 3000);


var interval2 = setInterval(()=>{
	my_BlockLine.emit("start_work");
}, 1000);