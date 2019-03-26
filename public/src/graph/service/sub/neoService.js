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

            //记录第一次所有节点及关系数据
            GraphDataSer.allNodeLinkData['array'] = angular.copy(GraphDataSer.neoData); //拷贝一个副本，当neoData变化后保持不变
            GraphDataSer.allNodeLinkData['obj'] = angular.copy(GraphDataSer.neoNodeDataObj); //拷贝一个副本，当neoNodeDataObj变化后保持不变

            //初始化节点渲染到页面svg
            NodeLinkSer.nodeLinkInit();

        }, GraphDataSer.loader['nodeLinks'])
    }


    /**
     * 解析neo4j数据，并渲染到页面中
     * @param result
     */
    function parseNeoData(result) {
        //转换节点为以unique_id为key的对象，用于后续查找节点
        for (let i in result['nodes']) {
            result['nodes'][i]['textShow'] = false;
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

            let tempRadius = 22 + Math.round(GraphDataSer.neoNodeDataObj[k]['degree']);
            GraphDataSer.neoNodeDataObj[k]['radius'] = (tempRadius > 60 ? 60 : tempRadius); //最大的半径不能大于60
            //GraphDataSer.neoNodeDataObj[k]['radius'] = 22 + Math.round(GraphDataSer.neoNodeDataObj[k]['degree']);
            GraphDataSer.neoNodeDataObj[k]['distance'] = 50 + Math.round(GraphDataSer.neoNodeDataObj[k]['degree'] * 0.5);
        }
        //装载返回节点数据
        GraphDataSer.neoData = result;
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
            case "infoDetail": {
                //调用展示节点信息详情方法
                NodeLinkSer.getNewsInfo();
                break;
            }
            case "relativeAttendee": {
                getRelativeAttendee();
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
     * 获取相关与会人员信息
     */
    function getRelativeAttendee() {
        let uniqueId = GraphDataSer.overallData['nodeHover']['unique_id'];
        let type = GraphDataSer.overallData['nodeHover']['type'];
        let allLinks = angular.copy(GraphDataSer.allNodeLinkData['array']['links']);
        let targetNodeArray = [], targetLinkArray = [], tempNodeNameObj = {};

        switch (type) {
            //校内组织机构的外事出席人
            //部门-->出席人-->事件
            case 'gdufs_dept': {
                targetNodeArray.push(GraphDataSer.allNodeLinkData['obj'][uniqueId]); //初始化填充部门节点
                //循环每个链接，查看链接中attach的数据，从中获取外事出席人
                for (let j in allLinks) {
                    let link = allLinks[j];
                    let attach = link['attach'];
                    //如果没有附加数据则继续循环
                    if (!OverallGeneralSer.checkDataNotEmpty(attach)) continue;

                    try {
                        //解析出席人数据
                        let attendeeData = JSON.parse(attach['attend']);
                        //分别判断该链接的源是否与该校内单位节点相同，若相同则证明该链接关系与该节点相连。
                        //由于gdufs_dept只有出度关系，因此不用判断入度
                        if (uniqueId == link['source']) {
                            let eventUniqueId = '';
                            //若出访人不为空则添加出席人-->事件的关系
                            if (OverallGeneralSer.checkDataNotEmpty(attendeeData)) {
                                //由于校内单位相对事件必然为源节点，则添加该事件节点为目标节点
                                eventUniqueId = link['target'];
                                targetNodeArray.push(GraphDataSer.allNodeLinkData['obj'][link['target']]);

                                for (let j in attendeeData) {
                                    let attendeeUniqueId = '';//添加出席人的uniqueId
                                    //如果中文名称没有，则添加英文名称
                                    if(!OverallGeneralSer.checkDataNotEmpty(attendeeData[j]['cn_name'])) {
                                        attendeeData[j]['cn_name']=attendeeData[j]['en_name']
                                    }
                                    //若之前尚未添加以该出席人姓名的为key的节点，则添加
                                    if (!tempNodeNameObj.hasOwnProperty(attendeeData[j]['cn_name'])) {
                                        attendeeUniqueId = uuidv1();
                                        tempNodeNameObj[attendeeData[j]['cn_name']] = attendeeUniqueId;
                                        //添加出席人节点
                                        targetNodeArray.push({
                                            'cn_name': attendeeData[j]['cn_name'],
                                            'unique_id': attendeeUniqueId,
                                            'label_name': 'attendee'
                                        });

                                        //添加部门-->出席人关系
                                        targetLinkArray.push({
                                            'source': uniqueId,
                                            'target': attendeeUniqueId,
                                            'attach': {'unique_id': uuidv1()}
                                        });

                                    } else {
                                        //若之前已添加此出席人，则获取该出席人的unique_id值
                                        attendeeUniqueId = tempNodeNameObj[attendeeData[j]['cn_name']];
                                    }

                                    //添加出席人-->事件关系
                                    targetLinkArray.push({
                                        'source': attendeeUniqueId,
                                        'target': eventUniqueId,
                                        'attach': {'unique_id': uuidv1()}
                                    })
                                }
                            }
                        }

                    } catch (e) {
                        console.error('search add link err', e, link);
                    }
                }
                break;
            }
            //事件类型
            //部门-->出席人-->事件
            case 'visit_event': {
                targetNodeArray.push(GraphDataSer.allNodeLinkData['obj'][uniqueId]); //初始化填充事件节点
                //循环每个链接，查看链接中attach的数据，从中获取外事出席人
                for (let j in allLinks) {
                    let link = allLinks[j];
                    let attach = link['attach'];
                    //如果没有附加数据则继续循环
                    if (!OverallGeneralSer.checkDataNotEmpty(attach)) continue;

                    try {
                        //解析出席人数据
                        let attendeeData = JSON.parse(attach['attend']);
                        //分别判断该链接的目标是否与该事件节点相同，若相同则证明该链接关系与该节点相连。
                        //由于visit_event只有入度关系，因此不用判断出度
                        if (uniqueId == link['target']) {
                            //若出访人不为空则添加事件<--部门<--出席人的关系
                            if (OverallGeneralSer.checkDataNotEmpty(attendeeData)) {
                                //1、添加该部门节点
                                targetNodeArray.push(GraphDataSer.allNodeLinkData['obj'][link['source']]);

                                //出席人遍历
                                for (let j in attendeeData) {
                                    let attendeeUniqueId = uuidv1(); //新创建该出席人节点的unique_id
                                    //如果中文名称没有，则添加英文名称
                                    if(!OverallGeneralSer.checkDataNotEmpty(attendeeData[j]['cn_name'])) {
                                        attendeeData[j]['cn_name']=attendeeData[j]['en_name']
                                    }
                                    tempNodeNameObj[attendeeData[j]['cn_name']] = attendeeUniqueId;
                                    //2、添加出席人节点
                                    targetNodeArray.push({
                                        'cn_name': attendeeData[j]['cn_name'],
                                        'unique_id': attendeeUniqueId,
                                        'label_name': 'attendee'
                                    });

                                    //3、添加部门-->出席人关系
                                    targetLinkArray.push({
                                        'source': link['source'],
                                        'target': attendeeUniqueId,
                                        'attach': {'unique_id': uuidv1()}
                                    });

                                    //4、添加出席人-->事件关系
                                    targetLinkArray.push({
                                        'source': attendeeUniqueId,
                                        'target': link['target'],
                                        'attach': {'unique_id': uuidv1()}
                                    });
                                }
                            }
                        }

                    } catch (e) {
                        console.error('search add link err', e, link);
                    }
                }
                break;
            }
            //部门-->出席人-->事件
            case 'visitor_dept': {
                targetNodeArray.push(GraphDataSer.allNodeLinkData['obj'][uniqueId]); //初始化填充部门节点
                //循环每个链接，查看链接中attach的数据，从中获取外事出席人
                for (let j in allLinks) {
                    let link = allLinks[j];
                    let attach = link['attach'];
                    //如果没有附加数据则继续循环
                    if (!OverallGeneralSer.checkDataNotEmpty(attach)) continue;

                    try {
                        //解析出席人数据
                        let attendeeData = JSON.parse(attach['attend']);
                        //分别判断该链接的源是否与该校内单位节点相同，若相同则证明该链接关系与该节点相连。
                        //由于 visitor_dept 或 gdufs_dept 只有出度关系，因此不用判断入度
                        if (uniqueId == link['source']) {
                            let eventUniqueId = '';
                            //若出访人不为空则添加出席人-->事件的关系
                            if (OverallGeneralSer.checkDataNotEmpty(attendeeData)) {
                                //由于单位或实体相对事件必然为源节点，则添加该事件节点为目标节点
                                eventUniqueId = link['target'];
                                targetNodeArray.push(GraphDataSer.allNodeLinkData['obj'][link['target']]);

                                for (let j in attendeeData) {
                                    let attendeeUniqueId = '';//添加出席人的uniqueId
                                    //如果中文名称没有，则添加英文名称
                                    if(!OverallGeneralSer.checkDataNotEmpty(attendeeData[j]['cn_name'])) {
                                        attendeeData[j]['cn_name']=attendeeData[j]['en_name']
                                    }
                                    //若之前尚未添加以该出席人姓名的为key的节点，则添加
                                    if (!tempNodeNameObj.hasOwnProperty(attendeeData[j]['cn_name'])) {
                                        attendeeUniqueId = uuidv1();
                                        tempNodeNameObj[attendeeData[j]['cn_name']] = attendeeUniqueId;
                                        //添加出席人节点
                                        targetNodeArray.push({
                                            'cn_name': attendeeData[j]['cn_name'],
                                            'unique_id': attendeeUniqueId,
                                            'label_name': 'attendee'
                                        });

                                        //添加部门-->出席人关系
                                        targetLinkArray.push({
                                            'source': uniqueId,
                                            'target': attendeeUniqueId,
                                            'attach': {'unique_id': uuidv1()}
                                        });

                                    } else {
                                        //若之前已添加此出席人，则获取该出席人的unique_id值
                                        attendeeUniqueId = tempNodeNameObj[attendeeData[j]['cn_name']];
                                    }

                                    //添加出席人-->事件关系
                                    targetLinkArray.push({
                                        'source': attendeeUniqueId,
                                        'target': eventUniqueId,
                                        'attach': {'unique_id': uuidv1()}
                                    })
                                }
                            }
                        }

                    } catch (e) {
                        console.error('search add link err', e, link);
                    }
                }
                break;
            }
        }

        console.log(targetNodeArray);
        console.log(targetLinkArray);
        parseNeoData({
            'nodes': targetNodeArray,
            'links': targetLinkArray
        });

        //初始化节点渲染到页面svg
        NodeLinkSer.nodeLinkInit();

    }


    /**
     * 搜索对应的节点信息
     */
    function searchTargetNodes() {
        let targetText = GraphDataSer.overallData['search']['text'];
        let targetNodeArray = [], targetLinkArray = [], tempNodeUniqueIdArray = [];
        let allNodes = angular.copy(GraphDataSer.allNodeLinkData['array']['nodes']);
        let allLinks = angular.copy(GraphDataSer.allNodeLinkData['array']['links']);

        //只有搜索内容不为空时才进行搜索
        if(OverallGeneralSer.checkDataNotEmpty(targetText)){
            //1、搜索部门和事件相关节点
            for (let i in allNodes) {
                let node = allNodes[i];
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
                for (let j in allLinks) {
                    let link = allLinks[j];
                    try {
                        let sourceExist = tempNodeUniqueIdArray.indexOf(link['source']);
                        let targetExist = tempNodeUniqueIdArray.indexOf(link['target']);
                        if (sourceExist > -1 || targetExist > -1) {
                            if (sourceExist > -1 && targetExist <= -1) {
                                targetNodeArray.push(GraphDataSer.allNodeLinkData['obj'][link['target']]);

                            } else if (sourceExist <= -1 && targetExist > -1) {
                                targetNodeArray.push(GraphDataSer.allNodeLinkData['obj'][link['source']]);
                            }
                            targetLinkArray.push({
                                'source': link['source'],
                                'target': link['target'],
                                'attach': link['attach']
                            })
                        }

                    } catch (e) {
                        console.error('search add link err', e, link);
                    }
                }
            }

            //搜索人物信息
            let teachObj = {}, eventSet = new Set();
            for (let k in allLinks) {
                let link = allLinks[k];
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
                                teachObj[tempArray[h]['cn_name']].push(link['target']);
                            } else {
                                teachObj[tempArray[h]['cn_name']] = [link['target']]
                            }
                            //添加该事件的unique_id到不重复的set数组中
                            eventSet.add(link['target']);
                        }
                    }
                } catch (e) {
                    console.error('search people add node err', e, link);
                }
            }

            //添加相关的事件节点
            for (let item of eventSet.values()) {
                //如果之前尚未添加过则添加此节点信息
                if (tempNodeUniqueIdArray.indexOf(item) <= -1) {
                    targetNodeArray.push(GraphDataSer.allNodeLinkData['obj'][item])
                }
            }

            //添加人员节点到节点并与事件节点进行链接
            for (let i in teachObj) {
                let uniqueId = uuidv1();
                targetNodeArray.push({
                    'cn_name': i,
                    'unique_id': uniqueId,
                    'label_name': 'attendee'
                });
                for (let j in teachObj[i]) {
                    targetLinkArray.push({
                        'source': uniqueId,
                        'target': teachObj[i][j],
                        'attach': {'unique_id': uuidv1()}
                    })
                }
            }
        }
        //若搜索为空，则返回之前的所有数据重新渲染
        else{
            targetNodeArray = allNodes;
            targetLinkArray = allLinks
        }

        //console.log(targetNodeArray);
        //分别设置节点和链接数据至渲染数组中
        parseNeoData({
            'nodes': targetNodeArray,
            'links': targetLinkArray
        });

        //初始化节点渲染到页面svg
        NodeLinkSer.nodeLinkInit();
    }


    return {
        getNeoData: getNeoData,
        chooseNodeMenu: chooseNodeMenu,
        chooseNewsShow: chooseNewsShow,
        searchTargetNodes: searchTargetNodes,
    }
});
