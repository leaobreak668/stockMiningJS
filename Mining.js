/**
 * Created by lqh on 2016/12/8.
 */
var MongoClient = require('mongodb').MongoClient;
var MakeMoney = require('./MakeMoney');
//
// var DB_CONN_STR = 'mongodb://127.0.0.1:27017/nodedb';
var DB_CONN_STR = 'mongodb://172.16.9.65:27017/nodedb';
//
(function () {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        var collection = db.collection('PRICE000783');
        var whereStr = {};
        collection.find(whereStr).sort({
            "times": 1
        }).toArray(function (err, result) {
            if (err) {
                console.log('Error:' + err);
                return;
            }
            db.close();
            MakeMoney.make(result);
        });
    });
})();