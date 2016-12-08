/**
 * Created by lqh on 2016/12/7.
 */
// class Price {
//     constructor(code, times, price) {
//         this.code = code;
//         this.times = times;
//         this.price = price;
//     }
//
//     toString() {
//         return "{code:" + code
//             + ",times:" + times
//             + ", price:" + price
//             + "}";
//     }
// }

function StockPrice(code, times, price) {
    this.code = code;
    this.times = times;
    this.price = price;
}

StockPrice.prototype = {
    toString: function () {
        return "{code:" + code
            + ",times:" + times
            + ", price:" + price
            + "}";
    }
};

exports.StockPrice = StockPrice;