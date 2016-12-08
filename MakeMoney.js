/**
 * Created by mvliao on 2016/12/7.
 */
var Order = require("./Order");
//
var initAmt = 100000.0;//初始金额
var totalFundAmt = initAmt; //可用资金额
var totalUsedAmt = 0;// 即时占用金额
var totalMaxUsedAmt = 0;//最大占用金额
var totalAmt = 0;
var latestPrice = 0;
//
var riseRate = 3; //追涨百分比
var fallRate = 5; //杀跌百分比
var layer = 3;
//
var maxPrice = 0;
var minPrice = 0;
var stockList = [];
//
var avgYearRate = 0.0;
var saleTimes = 0;
//
var add = function (x, y) {
    return Number(x) + Number(y);
}
//
var calDays = function (d1, d2) {
    return (d2.getTime() - d1.getTime()) / (24 * 60 * 60 * 1000);
}
//
var makeMoney = function (lists) {
    for (var dayItem in lists) {
        var times = lists[dayItem]["times"];
        var currentPrice = Number(lists[dayItem]["price"]);
        //
        if (stockList.length == 0) {
            buyMinOrder(times, currentPrice);
            maxPrice = currentPrice;
            minPrice = currentPrice;
        } else if (currentPrice < minPrice) {
            if (isBuyMin(currentPrice)) {
                buyMinOrder(times, currentPrice);
            }
        } else if (currentPrice > maxPrice) {
            if (isBuyMax(currentPrice)) {
                buyMaxOrder(times, currentPrice);
            }
        } else if (stockList.length >= 3) {//
            saleOrder(times, currentPrice);
        }
        latestPrice = currentPrice;
    }
    totalAmt = totalFundAmt;
    for (var idx in stockList) {
        var item = stockList[idx];
        console.log("Hold.." + item.times + " # " + item.qty + " # " + item.price + " # " + item.getAmt());
        totalAmt = add(totalAmt, item.getCurAmt(latestPrice));
        //
        avgYearRate = add(avgYearRate, item.getYearRate(latestPrice));
        if (saleTimes > 0) {
            avgYearRate = (avgYearRate / 2).toFixed(2)
        }
    }
    console.log("totalFundAmt: " + totalFundAmt);
    console.log("totalAmt    : " + totalAmt);
    console.log("totalMaxUsedAmt: " + totalMaxUsedAmt);
    console.log("Rate: " + (totalAmt - initAmt) / totalMaxUsedAmt);
    console.log("avgYearRate: " + avgYearRate);
}
//
var saleOrder = function (times, currentPrice) {
    if (risePercent(currentPrice, minPrice) >= riseRate * layer) {
        console.log("...sale.." + times + " # " + currentPrice);
        //
        var item = stockList.shift();
        totalFundAmt = add(totalFundAmt, item.saleAmt(currentPrice));
        totalUsedAmt = totalUsedAmt - item.getCurAmt(currentPrice);
        avgYearRate = add(avgYearRate, item.getYearRate());
        console.log("avgYearRate2222222: " + item.getYearRate());
        //
        item = stockList.shift();
        totalFundAmt = add(totalFundAmt, item.saleAmt(currentPrice));
        totalUsedAmt = totalUsedAmt - item.getCurAmt(currentPrice);
        avgYearRate = add(avgYearRate, item.getYearRate());
        //
        item = stockList.shift();
        totalFundAmt = add(totalFundAmt, item.saleAmt(currentPrice));
        totalUsedAmt = totalUsedAmt - item.getCurAmt(currentPrice);
        avgYearRate = add(avgYearRate, item.getYearRate());
        if (stockList.length == 0) {
            maxPrice = 0;
            minPrice = 0;
        } else {
            minPrice = stockList[0].price;
        }
        //
        if (saleTimes == 0) {
            avgYearRate = (avgYearRate / 3).toFixed(2)
        } else {
            avgYearRate = (avgYearRate / 4).toFixed(2)
        }
    }
}
//
var risePercent = function (currentPrice, price) {
    return parseInt(100 * (currentPrice - price) / price);
}
//
var isBuyMin = function (currentPrice) {
    var risePercent = parseInt(100 * (minPrice - currentPrice) / minPrice)
    return risePercent > fallRate;
}
//
var isBuyMax = function (currentPrice) {
    var risePercent = parseInt(100 * (currentPrice - maxPrice) / maxPrice);
    return risePercent > riseRate;
}
//
var fallPercentFromMax = function (currentPrice) {
    if (maxPrice == 0) {
        return 0;
    }
    return parseInt(100 * ( maxPrice - currentPrice) / maxPrice);
}
//
var buyMinOrder = function (times, price) {
    var qty = getQtyByPrice(price);
    if (qty == 0) {
        return;
    }
    var fallMax = fallPercentFromMax(minPrice);
    if (fallMax < (fallRate * (stockList.length - 1))) {
        return;
    }
    //
    if (stockList.length > 1) {
        qty = qty * (stockList.length + 1) * 0.5; //这句很关键
    }
    console.log("buy min.." + times + " # " + price);
    var order = new Order.Order(times, price, qty);
    stockList.unshift(order);
    totalFundAmt = totalFundAmt - order.getAmt();
    totalUsedAmt = add(totalUsedAmt, order.getAmt());
    minPrice = price;
    //
    if (totalMaxUsedAmt < totalUsedAmt) {
        totalMaxUsedAmt = totalUsedAmt;
    }
}
//
var buyMaxOrder = function (times, price) {
    var qty = getQtyByPrice(price);
    if (qty == 0) {
        return;
    }
    console.log("buy max.." + times + " # " + price);
    //
    var order = new Order.Order(times, price, qty);
    stockList.push(order);
    totalFundAmt = totalFundAmt - order.getAmt();
    totalUsedAmt = add(totalUsedAmt, order.getAmt());
    maxPrice = price;
    //
    if (totalMaxUsedAmt < totalUsedAmt) {
        totalMaxUsedAmt = totalUsedAmt;
    }
}
//
var getQtyByPrice = function (price) {
    var qty = 0;
    if (price <= 12) {
        qty = 300;
    } else if (price > 12 && price <= 18) {
        qty = 200;
    } else if (price > 18 && price <= 35) {
        qty = 100;
    }
    return qty;
}
exports.make = makeMoney;