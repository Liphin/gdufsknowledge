/**
 * Created by Administrator on 2019/2/15.
 * 创建广外接待部门节点与来访事件节点的关系
 */
const uuidv1 = require('uuid/v1');
const utilTool = require('../../service/utilTool');

/**
 * 递归创建广外接待部门节点与来访事件节点的关系
 * @param bodyData
 * @param index
 * @param session
 * @param resolve
 */
let relationIterator = function (bodyData, index, session, resolve) {

    let attendValue = '';
    //如果attend人员为空则无该字段，此时应返回一个空的字符串[]
    if (utilTool.checkDataNotEmpty(bodyData['gdufs_dept'][index]['attend'])) {
        attendValue = JSON.stringify(bodyData['gdufs_dept'][index]['attend'])
    } else {
        attendValue = JSON.stringify([]);
    }

    //创建广外领导教师——到访接待事件关系的CQL与数据集
    let queryStr = 'match (gd:Gdufs_Dept), (ve:Visit_Event) where gd.cn_name=$cn_name and ve.unique_id=$unique_id_1 ';
    queryStr += 'create (gd)-[n:Gdufs_Dept_Visit_Event{ attend: $attend, unique_id:$unique_id_2 }]->(ve)';
    let queryData = {
        cn_name: bodyData['gdufs_dept'][index]['cn_name'],
        unique_id_1: bodyData['unique_id'],
        attend: attendValue,
        unique_id_2: uuidv1() //每个关系均有唯一标识符属性字段
    };

    session.run(queryStr, queryData)
        .subscribe({
            onCompleted: () => {
                //递归变量每个广外接待部门分别与来访事件进行连接
                if (index < bodyData['gdufs_dept'].length - 1) {
                    relationIterator(bodyData, ++index, session, resolve)
                }
                //所有教师递归完成后返回success
                else {
                    console.log('create new gdufs_dept & visit_event relation complete');
                    session.close();
                    resolve(200);
                }
            },
            onError: error => {
                console.log(error, '8', utilTool.getCurrentDataTime())
                resolve('创建广外接待部门——接待事项关系出错' + utilTool.getCurrentDataTime());
            }
        })
};


//广外接待部门——来访事件关系的创建操作
let gdufsDeptVisitEventInit = function (bodyData, driver) {
    return new Promise(resolve => {
        const session = driver.session();
        relationIterator(bodyData, 0, session, resolve)
    });
};


/**
 * 获取所有广外部门——接待来访事件的所有关系数据
 * @param driver
 */
let getAllGdufsDeptVisitEventLink = function (driver) {
    return new Promise(resolve => {
        const session = driver.session();
        let gdufsDeptVisitEventLink = [];
        session.run('match (g:Gdufs_Dept)-[n:Gdufs_Dept_Visit_Event]->(e:Visit_Event) return properties(n) as result, g.unique_id as source, e.unique_id as target')
            .subscribe({
                onNext: record => {
                    gdufsDeptVisitEventLink.push({
                        'source': record.get('source'),
                        'target': record.get('target'),
                        'attach': record.get('result'),
                        'label_name': 'gdufs_dept_visit_event'
                    });
                },
                onCompleted: () => {
                    resolve(gdufsDeptVisitEventLink);
                },
                onError: error => {
                    console.error('getAllGdufsDeptVisitEventLink error', error);
                    resolve([]);
                }
            });
    });
};


module.exports = {
    gdufsDeptVisitEventInit: gdufsDeptVisitEventInit,
    getAllGdufsDeptVisitEventLink: getAllGdufsDeptVisitEventLink,
};





