/**
 * Created by Administrator on 2018/12/30.
 */
const data = require('../data');
const neo4j = require('neo4j-driver');

//设置是否连接neo4j
if (data.setting['neo4j']['toConnect']) {
    //初始化neo4的jdriver
    data.dbPool.neo4j = neo4j.v1.driver(
        data.setting['neo4j']['url'],
        neo4j.v1.auth.basic(data.setting['neo4j']['account'], data.setting['neo4j']['password'])
    );
}