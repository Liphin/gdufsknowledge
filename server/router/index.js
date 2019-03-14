/**
 * Created by Administrator on 2018/12/30.
 */
const express = require('express');
const data = require('../data');
const router = express.Router();


/**
 * get请求获取基础配置文件
 */
router.get('/getConfig', (req, res, next) => {
    res.send(data.openConfig);
});


/**
 * 测试MongoDB连通
 */
router.get('/testMongo', (req, res, next) => {
    data.dbPool.mongodb.db('arbitration').collection('arbilist').find({}).toArray(function (err, docs) {
        res.send(docs);
    })
});


/**
 * 测试mysql连通
 */
router.get('/testMysql', (req, res, next) => {
    data.dbPool.mysql.query('select * from visit_general_list', function (error, results, fields) {
        if (error) throw error;
        res.send(results);
    });
});


//html、JavaScript等资源文件获取
router.use(express.static(data.setting['base'] + "public"));
//router.use("/", express.static("G:/SoftwareOutSourcing/GDUFS/knowledge/back/public"));

module.exports = router;