/**
 * Created by Administrator on 2018/12/30.
 */
const data = require('../data');
const express = require('express');
const uuidv1 = require('uuid/v1');
const request = require('request');
const router = express.Router();

//节点句柄
const gdufsTeacher = require('../neo4j/node/gdufs_teacher');
const visitorDept = require('../neo4j/node/visitor_dept');
const visitEvent = require('../neo4j/node/visit_event');
const visitor = require('../neo4j/node/visitor');

//关系句柄
const gdufsTeacherVisitEvent = require('../neo4j/relation/gdufs_teacher_visit_event');
const visitorVisitDept = require('../neo4j/relation/visitor_visitor_dept');
const visitorVisitEvent = require('../neo4j/relation/visitor_visit_event');

//其他加载及解析
const newsParse = require('../service/newsParse');
const utilTool = require('../service/utilTool');


/**
 * 添加广外外事新的关系节点和数据存储
 */
router.post('/addVisitNewsData', (req, res, next) => {
    //从前台获取创建的请求数据
    let bodyData = req.body;
    bodyData['unique_id'] = uuidv1();

    //获取初始化neo图数据库句柄
    let driver = data.dbPool['neo4j'];

    //所有节点创建完成
    Promise.all([
        gdufsTeacher.gdufsTeachInitCheck(bodyData, driver), //广外接待领导和教师节点
        visitorDept.deptInitCheck(bodyData, driver), //来访单位节点
        visitEvent.visitEventInitCheck(bodyData, driver), //来访事件节点
        visitor.visitorInitCheck(bodyData, driver)] //来访者节点
    ).then(([result1, result2, result3, result4]) => {

        //若创建过程出错则立即返回，不再继续进行
        if (result1 == 200 && result2 == 200 && result3 == 200 && result4 == 200) {
            //各节点间关系的创建
            Promise.all([
                gdufsTeacherVisitEvent.gdufsTeacherVisitEventInit(bodyData, driver), //广外接待领导教师——来访事件关系
                visitorVisitDept.visitorVisitDeptInit(bodyData, driver), //来访嘉宾——所在单位关系
                visitorVisitEvent.visitorVisitEventInit(bodyData, driver)] //来访嘉宾——来访事件关系

            ).then(([result5, result6, result7]) => {

                if (result5 == 200 && result6 == 200 && result7 == 200) {
                    //1、把HTML文件存储到OSS中，异步操作，用于查看原文时使用
                    newsParse.newsHttpRequestAndParse(bodyData);

                    //2、简单返回正确代码到前端即可
                    //console.log('end', utilTool.getCurrentDataTime());
                    res.send({status: 200});
                }
                else {
                    //console.log('print 2');
                    res.send({
                        status: 408,
                        result: [result5, result6, result7]
                    });
                }
            });
        }
        else {
            //console.log('print 3');
            res.send({
                status: 407,
                result: [result1, result2, result3, result4]
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
// session.run('match (vd:Visitor_Dept)<-[:Visitor_Visitor_Dept]-(:Visitor)-[:Visitor_Visit_Event]->(n:Visit_Event) where vd.unique_id=$unique_id return distinct properties(n) as result',
//     {unique_id: '0114bb90-3335-11e9-b570-4b19d3f9054f'})
//     .subscribe({
//         onNext: record => {
//             visitEvents.push(record.get('result'));
//         },
//         onCompleted: () => {
//             console.log(visitEvents)
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
                gdufsTeacher.searchTeacherVisitNode(visitData,driver),
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
router.post('/getDetailInfo', (req, res, next) =>  {
    //获取初始化neo图数据库句柄
    let driver = data.dbPool['neo4j'];

    //从前台获取创建的请求数据
    let bodyData = req['body']; //unique_id、type
    console.log('getDetailInfo bodyData',bodyData);
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


module.exports = router;










