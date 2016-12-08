/**
 * http://usejsdoc.org/
 */
var lineReader = require('line-reader');
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://127.0.0.1:27017/nodedb';
//
var insertData = function(db, datas, callback) {
	// 连接到表
	console.log("Data inserting...");
	var collection = db.collection('PRICE000783');
	if (datas.length > 0) {
		collection.insertMany(datas, function(err, result) {
			if (err) {
				console.log('Error:' + err);
				return;
			}
			callback(result);
		});
	} else {
		callback("no data insert!");
	}
}
//
var datas = [];
var dbup = function() {
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		console.log("连接成功！");
		insertData(db, datas, function(result) {
			console.log(result);
			db.close();
		});
	});
};

exports.init = function() {
	lineReader.eachLine("ress/Price000783.txt", function(line, last) {
		var lines = line.split(" - INFO - ");
		datas.push({
			times : lines[0],
			price : lines[1]
		});
	}, dbup);
};