/**
 * Created by Administrator on 2017/2/21.
 * 前端的后台服务端
 */
//获取目标environment，若无则默认赋值global变量为dev
global.env = process.env.TARGET_ENV;
if (env == undefined || env == '' || env == null) {
    global.env = 'dev';
}

const co = require('co');
const fs = require('fs');
const http = require('http');
const https = require('https');
const oss = require("ali-oss");
const uuidv1 = require('uuid/v1');
const request = require('request');
const multer = require('multer');
const cheerio = require('cheerio');
const express = require('express');
const bodyParser = require('body-parser');
const device = require('express-device');
const data = require('./data');

//数据库初始化
require('./db/mongodb');
require('./db/mysql');
require('./db/neo4j');

//路由方法
const neo4jRouter = require('./router/neo4j');
const indexRouter = require('./router/index');
const exceptionRouter = require('./router/exception');
let app = express();
app.use(bodyParser.json({limit: '25mb'}));
app.use(bodyParser.urlencoded({limit: '25mb', extended: true}));
app.use(neo4jRouter);
app.use(indexRouter);
app.use(exceptionRouter);

//----------------------------- 开启http和https服务 ----------------------------------------
var privateKey = fs.readFileSync(data.setting['https']['key']);
var certificate = fs.readFileSync(data.setting['https']['cert']);
var credentials = {key: privateKey, cert: certificate};

//如果部署到生产环境则用https协议打开端口，否则直接使用http协议端口
if (global.env == 'prod') {
    https.createServer(credentials, app).listen(data.setting['https']['port']); //开启http设置s配置
    app.listen(data.setting['port']);
    console.log("Server is running at port: ", data.setting['port'], " https port: ", data.setting['https']['port'], " and run at environment: ", global.env);

} else {
    app.listen(data.setting['port']);
    console.log("Server is running at port: ", data.setting['port'], " and run at environment: ", global.env);
}















