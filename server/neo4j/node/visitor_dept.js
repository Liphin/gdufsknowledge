/**
 * Created by Administrator on 2019/2/15.
 * 检查来访交流机构/部门/学校节点是否已创建，若尚未创建则直接创建该节点
 */
const uuidv1 = require('uuid/v1');
const utilTool = require('../../service/utilTool');

/**
 * 初始化来访机构/部门/学校节点的创建
 * @param bodyData
 * @param driver
 * @returns {Promise}
 */
let deptInitCheck = function (bodyData, driver) {
    //返回异步Promise回调
    return new Promise(resolve => {

        //检查该机构节点是否已存在
        const session = driver.session();
        session.run('match (vd:Visitor_Dept) where vd.cn_name=$cn_name return vd.cn_name as cn_name', {cn_name: bodyData['visitor_dept']['cn_name']})
            .then(result => {
                //如果该机构节点不存在则新建该节点
                if (result.records.length <= 0) {
                    //分别准备创建该机构的CQL查询语句及数据
                    let queryStr = 'create (:Visitor_Dept{ cn_name:$cn_name, nation:$nation, unique_id:$unique_id })';
                    let queryData = {
                        cn_name: bodyData['visitor_dept']['cn_name'],
                        nation: bodyData['visitor_dept']['nation'],
                        unique_id: uuidv1() //唯一标识符
                    };

                    //执行新建机构节点
                    session.run(queryStr, queryData)
                        .subscribe({
                            //完成后关闭连接并返回success
                            onCompleted: () => {
                                console.log('create new dept complete');
                                session.close();
                                resolve(200);
                            },
                            //出现错误返回failure
                            onError: error => {
                                console.error(error, '4', utilTool.getCurrentDataTime());
                                resolve('创建新的来访机构出错' + utilTool.getCurrentDataTime());
                            }
                        })
                }
                //如果该机构已存在则返回成功
                else {
                    session.close();
                    resolve(200);
                }
            })
            .catch(error => {
                console.error(error, '3', utilTool.getCurrentDataTime());
                resolve('查看是否有已有来访机构出错' + utilTool.getCurrentDataTime());
            });
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
        session.run('match (n:Visitor_Dept) where n.cn_name=~$cn_name or n.en_name=~$en_name or n.nation=~$nation return properties(n) as result',
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
                    resolve(visitEvents);
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


module.exports = {
    deptInitCheck: deptInitCheck,
    searchVisitDeptNode: searchVisitDeptNode,
    getVisitorDeptEvent: getVisitorDeptEvent,
};





