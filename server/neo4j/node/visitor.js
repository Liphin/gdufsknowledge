/**
 * Created by Administrator on 2019/2/15.
 * 检查到访人员节点是否已创建，若尚未创建则进行创建该节点
 */
const uuidv1 = require('uuid/v1');
const utilTool = require('../../service/utilTool');

/**
 * 初始化到访人员节点的创建
 * @param nodeName
 * @param visitorArray
 * @param resolve
 * @param driver
 */
let initCheckNode = (nodeName, visitorArray, resolve, driver) => {

    //分别准备中文或英文名字数组，用于CQL语句中的IN操作
    let tempVisitor = [], tempCnName = [], tempEnName = [];
    for (let i in visitorArray) {
        tempCnName.push(visitorArray[i]['cn_name']);
        tempEnName.push(visitorArray[i]['en_name']);
    }

    //查看是否有相关机构，若无则进行创建
    const session = driver.session();
    session.run('match (v:' + nodeName + ') where v.cn_name in $cn_name return v.cn_name as cn_name', {cn_name: tempCnName})
        .subscribe({
            onNext: record => {
                //装载已创建的来访人员节点数据到临时数组
                // tempVisitor.push({
                //     cn_name: record.get('cn_name'),
                //     en_name: record.get('en_name')
                // });
                tempVisitor.push(record.get('cn_name'));
            },
            onCompleted: () => {
                //通过filter方法获取尚未创建的来访人员数组数据
                let newVisitor = visitorArray.filter((item) => {
                    return !tempVisitor.includes(item['cn_name'])
                    ////如果搜索中文或英文均不包含则该来访人员尚未创建
                    // for(let i in tempVisitor){
                    //     if(tempVisitor[i]['cn_name'] == item['cn_name'] || tempVisitor[i]['en_name'] == item['en_name']){
                    //         return false
                    //     }
                    // }
                    // return true;
                });

                //若未创建的来访人员数量大于0则创建
                if (newVisitor.length > 0) {
                    //准备创建CQL拼接语句
                    let concatStr = 'create ';
                    for (let i in newVisitor) {
                        concatStr += "(:" + nodeName + "{cn_name:'" + newVisitor[i]['cn_name'] + "', en_name:'" + newVisitor[i]['en_name'] +
                            "', title: '" + newVisitor[i]['title'] + "', unique_id: '" + uuidv1() + "'})";
                        if (i < newVisitor.length - 1) {
                            concatStr += ","
                        }
                    }

                    //执行创建新来访人员节点操作
                    console.log('run create visitor script: \n' + concatStr);
                    session.run(concatStr)
                        .subscribe({
                            //成功返回
                            onCompleted: () => {
                                console.log("create new visitor complete");
                                session.close();
                                resolve(200);
                            },
                            //失败返回
                            onError: error => {
                                console.error(error, '6', utilTool.getCurrentDataTime());
                                resolve('创建新的到访人节点出错' + utilTool.getCurrentDataTime());
                            }
                        })

                } else {
                    //若无新来访人员需创建则直接返回成功
                    session.close();
                    resolve(200);
                }
            },
            onError: error => {
                console.error(error, '7', utilTool.getCurrentDataTime());
                resolve('查看到访人员节点出错' + utilTool.getCurrentDataTime());
            }
        });
};


//visitor的设置操作
let visitorInitCheck = function (bodyData, driver) {
    return new Promise(resolve => {
        //分别获取交流人员的中英文名字
        let visitorArray = [];
        for (let i in bodyData['visitor']) {
            visitorArray.push({
                'cn_name': bodyData['visitor'][i]['cn_name'],
                'en_name': bodyData['visitor'][i]['en_name'],
                'title': bodyData['visitor'][i]['title']
            });
        }
        initCheckNode('Visitor', visitorArray, resolve, driver)
    });
};


/**
 * 搜索广外外事来访人员或出访接待人员
 * @param visitData
 * @param driver
 */
let searchVisitorNode = function (visitData, driver) {
    return new Promise(resolve => {
        const session = driver.session();
        let visitorData = [];
        session.run('match (n:Visitor) where n.cn_name=~$cn_name or n.en_name=~$en_name return distinct properties(n) as result',
            {cn_name: '.*' + visitData + '.*', en_name: '.*' + visitData + '.*'})
            .subscribe({
                onNext: record => {
                    visitorData.push(record.get('result'));
                },
                onCompleted: () => {
                    resolve({
                        status: 200,
                        type: 'visitor',
                        data: visitorData
                    });
                },
                onError: error => {
                    resolve({
                        status: 400,
                        type: 'visitor'
                    });
                }
            });
    });
};


/**
 * 根据来访嘉宾信息获取到访的事件数据
 * @param uniqueId
 * @param driver
 */
let getVisitorEvent = function (uniqueId, driver) {
    return new Promise(resolve => {
        const session = driver.session();
        let visitEvents = [];
        session.run('match (v:Visitor)-[:Visitor_Visit_Event]->(n:Visit_Event) where v.unique_id=$unique_id return distinct properties(n) as result',
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
 * 获取所有来访者节点数据
 * @param driver
 */
let getAllVisitorNode = function (driver) {
    return new Promise(resolve => {
        const session = driver.session();
        let visitNodes = [];
        session.run('match (n:Visitor) return properties(n) as result')
            .subscribe({
                onNext: record => {
                    visitNodes.push(record.get('result'));
                },
                onCompleted: () => {
                    resolve(visitNodes);
                },
                onError: error => {
                    console.error('getAllVisitorNode error', error);
                    resolve([]);
                }
            });
    });
};


module.exports = {
    visitorInitCheck: visitorInitCheck,
    searchVisitorNode: searchVisitorNode,
    getVisitorEvent: getVisitorEvent,
    getAllVisitorNode:getAllVisitorNode,
};





