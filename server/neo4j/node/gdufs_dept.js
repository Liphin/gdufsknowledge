/**
 * Created by Administrator on 2019/2/15.
 * 广外部门实体节点的操作
 */
const uuidv1 = require('uuid/v1');
const utilTool = require('../../service/utilTool');


let initDeptNode = function (nodeName, deptArray, resolve, driver) {
    //准备中文名字数组，用于CQL语句中的IN操作
    let tempDeptCnName = [], tempDept = [];
    for (let i in deptArray) {
        tempDeptCnName.push(deptArray[i]['cn_name']);
    }

    //查看是否有相关机构，若无则进行创建
    const session = driver.session();
    session.run('match (v:' + nodeName + ') where v.cn_name in $cn_name return v.cn_name as cn_name', {cn_name: tempDeptCnName})
        .subscribe({
            onNext: record => {
                //装载已创建的广外部门节点数据到临时数组
                tempDept.push(record.get('cn_name'));
            },
            onCompleted: () => {
                //通过filter方法获取尚未创建的广外部门节点数据
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

                //若未创建的广外部门数量大于0则创建
                if (newDept.length > 0) {
                    //准备创建CQL拼接语句
                    let concatStr = 'create ';
                    for (let i in newDept) {
                        concatStr += "(:" + nodeName + "{cn_name:'" + newDept[i]['cn_name'] +
                            "', unique_id: '" + uuidv1() + "'})";
                        if (i < newDept.length - 1) {
                            concatStr += ","
                        }
                    }

                    //执行创建新单位节点操作
                    console.log('run create gdufs dept script: \n' + concatStr);
                    session.run(concatStr)
                        .subscribe({
                            //成功返回
                            onCompleted: () => {
                                console.log("create new gdufs dept complete");
                                session.close();
                                resolve(200);
                            },
                            //失败返回
                            onError: error => {
                                console.error(error, '6', utilTool.getCurrentDataTime());
                                resolve('创建新的广外部门节点出错' + utilTool.getCurrentDataTime());
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
                resolve('查看广外部门节点出错' + utilTool.getCurrentDataTime());
            }
        });
};


/**
 * 初始化广外部门节点
 * @param bodyData
 * @param driver
 * @returns {Promise}
 */
let deptInitCheck = function (bodyData, driver) {
    return new Promise(resolve => {
        //初始化广外教师所在部门节点
        initDeptNode('Gdufs_Dept', bodyData['gdufs_dept'], resolve, driver)
    });
};


/**
 * 获取所有广外部门节点数据
 * @param driver
 */
let getAllGdufsDeptNode = function (driver) {
    return new Promise(resolve => {
        const session = driver.session();
        let gdufsDeptNodes = [];
        session.run('match (n:Gdufs_Dept) return properties(n) as result')
            .subscribe({
                onNext: record => {
                    let result = record.get('result');
                    result['label_name'] = 'gdufs_dept';
                    result['hover_title']=result['cn_name'];
                    gdufsDeptNodes.push(result);
                },
                onCompleted: () => {
                    resolve(gdufsDeptNodes);
                },
                onError: error => {
                    console.error('getAllGdufsDeptNode error', error);
                    resolve([]);
                }
            });
    });
};


module.exports = {
    deptInitCheck: deptInitCheck,
    getAllGdufsDeptNode: getAllGdufsDeptNode,
};





