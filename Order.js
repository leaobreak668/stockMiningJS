class Order {
    constructor(times, price, qty) {
        this.times = times;
        this.price = price;
        this.qty = qty;
    }

    getAmt() {
        return 100 * this.qty * this.price / 100;
    }

    getCurAmt(price) {
        return 100 * this.qty * price / 100;
    }
}
exports.Order = Order;