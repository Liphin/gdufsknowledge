/**
 * Created by Administrator on 2019/2/15.
 * 直接创建来访交流事件节点
 */
const uuidv1 = require('uuid/v1');
const utilTool = require('../../service/utilTool');

/**
 * 初始化来访事件节点的创建
 * @param bodyData
 * @param driver
 * @returns {Promise}
 */
let visitEventInitCheck = function (bodyData, driver) {
    return new Promise(resolve => {

        //分别准备创建来访事件节点CQL和数据数组
        let queryStr = 'create (:Visit_Event{ type:$type, cover:$cover, time:$time, timestamp:$timestamp, place:$place, origin_url:$origin_url, title:$title, theme:$theme, abstract:$abstract, unique_id:$unique_id })';
        let queryArray = {
            type: bodyData['type'],
            cover: bodyData['cover'],
            title: bodyData['title'],
            time: bodyData['time'],
            timestamp: bodyData['timestamp'],
            place: bodyData['place'],
            origin_url: bodyData['origin_url'],
            theme: bodyData['theme'],
            abstract: bodyData['abstract'],
            unique_id: bodyData['unique_id']
        };

        //初始化session连接并执行新建操作
        const session = driver.session();
        session.run(queryStr, queryArray)
            .subscribe({
                //成功创建返回success并关闭连接
                onCompleted: () => {
                    console.log('create new visit event complete');
                    session.close();
                    resolve(200);
                },
                //创建有误返回failure
                onError: error => {
                    console.error(error, '5', utilTool.getCurrentDataTime());
                    resolve('创建新的事件节点出错' + utilTool.getCurrentDataTime());
                }
            })
    });
};


/**
 * 搜索广外来访事件节点
 * @param visitData
 * @param driver
 */
let searchVisitEventNode = function (visitData, driver) {
    return new Promise(resolve => {
        const session = driver.session();
        let visitEventData = [];
        session.run('match (n:Visit_Event) where n.theme=~$theme or n.abstract=~$abstract return distinct properties(n) as result',
            {theme: '.*' + visitData + '.*', abstract: '.*' + visitData + '.*'})
            .subscribe({
                onNext: record => {
                    visitEventData.push(record.get('result'));
                },
                onCompleted: () => {
                    resolve(visitEventData.sort(utilTool.neo4jSortDate));
                },
                onError: error => {
                    resolve({
                        status: 400,
                        type: 'visit_event'
                    });
                }
            });
    });
};


module.exports = {
    visitEventInitCheck: visitEventInitCheck,
    searchVisitEventNode: searchVisitEventNode
};





