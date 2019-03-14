/**
 * Created by Administrator on 2019/2/15.
 * 创建来访嘉宾节点与所在单位节点的关系
 */
const uuidv1 = require('uuid/v1');
const utilTool = require('../../service/utilTool');

/**
 * 递归创建来访嘉宾节点与所在单位节点的关系
 * @param bodyData
 * @param index
 * @param session
 * @param resolve
 */
let relationIterator = function (bodyData, index, session, resolve) {

    //查询该嘉宾是否已与其所在单位机构建立COL关系
    let searchStr = 'match (v:Visitor)-[n:Visitor_Visitor_Dept]->(vd:Visitor_Dept) where v.cn_name=$cn_name_1 and vd.cn_name=$cn_name_2 return n';
    let searchData = {
        cn_name_1: bodyData['visitor'][index]['cn_name'],
        cn_name_2: bodyData['visitor'][index]['dept_cn_name']
    };
    session.run(searchStr, searchData)
        .then(result => {
            //如果该来访嘉宾与其机构节点尚未创建关系则新建
            if (result.records.length <= 0) {
                //创建到访嘉宾信息——所在单位机构/院校等的关系的CQL与数据集
                let queryStr = 'match (v:Visitor), (vd:Visitor_Dept) where v.cn_name=$cn_name_1 and vd.cn_name=$cn_name_2 ';
                queryStr += 'create (v)-[:Visitor_Visitor_Dept{ unique_id:$unique_id }]->(vd)';
                let queryData = {
                    cn_name_1: bodyData['visitor'][index]['cn_name'],
                    cn_name_2: bodyData['visitor'][index]['dept_cn_name'],
                    unique_id: uuidv1() //每个关系均有唯一标识符属性字段
                };

                session.run(queryStr, queryData)
                    .subscribe({
                        onCompleted: () => {
                            //递归变量每位出访人和所在机构/院校进行关系连接
                            if (index < bodyData['visitor'].length - 1) {
                                relationIterator(bodyData, ++index, session, resolve)
                            }
                            //所有出访人递归创建关系完成后返回success
                            else {
                                console.log('create new visitor & visit_college relation complete');
                                session.close();
                                resolve(200);
                            }
                        },
                        onError: error => {
                            console.error(error, '9', utilTool.getCurrentDataTime());
                            resolve('创建来访嘉宾——所在单位关系出错' + utilTool.getCurrentDataTime());
                        }
                    })
            }
            //如果该来访嘉宾已经和所在单位节点建立连接关系则直接返回成功不进行创建操作
            else {
                //console.log('visitor & visit_college relation exist');
                session.close();
                resolve(200);
            }
        })
        .catch(function (error) {
            console.error(error, '91', utilTool.getCurrentDataTime());
            resolve('查询来访嘉宾——所在单位关系出错' + utilTool.getCurrentDataTime());
        });
};


//来访嘉宾——所在单位的创建操作
let visitorVisitDeptInit = function (bodyData, driver) {
    return new Promise(resolve => {
        const session = driver.session();
        relationIterator(bodyData, 0, session, resolve)
    });
};


/**
 * 获取所有来访嘉宾——所在单位的所有关系数据
 * @param driver
 */
let getAllVisitorVisitorDeptLink = function (driver) {
    return new Promise(resolve => {
        const session = driver.session();
        let visitorVisitorDeptLink = [];
        session.run('match (v:Visitor)-[n:Visitor_Visitor_Dept]->(d:Visitor_Dept) return properties(n) as result, v.unique_id as source, d.unique_id as target')
            .subscribe({
                onNext: record => {
                    visitorVisitorDeptLink.push({
                        'source': record.get('source'),
                        'target': record.get('target'),
                        'attach': record.get('result'),
                        'label_name':'visitor_visitor_dept'
                    });
                },
                onCompleted: () => {
                    resolve(visitorVisitorDeptLink);
                },
                onError: error => {
                    console.error('getAllVisitorVisitDeptLink error', error);
                    resolve([]);
                }
            });
    });
};


module.exports = {
    visitorVisitDeptInit: visitorVisitDeptInit,
    getAllVisitorVisitorDeptLink: getAllVisitorVisitorDeptLink,
};





