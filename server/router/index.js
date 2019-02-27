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


//html、JavaScript等资源文件获取
router.use(express.static(data.setting['base'] + "public"));
//router.use("/", express.static("G:/SoftwareOutSourcing/GDUFS/knowledge/back/public"));

module.exports = router;