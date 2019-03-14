/**
 * Created by Administrator on 2019/2/15.
 * 创建广外接待师生节点与来访事件节点的关系
 */
const uuidv1 = require('uuid/v1');
const utilTool = require('../../service/utilTool');

/**
 * 递归创建广外接待师生节点与来访事件节点的关系
 * @param bodyData
 * @param index
 * @param session
 * @param resolve
 */
let relationIterator = function (bodyData, index, session, resolve) {

    //创建广外领导教师——到访接待事件关系的CQL与数据集
    let queryStr = 'match (gt:Gdufs_Teacher), (ve:Visit_Event) where gt.cn_name=$cn_name and ve.unique_id=$unique_id_1 ';
    queryStr += 'create (gt)-[n:Gdufs_Teacher_Visit_Event{ role: $role, unique_id:$unique_id_2 }]->(ve)';
    let queryData = {
        cn_name: bodyData['gdufs_teacher'][index]['cn_name'],
        unique_id_1: bodyData['unique_id'],
        role: bodyData['gdufs_teacher'][index]['role'],
        unique_id_2: uuidv1() //每个关系均有唯一标识符属性字段
    };

    session.run(queryStr, queryData)
        .subscribe({
            onCompleted: () => {
                //递归变量每位出访教师和来访事件进行连接
                if (index < bodyData['gdufs_teacher'].length - 1) {
                    relationIterator(bodyData, ++index, session, resolve)
                }
                //所有教师递归完成后返回success
                else {
                    console.log('create new gdfus_teach & visit_event relation complete');
                    session.close();
                    resolve(200);
                }
            },
            onError: error => {
                console.log(error, '8', utilTool.getCurrentDataTime())
                resolve('创建广外接待师生——接待事项关系出错' + utilTool.getCurrentDataTime());
            }
        })
};


//广外接待师生——来访事件关系的创建操作
let gdufsTeacherVisitEventInit = function (bodyData, driver) {
    return new Promise(resolve => {
        const session = driver.session();
        relationIterator(bodyData, 0, session, resolve)
    });
};


/**
 * 获取所有广外领导教师——接待来访事件的所有关系数据
 * @param driver
 */
let getAllGdufsTeacherVisitEventLink = function (driver) {
    return new Promise(resolve => {
        const session = driver.session();
        let gdufsTeacherVisitEventLink = [];
        session.run('match (g:Gdufs_Teacher)-[n:Gdufs_Teacher_Visit_Event]->(e:Visit_Event) return properties(n) as result, g.unique_id as source, e.unique_id as target')
            .subscribe({
                onNext: record => {
                    gdufsTeacherVisitEventLink.push({
                        'source':record.get('source'),
                        'target':record.get('target'),
                        'attach':record.get('result'),
                        'label_name':'gdufs_teacher_visit_event'
                    });
                },
                onCompleted: () => {
                    resolve(gdufsTeacherVisitEventLink);
                },
                onError: error => {
                    console.error('getAllGdufsTeacherVisitEventLink error', error);
                    resolve([]);
                }
            });
    });
};


module.exports = {
    gdufsTeacherVisitEventInit: gdufsTeacherVisitEventInit,
    getAllGdufsTeacherVisitEventLink: getAllGdufsTeacherVisitEventLink,
};





