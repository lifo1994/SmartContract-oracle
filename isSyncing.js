var Web3 = require('web3');
const EventEmitter = require('events');

const web3 = new Web3(new Web3.providers.WebsocketProvider('http://127.0.0.1:1235'))

var subscription = web3.eth.subscribe('newBlockHeaders');
//"data" : Fires on each incoming block header.
subscription.on("data", function(blockHeader){
	//console.log("found block : " + blockHeader.number);
	//console.log(blockHeader);
	my_revolver.emit("load", blockHeader.number);
});


class Revolver extends EventEmitter {
	constructor() {
		super();
		//menber
		this.block_low = 1394621;
		//maybe init high here???
		this.block_high = 0;

		//events
		this.on("consume", function(){
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

		this.on("load", function(high){
			this.block_high = high;
		});	
	}
}


my_revolver = new Revolver();
var interval = setInterval(()=>{console.log(my_revolver)}, 3000);


var interval2 = setInterval(()=>{my_revolver.emit("consume");}, 1000);