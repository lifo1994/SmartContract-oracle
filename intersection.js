module.exports = {

	intersect : function(a, b) {
		if(a === undefined || b === undefined){
			return [];
		}
	    var t;
	    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
	    return a.filter(function (e) {
	        return b.indexOf(e) > -1;
	    });
	}
}

//var set = require('./intersection.js');
// var arr1 = ["mike", "sue", "tom", "kathy", "henry"];
//     arr2 = ["howey", "jim", "sue", "jennifer", "kathy", "hank", "alex"];
// console.log(set.intersect(arr1, arr2)); // ["sue", "kathy"]