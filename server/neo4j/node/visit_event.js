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
        let queryStr = 'create (:Visit_Event{ type:$type, cover:$cover, time:$time, timestamp:$timestamp, origin_url:$origin_url, title:$title, key_word:$key_word, unique_id:$unique_id })';
        let queryArray = {
            type: bodyData['type'],
            cover: bodyData['cover'],
            title: bodyData['title'],
            time: bodyData['time'],
            timestamp: bodyData['timestamp'],
            origin_url: bodyData['origin_url'],
            key_word: bodyData['key_word'],
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


/**
 * 获取所有来访合作机构节点数据
 * @param driver
 */
let getAllVisitEventNode = function (driver) {
    return new Promise(resolve => {
        const session = driver.session();
        let visitEventNodes = [];
        session.run('match (n:Visit_Event) return properties(n) as result')
            .subscribe({
                onNext: record => {
                    let result = record.get('result');
                    //设置出访或来访事件类型
                    if (result['type'] == 2) {
                        result['label_name'] = 'visit_event_out';
                    } else {
                        result['label_name'] = 'visit_event_in';
                    }
                    result['hover_title']=result['title'];
                    visitEventNodes.push(result);
                },
                onCompleted: () => {
                    resolve(visitEventNodes);
                },
                onError: error => {
                    console.error('getAllVisitEventNode error', error);
                    resolve([]);
                }
            });
    });
};


module.exports = {
    visitEventInitCheck: visitEventInitCheck,
    searchVisitEventNode: searchVisitEventNode,
    getAllVisitEventNode: getAllVisitEventNode,
};





