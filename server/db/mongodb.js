/**
 * Created by Administrator on 2018/12/30.
 */
const data = require('../data'); //数据集
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

//初始化连接操作，维持MongoDB的pool链接
if(data.setting['mongodb']['toConnect']){
    MongoClient.connect(data.setting['mongodb']['url'], {
        useNewUrlParser: data.setting['mongodb']['useNewUrlParser'],
        poolSize: data.setting['mongodb']['poolSize']

    }, function (err, database) {
        if (err) throw err;
        data.dbPool['mongodb'] = database;
    });
}

