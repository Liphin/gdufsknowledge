/**
 * Created by Administrator on 2019/2/15.
 * 检查来访交流机构/部门/学校节点是否已创建，若尚未创建则直接创建该节点
 */
const uuidv1 = require('uuid/v1');
const utilTool = require('../../service/utilTool');


let initDeptNode = function (nodeName, deptArray, resolve, driver) {
    //准备中文名字数组，用于CQL语句中的IN操作
    let tempDept = [], tempCnName = [];
    for (let i in deptArray) {
        tempCnName.push(deptArray[i]['cn_name']);
    }

    //查看是否有相关机构，若无则进行创建
    const session = driver.session();
    session.run('match (v:' + nodeName + ') where v.cn_name in $cn_name return v.cn_name as cn_name', {cn_name: tempCnName})
        .subscribe({
            onNext: record => {
                //装载已创建的单位节点数据到临时数组
                tempDept.push(record.get('cn_name'));
            },
            onCompleted: () => {
                //通过filter方法获取尚未创建的单位数组数据
                let deptData = deptArray.filter((item) => {
                    return !tempDept.includes(item['cn_name'])
                });

                //去重，去除数组中原有的重复名称的部门数据
                let newDept = [];
                for (let i in deptData) {
                    let toAdd = true;
                    for (let j in newDept) {
                        if (newDept[j]['cn_name'] == deptData[i]['cn_name']) {
                            toAdd = false;
                            break;
                        }
                    }
                    if (toAdd) newDept.push(deptData[i])
                }

                //若未创建的单位数量大于0则创建
                if (newDept.length > 0) {
                    //准备创建CQL拼接语句
                    let concatStr = 'create ';
                    for (let i in newDept) {
                        concatStr += "(:" + nodeName + "{cn_name:'" + newDept[i]['cn_name'] +
                            "', nation: '" + newDept[i]['nation'] + "', unique_id: '" + uuidv1() + "'})";
                        if (i < newDept.length - 1) {
                            concatStr += ","
                        }
                    }

                    //执行创建新单位节点操作
                    console.log('run create dept script: \n' + concatStr);
                    session.run(concatStr)
                        .subscribe({
                            //成功返回
                            onCompleted: () => {
                                console.log("create new dept complete");
                                session.close();
                                resolve(200);
                            },
                            //失败返回
                            onError: error => {
                                console.error(error, '6', utilTool.getCurrentDataTime());
                                resolve('创建新的单位节点出错' + utilTool.getCurrentDataTime());
                            }
                        })

                } else {
                    //若无新单位需创建则直接返回成功
                    session.close();
                    resolve(200);
                }
            },
            onError: error => {
                console.error(error, '7', utilTool.getCurrentDataTime());
                resolve('查看单位节点出错' + utilTool.getCurrentDataTime());
            }
        });
};


/**
 * 初始化来访单位机构/部门/学校节点的创建
 * @param bodyData
 * @param driver
 * @returns {Promise}
 */
let deptInitCheck = function (bodyData, driver) {
    return new Promise(resolve => {
        initDeptNode('Visitor_Dept', bodyData['visitor_dept'], resolve, driver)
    });
};


/**
 * 搜索广外外事交流单位节点
 * @param visitData
 * @param driver
 */
let searchVisitDeptNode = function (visitData, driver) {
    return new Promise(resolve => {
        const session = driver.session();
        let visitorDeptData = [];
        session.run('match (n:Visitor_Dept) where n.cn_name=~$cn_name or n.en_name=~$en_name or n.nation=~$nation return distinct properties(n) as result',
            {cn_name: '.*' + visitData + '.*', en_name: '.*' + visitData + '.*', nation: '.*' + visitData + '.*'})
            .subscribe({
                onNext: record => {
                    visitorDeptData.push(record.get('result'));
                },
                onCompleted: () => {
                    resolve({
                        status: 200,
                        type: 'visitor_dept',
                        data: visitorDeptData
                    });
                },
                onError: error => {
                    resolve({
                        status: 400,
                        type: 'visitor_dept'
                    });
                }
            });
    });
};


/**
 * 根据单位信息获取来访或到访的事件数据
 * @param uniqueId
 * @param driver
 */
let getVisitorDeptEvent = function (uniqueId, driver) {
    return new Promise(resolve => {
        const session = driver.session();
        let visitEvents = [];
        session.run('match (vd:Visitor_Dept)<-[:Visitor_Visitor_Dept]-(:Visitor)-[:Visitor_Visit_Event]->(n:Visit_Event) where vd.unique_id=$unique_id return distinct properties(n) as result',
            {unique_id: uniqueId})
            .subscribe({
                onNext: record => {
                    visitEvents.push(record.get('result'));
                },
                onCompleted: () => {
                    resolve(visitEvents.sort(utilTool.neo4jSortDate));
                },
                onError: error => {
                    resolve({
                        error: error,
                        status: 400,
                    });
                }
            });
    });
};


/**
 * 获取所有来访合作机构节点数据
 * @param driver
 */
let getAllVisitDeptNode = function (driver) {
    return new Promise(resolve => {
        const session = driver.session();
        let visitDeptNodes = [];
        session.run('match (n:Visitor_Dept) return properties(n) as result')
            .subscribe({
                onNext: record => {
                    let result = record.get('result');
                    result['label_name']='visitor_dept';
                    result['hover_title']=result['cn_name'];
                    visitDeptNodes.push(result);
                },
                onCompleted: () => {
                    resolve(visitDeptNodes);
                },
                onError: error => {
                    console.error('getAllVisitDeptNode error', error);
                    resolve([]);
                }
            });
    });
};


module.exports = {
    deptInitCheck: deptInitCheck,
    searchVisitDeptNode: searchVisitDeptNode,
    getVisitorDeptEvent: getVisitorDeptEvent,
    getAllVisitDeptNode: getAllVisitDeptNode,
};





