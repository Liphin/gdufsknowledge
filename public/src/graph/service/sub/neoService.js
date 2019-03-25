/**
 * Created by Administrator on 2019/2/14.
 * neo4j数据的http请求操作等
 */
var graphModule = angular.module('Angular.graph');

graphModule.factory('NeoSer', function ($sce, $rootScope, OverallDataSer, GraphDataSer, $cookies, $location, $http, OverallGeneralSer, NodeLinkSer) {

    /**
     * 获取所有neo4j数据库中的数据
     */
    function getNeoData() {
        OverallGeneralSer.httpPostData3({}, OverallDataSer.urlData['frontEndHttp']['getAllNodeAndLinksData'], function (result) {
            //解析neo4j数据，并渲染到页面中
            parseNeoData(result);

        }, GraphDataSer.loader['nodeLinks'])
    }


    /**
     * 解析neo4j数据，并渲染到页面中
     * @param result
     */
    function parseNeoData(result) {
        //转换节点为以unique_id为key的对象，用于后续查找节点
        for (let i in result['nodes']) {
            result['nodes'][i]['index'] = i;
            result['nodes'][i]['degree'] = 0; //记录入度和出度的数目，用来计算节点的大小
            GraphDataSer.neoNodeDataObj[result['nodes'][i]['unique_id']] = result['nodes'][i]
        }
        //通过关系Links计算每个节点的度数，入度数和出度数
        for (let j in result['links']) {
            GraphDataSer.neoNodeDataObj[result['links'][j]['source']]['degree']++
            GraphDataSer.neoNodeDataObj[result['links'][j]['target']]['degree']++
        }
        //设置每个节点的radius
        for (let k in GraphDataSer.neoNodeDataObj) {
            //GraphDataSer.neoNodeDataObj[k]['radius'] = 22 + Math.round(GraphDataSer.neoNodeDataObj[k]['degree']);
            let tempRadius = 22 + Math.round(GraphDataSer.neoNodeDataObj[k]['degree']);
            GraphDataSer.neoNodeDataObj[k]['radius'] = (tempRadius > 60 ? 60 : tempRadius); //最大的半径不能大于60
            GraphDataSer.neoNodeDataObj[k]['distance'] = 50 + Math.round(GraphDataSer.neoNodeDataObj[k]['degree'] * 0.5);
        }
        //装载返回节点数据
        GraphDataSer.neoData = result;

        // console.log('neodata',GraphDataSer.neoData);
        // console.log('neoobj', GraphDataSer.neoNodeDataObj);

        //初始化节点渲染到页面
        NodeLinkSer.nodeLinkInit();
    }


    /**
     * 根据uniqueId，从OSS中获取对应的新闻数据
     * @param uniqueId
     * @param type
     */
    function chooseNewsShow(uniqueId, type) {
        //保存选择的新闻子节点的openid
        GraphDataSer.overallData['nodeSelected']['sub_unique_id'] = uniqueId;
        //重置news数据
        GraphDataSer.nodeLinkSelectedData[type]['info']['detail']['newsDetail']['news'] = "";
        //打开具体新闻页面
        GraphDataSer.nodeLinkSelectedData[type]['info']['detail']['newsDetail']['status'] = true;
        //从OSS中获取对应新闻数据
        let url = OverallDataSer.urlData['frontEndHttp']['gdufsNewsOssUrl'] + "html/" + uniqueId + ".html";
        OverallGeneralSer.httpGetFiles(url, result => {
            GraphDataSer.nodeLinkSelectedData[type]['info']['detail']['newsDetail']['news'] = $sce.trustAsHtml(result);
        })
    }


    /**
     * 选择对应的节点的菜单项
     */
    function chooseNodeMenu(menuType) {
        //把该hover的节点数据传给选择数组
        GraphDataSer.overallData['nodeSelected']['unique_id'] = GraphDataSer.overallData['nodeHover']['unique_id'];
        GraphDataSer.overallData['nodeSelected']['type'] = GraphDataSer.overallData['nodeHover']['type'];
        //根据不同菜单类型执行不同操作
        switch (menuType) {
            case "newsDetail": {
                //调用展示节点信息详情方法
                NodeLinkSer.getNewsInfo();
                break;
            }
            case "relativePeople": {
                break;
            }
            default: {
                break;
            }
        }
        //菜单响应按键后，收回菜单
        GraphDataSer.overallData['nodeMenu']['status'] = false;
    }


    /**
     * 搜索对应的节点信息
     */
    function searchTargetNodes() {
        let targetText = GraphDataSer.overallData['search']['text'];
        let targetNodeArray = [], targetLinkArray = [], tempNodeUniqueIdArray = [];

        //1、搜索部门和事件相关节点
        for (let i in GraphDataSer.neoData['nodes']) {
            let node = GraphDataSer.neoData['nodes'][i];
            try {
                if (node['label_name'] == 'visit_event') {
                    //搜索visit_event节点中key_word, title
                    if (node['key_word'].indexOf(targetText) > -1 || node['title'].indexOf(targetText) > -1) {
                        targetNodeArray.push(node);
                        tempNodeUniqueIdArray.push(node['unique_id'])
                    }
                } else {
                    //搜索gdufs_dept节点中cn_name
                    //搜索visitor_dept节点中cn_name
                    if (node['cn_name'].indexOf(targetText) > -1) {
                        targetNodeArray.push(node);
                        tempNodeUniqueIdArray.push(node['unique_id'])
                    }
                }
            } catch (e) {
                console.error('search add node err', e, node);
            }
        }

        //2、如果前面搜索的部门和事件节点不为空则添加关系链接，否则搜索人物信息
        if (targetNodeArray.length > 0) {
            //遍历每个节点的关系
            for (let j in GraphDataSer.neoData['links']) {
                let link = GraphDataSer.neoData['links'][j];
                try {
                    let sourceExist = tempNodeUniqueIdArray.indexOf(link['source']['unique_id']);
                    let targetExist = tempNodeUniqueIdArray.indexOf(link['target']['unique_id']);
                    if (sourceExist > -1 || targetExist > -1) {
                        if (sourceExist > -1 && targetExist <= -1) {
                            targetNodeArray.push(link['target']);

                        } else if (sourceExist <= -1 && targetExist > -1) {
                            targetNodeArray.push(link['source']);
                        }
                        targetLinkArray.push({
                            'source': link['source']['unique_id'],
                            'target': link['target']['unique_id'],
                            'attach': link['attach']
                        })
                    }

                } catch (e) {
                    console.error('search add link err', e, link);
                }
            }
        }
        //搜索人物信息
        else {
            let teachObj = {}, eventSet = new Set();
            for (let k in GraphDataSer.neoData['links']) {
                let link = GraphDataSer.neoData['links'][k];
                //搜索attend，若不空则进行json解析，否则继续下一个
                let attend = link['attach']['attend'];
                if (!OverallGeneralSer.checkDataNotEmpty(attend)) {
                    continue;
                }
                let tempArray = JSON.parse(attend);
                try {
                    //遍历每个link的attach中的attend（出席人员），查看是否有相应的人员
                    for (let h in tempArray) {
                        //如果该名称为空则不进行查询，继续下一个节点
                        if (!OverallGeneralSer.checkDataNotEmpty(tempArray[h]['cn_name'])) continue;
                        //添加符合该教师名称的数据
                        if (tempArray[h]['cn_name'].indexOf(targetText) > -1) {
                            //如果该教师对象已添加该教师名称数据，则直接添加到数组，否则重新初始化
                            if (teachObj.hasOwnProperty(tempArray[h]['cn_name'])) {
                                teachObj[tempArray[h]['cn_name']].push(link['target']['unique_id']);
                            } else {
                                teachObj[tempArray[h]['cn_name']] = [link['target']['unique_id']]
                            }
                            //添加该事件的unique_id到不重复的set数组中
                            eventSet.add(link['target']['unique_id']);
                        }
                    }
                } catch (e) {
                    console.error('search people add node err', e, link);
                }
            }

            //添加相关的事件节点
            for (let item of eventSet.values()) {
                targetNodeArray.push(GraphDataSer.neoNodeDataObj[item])
            }

            //添加人员节点到节点并与事件节点进行链接
            for (let i in teachObj) {
                let uniqueId = uuidv1();
                targetNodeArray.push({
                    'cn_name': i,
                    'unique_id': uniqueId,
                    'label_name': 'people'
                });
                for (let j in teachObj[i]) {
                    targetLinkArray.push({
                        'source': uniqueId,
                        'target': teachObj[i][j]
                    })
                }
            }
        }

        console.log(targetNodeArray)
        console.log(targetLinkArray)
        //分别设置节点和链接数据至渲染数组中
        parseNeoData({
            'nodes':targetNodeArray,
            'links':targetLinkArray
        });


        //gdufs_dept_visit_event中的source和target是否有选择的unique_id
        //visitor_dept_visit_event中的source和target是否有选择的unique_id


        //搜索gdufs_dept_visit_event关系中的attend
        //搜索visitor_dept_visit_event关系中的attend

    }


    return {
        getNeoData: getNeoData,
        chooseNodeMenu: chooseNodeMenu,
        chooseNewsShow: chooseNewsShow,
        searchTargetNodes: searchTargetNodes,
    }
});
