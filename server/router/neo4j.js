/**
 * Created by Administrator on 2018/12/30.
 */
const data = require('../data');
const express = require('express');
const uuidv1 = require('uuid/v1');
const request = require('request');
const router = express.Router();

//节点句柄
const gdufsDept = require('../neo4j/node/gdufs_dept');
const visitorDept = require('../neo4j/node/visitor_dept');
const visitEvent = require('../neo4j/node/visit_event');

//关系句柄
const gdufsDeptVisitEvent = require('../neo4j/relation/gdufs_dept_visit_event');
const visitorDeptVisitEvent = require('../neo4j/relation/visitor_dept_visit_event');

//其他加载及解析
const newsParse = require('../service/newsParse');
const utilTool = require('../service/utilTool');


/**
 * 添加广外外事新的关系节点和数据存储
 */
router.post('/addVisitNewsData', (req, res, next) => {
    //console.log('begin', utilTool.getCurrentDataTime());
    //从前台获取创建的请求数据
    let bodyData = req.body;
    bodyData['unique_id'] = uuidv1();

    //获取初始化neo图数据库句柄
    let driver = data.dbPool['neo4j'];

    //所有节点创建完成
    Promise.all([
        gdufsDept.deptInitCheck(bodyData, driver), //广外部门节点
        visitorDept.deptInitCheck(bodyData, driver), //来访单位节点
        visitEvent.visitEventInitCheck(bodyData, driver)] //来访事件节点
    ).then(([result1, result2, result3]) => {

        //若创建过程出错则立即返回，不再继续进行
        if (result1 == 200 && result2 == 200 && result3 == 200) {
            //各节点间关系的创建
            Promise.all([
                gdufsDeptVisitEvent.gdufsDeptVisitEventInit(bodyData, driver), //广外接待部门——来访事件关系
                visitorDeptVisitEvent.visitorDeptVisitEventInit(bodyData, driver)] //来访单位——来访事件关系

            ).then(([result4, result5]) => {

                if (result4 == 200 && result5 == 200) {
                    //1、把HTML文件存储到OSS中，异步操作，用于查看原文时使用
                    //newsParse.newsHttpRequestAndParse(bodyData);

                    //2、简单返回正确代码到前端即可
                    //console.log('end', utilTool.getCurrentDataTime());
                    res.send({status: 200});
                }
                else {
                    //console.log('print 2');
                    res.send({
                        status: 408,
                        result: [result4, result5]
                    });
                }
            });
        }
        else {
            //console.log('print 3');
            res.send({
                status: 407,
                result: [result1, result2, result3]
            });
        }
    });
});


// let bodyData = {
//     visitData: '的广军'
// };
// let driver = data.dbPool['neo4j'];
// const session = driver.session();
// let visitEvents = [];
// let nodeUniqueId = 'de996b40-4411-11e9-a85c-f9d7c56311d4';
// let nodeUniqueIdNewFrom = 'ea155211-43dd-11e9-a85c-f9d7c56311d4';
// session.run("MATCH (n1:Gdufs_Dept)-[r1:Gdufs_Dept_Visit_Event]->(n2:Visit_Event) WHERE n1.unique_id=$unique_id return properties(r1) as result, n2.unique_id as unique_idEV", {unique_id: nodeUniqueId})
//     .subscribe({
//         onNext: record => {
//             let result = record.get('result');//relationship联系
//             result['unique_id2'] = nodeUniqueId; //目标删除的节点unique_id
//             result['unique_idEV'] = record.get('unique_idEV');//事件unique_id
//             visitEvents.push(result);
//         },
//
//         onCompleted: () => {
//
//             //console.log(visitEvents)
//             for (let i in visitEvents) {
//                 console.log(visitEvents[i]);
//
//                 //console.log(visitEvents[i])
//                 session.run("MATCH (n1:Gdufs_Dept),(n2:Visit_Event) " +
//                     "WHERE n1.unique_id='" + nodeUniqueIdNewFrom + "' and n2.unique_id=$unique_idEV " +
//                     "CREATE (n1)-[r1:Gdufs_Dept_Visit_Event{unique_id:'" + uuidv1() + "', attend:$attend}]->(n2)", visitEvents[i])
//                     .subscribe({
//                         onNext: record => {
//                             //visitEvents.push(record.get('result'));
//                         },
//                         onCompleted: () => {
//                             console.log('success1')
//                         },
//                         onError: error => {
//                             console.log(error)
//                         }
//                     });
//
//                 session.run("match ()-[n1:Gdufs_Dept_Visit_Event]->() where n1.unique_id=$unique_id delete n1", visitEvents[i])
//                     .subscribe({
//                         onNext: record => {
//                             //visitEvents.push(record.get('result'));
//                         },
//                         onCompleted: () => {
//                             console.log('success2');
//
//                             session.run("match (n2:Gdufs_Dept) where n2.unique_id=$unique_id2 delete n2", visitEvents[i])
//                                 .subscribe({
//                                     onNext: record => {
//                                         //visitEvents.push(record.get('result'));
//                                     },
//                                     onCompleted: () => {
//                                         console.log('success3')
//                                     },
//                                     onError: error => {
//                                         console.log(error)
//                                     }
//                                 });
//                         },
//                         onError: error => {
//                             console.log(error)
//                         }
//                     });
//             }
//         },
//         onError: error => {
//             console.log(error)
//         }
//     });

// let driver = data.dbPool['neo4j'];
// let visitData = '波兰共和国驻华大使馆'
// Promise.all([
//     visitorDept.searchVisitDeptNode(visitData, driver)
// ]).then(([result1]) => {
//     console.log(result1)
// });


