/**
 * Created by Administrator on 2017/2/21.
 * 前端的后台服务端基础方法
 */
const data = require('../data');

/**
 * 后台程序初始化操作方法
 */
function init() {
    //获取全部广外知识图谱mysql中的数据
    getAllGdufsKnowledgeMysqlData();
}

/**
 * 获取全部广外知识图谱mysql中的数据
 */
function getAllGdufsKnowledgeMysqlData() {
    //获取全部mysql中的gdufs_knowledge数据表的数据操作
    for (let i in data.gdufsKnowledgeTableData) {
        data.dbPool.mysql.query('select * from ' + i, function (error, results, fields) {
            if (error) throw error;
            data.gdufsKnowledgeTableData[i] = results;
        });
    }
}


module.exports = {
    init: init,
    getAllGdufsKnowledgeMysqlData: getAllGdufsKnowledgeMysqlData,
};















