/**
 * Created by Administrator on 2018/12/30.
 * 设置服务器的数据集
 */
let setting = require('./config/' + global.env + "/setting.json");

//公开设置给前端调用的数据
let openConfig = {
    'bgUrl': setting['bgUrl'],
};

//初始化数据库连接句柄
let dbPool = {
    'mongodb': '',
    'mysql': '',
    'neo4j': '',
};

module.exports = {
    setting: setting,
    openConfig: openConfig,
    dbPool: dbPool,
};