/**
 * 搜索相应的来访数据
 */
router.post('/searchVisitData', (req, res, next) => {
    //获取初始化neo图数据库句柄
    let driver = data.dbPool['neo4j'];

    //从前台获取创建的请求数据
    let bodyData = req['body']; //searchTypeValue、visitData
    let visitData = bodyData['visitData'];
    console.log('searchVisitData bodyData', bodyData);
    switch (bodyData['searchTypeValue']) {
        //人物搜索
        case '1': {
            Promise.all([
                gdufsTeacher.searchTeacherVisitNode(visitData, driver),
                visitor.searchVisitorNode(visitData, driver)
            ]).then(([result1, result2]) => {
                //直接返回结果到前端，若无数据或则结果状态为400，前端进行渲染解析
                res.send([result1, result2]);
            });
            break;
        }
        //事件搜索
        case '2': {
            Promise.all([
                visitEvent.searchVisitEventNode(visitData, driver)
            ]).then(([result1]) => {
                //事件搜索直接返回事件数组
                res.send(result1);
            });
            break;
        }
        //单位搜索
        case '3': {
            Promise.all([
                visitorDept.searchVisitDeptNode(visitData, driver)
            ]).then(([result1]) => {
                res.send([result1]);
            });
            break;
        }
        //其他情况直接返回
        default: {
            res.send(400);
            break;
        }
    }
});


/**
 * 获取搜索出来的详情数据
 */
router.post('/getDetailInfo', (req, res, next) => {
    //获取初始化neo图数据库句柄
    let driver = data.dbPool['neo4j'];

    //从前台获取创建的请求数据
    let bodyData = req['body']; //unique_id、type
    console.log('getDetailInfo bodyData', bodyData);
    let uniqueId = bodyData['unique_id'];
    switch (bodyData['type']) {
        //人物搜索
        case 'gdufs_teacher': {
            Promise.all([
                gdufsTeacher.getGdufsTeacherEvent(uniqueId, driver)
            ]).then(([result1]) => {
                //直接返回结果到前端，若无数据或则结果状态为400，前端进行渲染解析
                res.send(result1);
            });
            break;
        }
        //事件搜索
        case 'visitor': {
            Promise.all([
                visitor.getVisitorEvent(uniqueId, driver)
            ]).then(([result1]) => {
                res.send(result1);
            });
            break;
        }
        //单位搜索
        case 'visitor_dept': {
            Promise.all([
                visitorDept.getVisitorDeptEvent(uniqueId, driver)
            ]).then(([result1]) => {
                res.send(result1);
            });
            break;
        }
        //其他情况直接返回
        default: {
            console.log('unknown body type', bodyData['type'])
            res.sendStatus(400);
            break;
        }
    }
});


/**
 * 获取所有Gdufs_Teacher, Visitor, Visitor_Dept节点的数据
 */
router.post('/getAllFillData', (req, res, next) => {

    //获取初始化neo图数据库句柄
    let driver = data.dbPool['neo4j'];

    Promise.all([
        gdufsTeacher.getAllGdufsTeacherNode(driver), //广外接待领导和教师节点
        visitor.getAllVisitorNode(driver),//来访者节点
        visitorDept.getAllVisitDeptNode(driver)] //来访单位节点
    ).then(([result1, result2, result3]) => {
        res.send({
            'gdufs_teacher': result1,
            'visitor': result2,
            'visitor_dept': result3
        })
    });
});


/**
 * 更新节点信息数据
 */
router.post('/updateNodeInfo', (req, res, next) => {

    let driver = data.dbPool['neo4j'];
    let session = driver.session();
    let bodyData = req['body'];
    let cqlStr = '';

    //Visitor节点
    if (bodyData['type'] == 'visitor') {
        cqlStr = 'match (n:Visitor) where n.unique_id=$unique_id set n.profile=$profile, n.en_name=$en_name, n.cn_name=$cn_name, n.title=$title';
    }
    //Visitor_Dept节点
    else if (bodyData['type'] == 'visitor_dept') {
        cqlStr = 'match (n:Visitor_Dept) where n.unique_id=$unique_id set n.introduction=$introduction, n.nation=$nation, n.en_name=$en_name, n.cn_name=$cn_name';
    }
    console.log('data', bodyData['value']);
    //执行cql语句进行数据更新操作
    session.run(cqlStr, bodyData['value'])
        .subscribe({
            onCompleted: () => {
                res.sendStatus(200);
            },
            onError: error => {
                console.log('error', error);
                res.sendStatus(400);
            }
        });
});


/**
 * 获取所有节点和连接关系数据
 */
router.post('/getAllNodeAndLinksData', (req, res, next) => {
    let driver = data.dbPool['neo4j'];

    Promise.all([
        gdufsDept.getAllGdufsDeptNode(driver), //广外接待部门节点
        visitorDept.getAllVisitDeptNode(driver), //来访单位节点
        visitEvent.getAllVisitEventNode(driver), //来访事件节点
        gdufsDeptVisitEvent.getAllGdufsDeptVisitEventLink(driver), //广外接待部门——来访事件连接
        visitorDeptVisitEvent.getAllVisitorDeptVisitEventLink(driver)]//来访嘉宾所在单位——来访事件连接
    ).then(([result1, result2, result3, result4, result5]) => {
        let nodes = result1.concat(result2).concat(result3);
        let links = result4.concat(result5);
        res.send({
            'nodes': nodes,
            'links': links
        });
    });
});


/**
 * http请求获取全部广外知识图谱mysql中数据
 */
router.post('/getAllGdufsKnowledgeMysqlData', (req, res, next) => {
    res.send(data.gdufsKnowledgeTableData);
});


module.exports = router;










