/**
 * Created by Administrator on 2019/2/15.
 * 创建来访单位节点与来访事件节点的关系
 */
const uuidv1 = require('uuid/v1');
const utilTool = require('../../service/utilTool');

/**
 * 递归创建来访单位节点与来访事件节点的关系
 * @param bodyData
 * @param index
 * @param session
 * @param resolve
 */
let relationIterator = function (bodyData, index, session, resolve) {

    let attendValue = '';
    //如果attend人员为空则无该字段，此时应返回一个空的字符串[]
    if (utilTool.checkDataNotEmpty(bodyData['visitor_dept'][index]['attend'])) {
        attendValue = JSON.stringify(bodyData['visitor_dept'][index]['attend'])
    } else {
        attendValue = JSON.stringify([]);
    }

    //创建到访嘉宾信息——到访接待事件关系的CQL与数据集
    let queryStr = 'match (vd:Visitor_Dept), (ve:Visit_Event) where vd.cn_name=$cn_name and ve.unique_id=$unique_id_1 ';
    queryStr += 'create (vd)-[:Visitor_Dept_Visit_Event{ attend:$attend, unique_id:$unique_id_2 }]->(ve)';
    let queryData = {
        cn_name: bodyData['visitor_dept'][index]['cn_name'],
        unique_id_1: bodyData['unique_id'],
        attend: attendValue,
        unique_id_2: uuidv1() //每个关系均有唯一标识符属性字段
    };

    session.run(queryStr, queryData)
        .subscribe({
            onCompleted: () => {
                //递归变量每位出访人和来访时间进行关系连接
                if (index < bodyData['visitor_dept'].length - 1) {
                    relationIterator(bodyData, ++index, session, resolve)
                }
                //所有出访人师递归完成后返回success
                else {
                    console.log('create new visitor_dept & visit_event relation complete');
                    session.close();
                    resolve(200);
                }
            },
            onError: error => {
                console.error(error, '10', utilTool.getCurrentDataTime());
                resolve('创建来访单位——访问事项关系出错' + utilTool.getCurrentDataTime());
            }
        })
};


//来访单位——来访事件关系的创建操作
let visitorDeptVisitEventInit = function (bodyData, driver) {
    return new Promise(resolve => {
        const session = driver.session();
        relationIterator(bodyData, 0, session, resolve)
    });
};


/**
 * 获取所有来访嘉宾所在单位——来访事件的所有关系数据
 * @param driver
 */
let getAllVisitorDeptVisitEventLink = function (driver) {
    return new Promise(resolve => {
        const session = driver.session();
        let visitorDeptVisitEventLink = [];
        session.run('match (v:Visitor_Dept)-[n:Visitor_Dept_Visit_Event]->(e:Visit_Event) return properties(n) as result, v.unique_id as source, e.unique_id as target')
            .subscribe({
                onNext: record => {
                    visitorDeptVisitEventLink.push({
                        'source': record.get('source'),
                        'target': record.get('target'),
                        'attach': record.get('result'),
                        'label_name': 'visitor_dept_visit_event'
                    });
                },
                onCompleted: () => {
                    resolve(visitorDeptVisitEventLink);
                },
                onError: error => {
                    console.error('getAllVisitorDeptVisitEventLink error', error);
                    resolve([]);
                }
            });
    });
};


module.exports = {
    visitorDeptVisitEventInit: visitorDeptVisitEventInit,
    getAllVisitorDeptVisitEventLink: getAllVisitorDeptVisitEventLink,
};





