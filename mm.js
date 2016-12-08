/**
 * http://usejsdoc.org/
 */
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://127.0.0.1:27017/nodedb';
//
var queryData = function(db, callback) {
	// 连接到表
	var collection = db.collection('PRICE000783');
	// 查询数据
	var whereStr = {};
	// var pattern = new RegExp("^" + '2016-08-0' + ".*$");
	collection.find(whereStr).sort({
		  "times" : 1
	  }).toArray(function(err, result) {
		  if (err) {
			  console.log('Error:' + err);
			  return;
		  }
		  callback(result);
	  });
}
//
var initAmt = 100000.0;//初始金额
var totalAmt = initAmt;
var totalBalanceAmt = initAmt;//余额
var latestPrice = 0;
//
var rate = 30;
var layer = 3;
//
var maxPrice = 0;
var minPrice = 0;
var stockList = [];
//
var buyMinTimes = 0;
var fallMinTimes = 0;
//
var makeMoney = function(lists) {
	for (var dayItem in lists) {
		var times = lists[dayItem]["times"];
		var currentPrice = Number(lists[dayItem]["price"]);
		// console.log("currentPrice:============= " + times + "============" + currentPrice);
		//
		if (stockList.length == 0) {
			buyMinOrder(times, currentPrice);
			maxPrice = currentPrice;
			minPrice = currentPrice;
		} else if (currentPrice < minPrice) {
			if (isLessMin(currentPrice, minPrice)) {
				buyMinOrder(times, currentPrice);
			}
		} else if (currentPrice > maxPrice) {
			if (isMoreMax(currentPrice, maxPrice)) {
				buyMaxOrder(times, currentPrice);
			}
		} else if (stockList.length >= 3) {//
			saleOrder(times, currentPrice);
		}
		latestPrice = currentPrice;
	}
	console.log("totalFundAmt: " + totalAmt);
	for (var idx in stockList) {
		var item = stockList[idx];
		console.log("Hold...." + item["times"] + " # " + item["qty"] + " # " + item["price"] + " # " + item["qty"] * item["price"]);
		totalAmt = totalAmt + item["qty"] * latestPrice;
	}
	console.log("totalFundAmt: " + totalAmt);
	console.log("totalUsedAmt: " + (initAmt - totalBalanceAmt));
	console.log("Rate: " + (totalAmt - initAmt) / (initAmt - totalBalanceAmt));
}
//
var saleOrder = function(times, currentPrice) {
	var obj = stockList[0];
	if (risePrice(currentPrice, Number(obj["price"])) >= rate * layer) {
		console.log("sale......." + times + " # " + currentPrice);
        fallMinTimes=0;
        buyMinTimes = 0;
		var a = stockList.shift();
		totalAmt = totalAmt + (a["qty"] * currentPrice);
		a = stockList.shift();
		totalAmt = totalAmt + (a["qty"] * currentPrice);
		a = stockList.shift();
		totalAmt = totalAmt + (a["qty"] * currentPrice);
		if (totalBalanceAmt > totalAmt) {
			totalBalanceAmt = totalAmt;
		}
	}
}
//
var risePrice = function(currentPrice, price) {
    return parseInt((1000 * currentPrice - 1000 * price) / price);
}
//
var fallPrice = function(currentPrice) {
	if(maxPrice == 0){
		return 0 ;
	}
    return parseInt((1000 * maxPrice - 1000 * currentPrice) / maxPrice);
}
//
var isLessMin = function(currentPrice, minPrice) {
	var percent = parseInt((1000 * minPrice - 1000 * currentPrice) / minPrice);
	return percent >= rate;
}
//
var isMoreMax = function(currentPrice, maxPrice) {
	var percent = parseInt((1000 * currentPrice - 1000 * maxPrice) / maxPrice);
	return percent >= rate;
}
//
var buyMinOrder = function(times, price) {
	var qty = getQtyByPrice(price);
	if (qty == 0) {
		return;
	}
    minPrice = price;
	console.log("fallPrice: " + fallPrice(minPrice));
	if(fallPrice(minPrice) > rate * (stockList.length - 1)){
		return;
	}
	console.log("buy min...." + times + " # " + price);
	stockList.unshift({
		  times : times,
		  price : price,
		  qty : qty
	  });
	totalAmt = totalAmt - qty * price;
	if (totalBalanceAmt > totalAmt) {
		totalBalanceAmt = totalAmt;
	}
}
//
var buyMaxOrder = function(times, price) {
	var qty = getQtyByPrice(price);
	if (qty == 0) {
		return;
	}
	console.log("buy max...." + times + " # " + price);
	maxPrice = price;
	stockList.push({
		  times : times,
		  price : price,
		  qty : qty
	  });
	totalAmt = totalAmt - qty * price;
	if (totalBalanceAmt > totalAmt) {
		totalBalanceAmt = totalAmt;
	}
    fallMinTimes=0;
    buyMinTimes = 0;
}
//
var getQtyByPrice = function(price) {
	var qty = 0;
	if (price <= 9) {
		qty = 300;
	} else if (price > 9 && price <= 15.0) {
		qty = 200;
	} else if (price > 15 && price <= 30) {
		qty = 100;
	}
	return qty;
}
//
exports.make = function() {
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		  console.log("连接成功！");
		  queryData(db, function(result) {
			    db.close();
			    makeMoney(result);
		    });
	  });
};