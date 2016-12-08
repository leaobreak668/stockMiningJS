class Order {
    constructor(times, price, qty) {
        this.times = times;
        this.price = price;
        this.qty = qty;
    }

    getAmt() {
        return (this.qty * this.price).toFixed(2);
    }

    getCurAmt(price) {
        return (this.qty * price).toFixed(2);
    }
}
exports.Order = Order;