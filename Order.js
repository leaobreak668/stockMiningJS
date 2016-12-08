//
class Order {
    constructor(times, price, qty) {
        this.times = times;
        this.price = price;
        this.qty = qty;
    }

    calDays(d1, d2) {
        d1 = new Date(d1);
        d2 = d2 === undefined ? new Date() : new Date(d2);
        return (d2.getTime() - d1.getTime()) / (24 * 60 * 60 * 1000);
    }

    saleAmt(salePrice) {
        this.saleTimes = new Date();
        this.salePrice = salePrice;
        return (this.qty * this.salePrice).toFixed(2);
    }

    getAmt() {
        return (this.qty * this.price).toFixed(2);
    }

    getCurAmt(price) {
        return (this.qty * price).toFixed(2);
    }

    getYearRate(price) {
        if (price === undefined) {
            price = this.salePrice;
        }
        var saleAmt = this.getCurAmt(price);
        var buyAmt = this.getAmt();
        var days = this.calDays(this.times, this.saleTimes);
        return (((saleAmt - buyAmt) * days / buyAmt) / 365).toFixed(2);
    }
}
exports.Order = Order;