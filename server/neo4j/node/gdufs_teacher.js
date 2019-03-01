/**
 * Created by Administrator on 2019/2/15.
 * 检查广外教师数组节点是否已创建，若已创建则正常返回，否则进行创建操作
 */
const uuidv1 = require('uuid/v1');
const utilTool = require('../../service/utilTool');

/**
 * 初始化广外教师节点的创建
 * @param nodeName
 * @param bodyData
 * @param resolve
 * @param driver
 */
let initCheckNode = (nodeName, bodyData, resolve, driver) => {
    //获取全部广外教师名称数据，用于查询图数据库中已存在的节点
    let teacherInfo = [], gdufsTeachArray = [], tempGdufsTeach = [];
    for (let i in bodyData['gdufs_teacher']) {
        gdufsTeachArray.push(bodyData['gdufs_teacher'][i]['cn_name']);
        teacherInfo.push({
            'cn_name': bodyData['gdufs_teacher'][i]['cn_name'],
            'title': bodyData['gdufs_teacher'][i]['title'],
        })
    }

    //查看是否有已有该教师节点
    const session = driver.session();
    session.run('match (v:' + nodeName + ') where v.cn_name in $gdufsTeach return v.cn_name as cn_name', {gdufsTeach: gdufsTeachArray})
        .subscribe({
            onNext: record => {
                //把已有的教师节点添加到临时数组中
                tempGdufsTeach.push(record.get('cn_name'));
            },
            onCompleted: () => {
                //通过比较临时数组和目标数组，获取尚未创建的广外教师数组数据
                let newGdufsTeach = teacherInfo.filter((item) => {
                    return !tempGdufsTeach.includes(item['cn_name']);
                });

                //如果有尚未创建的广外教师则进行创建
                if (newGdufsTeach.length > 0) {
                    let concatStr = 'create ';
                    for (let i in newGdufsTeach) {
                        concatStr += "(:" + nodeName + "{cn_name:'" + newGdufsTeach[i]['cn_name'] + "', title: '" + newGdufsTeach[i]['title']
                            + "', unique_id:'" + uuidv1() + "'})";
                        if (i < newGdufsTeach.length - 1) concatStr += ",";
                    }

                    console.log('run create new gdufs teach script: \n' + concatStr);
                    session.run(concatStr)
                        .subscribe({
                            onCompleted: () => {
                                console.log('create new gdufs teach complete');
                                session.close();
                                resolve(200);
                            },
                            onError: error => {
                                console.error(error, '2', utilTool.getCurrentDataTime());
                                resolve('创建广外新教师节点出错' + utilTool.getCurrentDataTime());
                            }
                        })

                } else {
                    session.close();
                    resolve(200);
                }
            },
            onError: error => {
                console.error(error, '1', utilTool.getCurrentDataTime());
                resolve('查看是否有已有广外教师节点出错' + utilTool.getCurrentDataTime());
            }
        });
};


//广外接待师生的设置操作
let gdufsTeachInitCheck = function (bodyData, driver) {
    return new Promise(resolve => {
        initCheckNode('Gdufs_Teacher', bodyData, resolve, driver)
    });
};


/**
 * 搜索广外对应教师的出访或接待来访记录
 * @param visitData
 * @param driver
 */
let searchTeacherVisitNode = function (visitData, driver) {
    return new Promise(resolve => {
        const session = driver.session();
        let gdufsTeacherData = [];
        session.run('match (n:Gdufs_Teacher) where n.cn_name=~$cn_name or n.en_name=~$en_name return distinct properties(n) as result',
            {cn_name: '.*' + visitData + '.*', en_name: '.*' + visitData + '.*'})
            .subscribe({
                onNext: record => {
                    gdufsTeacherData.push(record.get('result'));
                },
                onCompleted: () => {
                    resolve({
                        status: 200,
                        type: 'gdufs_teacher',
                        data: gdufsTeacherData
                    });
                },
                onError: error => {
                    resolve({
                        status: 400,
                        type: 'gdufs_teacher'
                    });
                }
            });
    });
};


/**
 * 根据学校接待教师或领导信息获取到访的事件数据
 * @param uniqueId
 * @param driver
 */
let getGdufsTeacherEvent = function (uniqueId, driver) {
    return new Promise(resolve => {
        const session = driver.session();
        let visitEvents = [];
        session.run('match (gt:Gdufs_Teacher)-[:Gdufs_Teacher_Visit_Event]->(n:Visit_Event) where gt.unique_id=$unique_id return distinct properties(n) as result',
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
 * 获取所有广外领导教师节点数据
 * @param driver
 */
let getAllGdufsTeacherNode = function (driver) {
    return new Promise(resolve => {
        const session = driver.session();
        let gdufsTeacherNodes = [];
        session.run('match (n:Gdufs_Teacher) return properties(n) as result')
            .subscribe({
                onNext: record => {
                    gdufsTeacherNodes.push(record.get('result'));
                },
                onCompleted: () => {
                    resolve(gdufsTeacherNodes);
                },
                onError: error => {
                    console.error('getAllGdufsTeacherNode error', error);
                    resolve([]);
                }
            });
    });
};


module.exports = {
    gdufsTeachInitCheck: gdufsTeachInitCheck,
    searchTeacherVisitNode: searchTeacherVisitNode,
    getGdufsTeacherEvent: getGdufsTeacherEvent,
    getAllGdufsTeacherNode: getAllGdufsTeacherNode,
};





