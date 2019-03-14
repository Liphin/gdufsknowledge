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

//广外知识图谱数据库所有数据装载
let gdufsKnowledgeTableData = {
    'visit_general_list': '',
    'visit_director_list': '',
    'expert_short_visit': '',
    'expert_long_visit':'',
    'exchange_student_list':'',
    'agreements': '',
    'school_level_reception': '',
    'abroad_back_people': '',
};

module.exports = {
    setting: setting,
    openConfig: openConfig,
    dbPool: dbPool,
    gdufsKnowledgeTableData: gdufsKnowledgeTableData,
};