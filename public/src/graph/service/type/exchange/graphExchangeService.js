/**
 * Created by Administrator on 2019/3/27.
 * 新闻类型节点数据渲染
 */
var graphModule = angular.module('Angular.graph');

graphModule.factory('GraphExchangeSer', function ($sce, $timeout, $rootScope, $routeParams, OverallDataSer, OverallGeneralSer,
                                                  $location, $http, GraphNewsDataSer, GraphNewsSer, AnalyseDataSer, AnalyseSer) {

    /**
     * 获取所有neo4j数据库中的数据
     */
    function getNeoData() {
        //若用于分析的广外外事数据为空则重新获取，否则直接使用即可
        if (!OverallGeneralSer.checkDataNotEmpty(AnalyseDataSer.knowData)) {
            //获取广外知外事数据
            AnalyseSer.getAllGdufsKnowledgeAnalyseData(() => {
                //初始化交换生数据节点图谱
                initExchangeGraph();
            });
        }
        //初始化交换生数据节点图谱
        initExchangeGraph();

    }

    /**
     * 初始化广外外事交换生数据节点图谱
     */
    function initExchangeGraph() {
        //重新拷贝一份交换生原始数据，以免数据脏话
        let exchangeList = angular.copy(AnalyseDataSer.knowData['exchange_student_list']);
        //转换关系数据库list数据为图数据库d3展示数据
        parseListToGraph(exchangeList);

        let graphData = parseNeoData(result); //解析返回的数据

        //拷贝一个副本，当renderData变化后保持不变
        GraphNewsDataSer.allNodeLinkData.array = angular.copy(GraphNewsDataSer.renderData.array);
        GraphNewsDataSer.allNodeLinkData.obj = angular.copy(GraphNewsDataSer.renderData.obj);

        //初始化节点和关系图数据
        nodeLinkGraphInit(graphData);
    }


    /**
     * 转换关系数据库list数据为图数据库d3展示数据
     * @param data
     */
    function parseListToGraph(data) {
        for (let i in data) {

        }
    }


    /**
     * 节点和关系连接数据初始化
     */
    function nodeLinkGraphInit(graphData) {
        let svg = d3.select(".knowledgeSvg"); //图数据库展示
        let linkArray = d3.select(".links"); //连接数组
        let nodeArray = d3.select(".nodes"); //节点数组

        D3Service()
            .element(svg, linkArray, nodeArray)
            .nodeLinks(graphData.nodes, graphData.links, graphData.nodesObj)
            .d3Setting(GraphNewsDataSer.overallData.graphSetting, GraphNewsDataSer.nodeTypeSetting)
            .interaction(
                (d, i) => {
                    GraphNewsDataSer.overallData.nodeHover.status = true;
                    GraphNewsDataSer.overallData.nodeHover.unique_id = d.unique_id;
                    GraphNewsDataSer.overallData.nodeHover.type = d.label_name;
                    //console.log('enter', d, i);
                },
                (d, i) => {
                    GraphNewsDataSer.overallData.nodeHover.status = false;
                    //console.log('leave', d, i);
                },
                (d, i) => {
                    //存储当前选择的节点相关数据
                    GraphNewsDataSer.overallData.nodeSelected.unique_id = d.unique_id;
                    GraphNewsDataSer.overallData.nodeSelected.type = d.label_name;

                    //若热键按住ctrl+点击事件执行click回调
                    if (OverallDataSer.keyBoard['ctrl']) {
                        console.log('ctrl click')

                    } else {
                        //若开启其他节点灰化设置，且没有按下ctrl热键时，则设置其他节点灰化，只与之相关的节点展示颜色
                        if (GraphNewsDataSer.overallData.graphSetting.nodesGray) {
                            D3Service().setUnRelativeNodeGray(d, i, GraphNewsDataSer.nodeTypeSetting, graphData.links);
                        }
                    }
                }
            )
            .nodeLinkInit(); //最后才执行此创建步骤
    }


    /**
     * 解析neo4j数据，并渲染到页面中
     * @param result
     */
    function parseNeoData(result) {
        let nodes = result.nodes;
        let links = result.links;
        let nodesObj = {};
        //转换节点为以unique_id为key的对象，用于后续查找节点
        for (let i in nodes) {
            nodes[i]['index'] = i; //记录该节点所在nodes中的下标index
            nodes[i]['degree'] = 0; //记录入度和出度的数目，用来计算节点的大小
            nodesObj[nodes[i]['unique_id']] = nodes[i]
        }
        //通过关系Links计算每个节点的度数，入度数和出度数
        for (let j in links) {
            nodesObj[links[j]['source']]['degree']++;
            nodesObj[links[j]['target']]['degree']++;
        }
        //设置每个节点的radius
        for (let k in nodesObj) {
            let tempRadius = 22 + Math.round(nodesObj[k]['degree']);
            nodesObj[k]['radius'] = (tempRadius > 60 ? 60 : tempRadius); //最大的半径不能大于60
            nodesObj[k]['distance'] = 50 + Math.round(nodesObj[k]['degree'] * 0.5);
        }

        //赋值渲染到页面HTML中的节点数据和nodes对象
        GraphNewsDataSer.renderData.array.nodes = nodes;
        GraphNewsDataSer.renderData.array.links = links;
        GraphNewsDataSer.renderData.obj = nodesObj;

        return {
            nodes: nodes, //所有节点
            links: links, //所有关系连接
            nodesObj: nodesObj, //所有节点组成的对象
        }
    }


    /**
     * 根据uniqueId，从OSS中获取对应的新闻数据
     * @param uniqueId
     * @param type
     */
    function chooseNewsShow(uniqueId, type) {
        //保存选择的新闻子节点的openid
        GraphNewsDataSer.overallData['nodeSelected']['sub_unique_id'] = uniqueId;
        //重置news数据
        GraphNewsDataSer.nodeLinkSelectedData[type]['info']['detail']['newsDetail']['news'] = "";
        //打开具体新闻页面
        GraphNewsDataSer.nodeLinkSelectedData[type]['info']['detail']['newsDetail']['status'] = true;
        //从OSS中获取对应新闻数据
        let url = OverallDataSer.urlData['frontEndHttp']['gdufsNewsOssUrl'] + "html/" + uniqueId + ".html";
        OverallGeneralSer.httpGetFiles(url, result => {
            GraphNewsDataSer.nodeLinkSelectedData[type]['info']['detail']['newsDetail']['news'] = $sce.trustAsHtml(result);
        })
    }


    /**
     * 选择对应的节点的菜单项
     */
    function chooseNodeMenu(menuType) {
        //把该hover的节点数据传给选择数组
        GraphNewsDataSer.overallData['nodeSelected']['unique_id'] = GraphNewsDataSer.overallData['nodeHover']['unique_id'];
        GraphNewsDataSer.overallData['nodeSelected']['type'] = GraphNewsDataSer.overallData['nodeHover']['type'];

        //获取相应主节点信息，用于展示在header标题中
        let targetNode = GraphNewsDataSer.renderData['obj'][GraphNewsDataSer.overallData['nodeHover']['unique_id']];
        let infoText = '';
        switch (targetNode['label_name']) {
            case 'attendee': {
                infoText += '人物 “' + targetNode['cn_name'] + "” ";
                break;
            }
            case 'gdufs_dept': {
                infoText += '校内组织 “' + targetNode['cn_name'] + "” ";
                break;
            }
            case 'visitor_dept': {
                infoText += '外方实体 “' + targetNode['cn_name'] + "” ";
                break;
            }
            case 'visit_event_in': {
                infoText += '事件 “' + targetNode['title'] + "” ";
                break;
            }
            case 'visit_event_out': {
                infoText += '事件 “' + targetNode['title'] + "” ";
                break;
            }
        }

        //根据不同菜单类型执行不同操作
        switch (menuType) {
            //该节点的具体信息
            case "infoDetail": {
                //调用展示节点信息详情方法
                getNewsInfo();
                break;
            }
            //查询相关出席人
            case "relativeAttendee": {
                getRelativeAttendee();
                GraphNewsDataSer.overallData['graphPath']['layer2']['name'] = infoText + "相关人员子节点";
                break;
            }
            //人物节点的相关事件
            case "relativeEvent": {
                getRelativeEvent();
                GraphNewsDataSer.overallData['graphPath']['layer2']['name'] = infoText + "相关事件子节点";
                break;
            }
            default: {
                break;
            }
        }
        //菜单响应按键后，收回菜单
        GraphNewsDataSer.overallData['nodeMenu']['status'] = false;
    }


    /**
     *
     * @param type
     * @param uniqueId
     */
    function assignGeneralData(type, uniqueId) {
        //赋值基础数据
        let node = GraphNewsDataSer.renderData.obj[uniqueId];
        for (let i in node) {
            GraphNewsDataSer.nodeLinkSelectedData[type]['info']['general']['data'][i] = node[i];
        }
        //如果面板之前已经打开了，则无loading，如果之前尚未打开，则有loading
        if (!GraphNewsDataSer.overallData['rightBarShow']) {
            //面板展开时，信息尚未显示出来，loading加载
            GraphNewsDataSer.loader['nodeDetail']['status'] = true;
            //1秒后，动画消失，显示内容
            $timeout(function () {
                GraphNewsDataSer.loader['nodeDetail']['status'] = false;
            }, 1000);
        }
        //打开相关节点信息面板，并展开右侧面板
        GraphNewsDataSer.overallData['rightBarShow'] = true;

        //清空原来新闻数组数据并重置控制数据
        GraphNewsDataSer.nodeLinkSelectedData[type]['info']['general']['status'] = false;
        GraphNewsDataSer.nodeLinkSelectedData[type]['info']['detail']['status'] = true;
    }


    /**
     * 和该人物或部门相关的外事新闻事件搜索出来回填到对应的新闻数组中
     * @param type
     * @param uniqueId
     */
    function addRelatedEventNews(type, uniqueId) {
        GraphNewsDataSer.nodeLinkSelectedData[type]['info']['detail']['newsDetail']['status'] = false;
        GraphNewsDataSer.nodeLinkSelectedData[type]['info']['detail']['news'].length = 0;

        let allLinks = GraphNewsDataSer.allNodeLinkData['array']['links'];
        //从连接关系中读取所有相关新闻数据填充到数组
        for (let i in allLinks) {
            //读取该源点为uniqueId的节点
            if (allLinks[i]['source'] == uniqueId) {
                let eventUniqueId = allLinks[i]['target']; //目标事件节点unique_id
                let eventData = GraphNewsDataSer.allNodeLinkData['obj'][eventUniqueId]; //从节点对象中直接读取
                //如果是事件节点则添加，否则不添加
                if (eventData['label_name'] == 'visit_event_in' || eventData['label_name'] == 'visit_event_out') {
                    GraphNewsDataSer.nodeLinkSelectedData[type]['info']['detail']['news'].push(eventData); //添加进目标新闻数组中
                }
            }
        }
    }

    /**
     * 出席人添加与之相关个人信息的及新闻数据
     * @param type
     * @param uniqueId
     */
    function attendeeAddRelativeEventNews(type, uniqueId) {
        GraphNewsDataSer.nodeLinkSelectedData[type]['info']['detail']['newsDetail']['status'] = false;
        GraphNewsDataSer.nodeLinkSelectedData[type]['info']['detail']['news'].length = 0;

        let allLinks = GraphNewsDataSer.allNodeLinkData['array']['links'];
        //从连接关系中读取所有相关新闻数据填充到数组
        for (let i in allLinks) {
            //如果不存在或为空则继续
            if (!OverallGeneralSer.checkDataNotEmpty(allLinks[i]['attach']['attend'])) continue;

            //读取该源点为uniqueId的节点
            let attendeeName = GraphNewsDataSer.renderData['obj'][uniqueId]['cn_name'];
            if (allLinks[i]['attach']['attend'].indexOf(attendeeName) > -1) {
                let eventUniqueId = allLinks[i]['target']; //目标事件节点unique_id
                let eventData = GraphNewsDataSer.allNodeLinkData['obj'][eventUniqueId]; //从节点对象中直接读取
                //如果是事件节点则添加，否则不添加
                if (eventData['label_name'] == 'visit_event_in' || eventData['label_name'] == 'visit_event_out') {
                    GraphNewsDataSer.nodeLinkSelectedData[type]['info']['detail']['news'].push(eventData); //添加进目标新闻数组中
                }
            }
        }
    }


    /**
     * 新闻事件数据的处理，获取对应新闻数据信息
     */
    function getNewsInfo() {
        //获取该节点类型和unique_id
        let uniqueId = GraphNewsDataSer.overallData['nodeSelected']['unique_id'];
        let type = GraphNewsDataSer.overallData['nodeSelected']['type'];

        //先关闭所有右侧数据展示
        for (let i in GraphNewsDataSer.nodeLinkSelectedData) {
            GraphNewsDataSer.nodeLinkSelectedData[i]['status'] = false;
        }
        //单独开启目标数据展示
        GraphNewsDataSer.nodeLinkSelectedData[type]['status'] = true;
        //赋值基础数据并显示到面板
        assignGeneralData(type, uniqueId);

        //根据不同节点类型展示不同消息信息体
        switch (type) {
            case 'attendee': {
                //装载相关新闻数组
                attendeeAddRelativeEventNews(type, uniqueId);
                GraphNewsDataSer.nodeLinkSelectedData[type]['info']['general']['status'] = true; //单独设置人员信息显示为true，展开个人信息
                break;
            }
            case 'gdufs_dept': {
                //装载相关新闻数组
                addRelatedEventNews(type, uniqueId);
                GraphNewsDataSer.nodeLinkSelectedData[type]['info']['general']['status'] = true; //单独设置部门信息显示为true，展开部门信息
                break;
            }
            case 'visitor_dept': {
                //装载相关新闻数组
                addRelatedEventNews(type, uniqueId);
                GraphNewsDataSer.nodeLinkSelectedData[type]['info']['general']['status'] = true; //单独设置部门信息显示为true，展开部门信息
                break;
            }
            //来访事件
            case 'visit_event_in': {
                showVisitEventNewsInfo(type, uniqueId);
                break;
            }
            //出访事件
            case 'visit_event_out': {
                showVisitEventNewsInfo(type, uniqueId);
                break;
            }
            default: {
                console.log('come to default menu type', type)
                return;
            }
        }
    }

    /**
     * 展示来访事件和出访事件的新闻信息
     * @param type
     * @param uniqueId
     */
    function showVisitEventNewsInfo(type, uniqueId) {
        //直接获取该新闻具体消息体，并显示在右侧面板中
        let url = OverallDataSer.urlData['frontEndHttp']['gdufsNewsOssUrl'] + "html/" + uniqueId + ".html";
        OverallGeneralSer.httpGetFiles(url, result => {
            GraphNewsDataSer.nodeLinkSelectedData[type]['info']['detail']['news'] = $sce.trustAsHtml(result);

        }, GraphNewsDataSer.loader['nodeDetail']);
        GraphNewsDataSer.nodeLinkSelectedData[type]['info']['detail']['status'] = true;
    }


    /**
     * 返回新闻原网页信息数据
     * @param event
     */
    function getNewsOriginInfo(event) {
        let uniqueId = GraphNewsDataSer.overallData['nodeSelected']['unique_id'];
        let type = GraphNewsDataSer.overallData['nodeSelected']['type'];
        let subUniqueId = GraphNewsDataSer.overallData['nodeSelected']['sub_unique_id'];
        //如果是事件节点则直接在新页面打开该事件新闻
        if (type == 'visit_event_in' || type == 'visit_event_out') {
            window.open(GraphNewsDataSer.renderData.obj[uniqueId]['origin_url'], '_blank');
        }
        //如果是其他节点则手动打开页面按钮来访问该事件
        else {
            window.open(GraphNewsDataSer.renderData.obj[subUniqueId]['origin_url'], '_blank');
        }
        //取消消息体传递
        event.stopPropagation();
    }


    /**
     * 查看该出席人节点的所有相关事件信息
     */
    function getRelativeEvent() {
        let uniqueId = GraphNewsDataSer.overallData['nodeHover']['unique_id'];
        let type = GraphNewsDataSer.overallData['nodeHover']['type'];
        let allLinks = angular.copy(GraphNewsDataSer.allNodeLinkData['array']['links']);
        let targetNodeArray = [], targetLinkArray = [];
        let attendeeNode = GraphNewsDataSer.renderData['obj'][uniqueId];

        targetNodeArray.push(attendeeNode);//初始化添加出席人节点
        for (let i in allLinks) {
            let link = allLinks[i];
            let attach = link['attach'];
            //如果没有附加数据则继续循环
            if (!OverallGeneralSer.checkDataNotEmpty(attach)) continue;

            try {
                //如果出席人信息中有该对应的人员的姓名则添加该事件节点到数组中
                if (attach['attend'].indexOf(attendeeNode['cn_name']) > -1) {
                    //1、由于校内单位相对事件必然为源节点，则添加该事件节点为目标节点
                    let eventUniqueId = link['target'];
                    targetNodeArray.push(GraphNewsDataSer.allNodeLinkData['obj'][link['target']]);

                    //2、添加出席人-->事件链接
                    targetLinkArray.push({
                        'source': uniqueId,
                        'target': eventUniqueId,
                        'attach': {'unique_id': uuidv1()}
                    })
                }
            } catch (e) {
                console.log('getRelativeEvent err', e);
            }
        }

        //数据封装
        let graphData = parseNeoData({
            'nodes': targetNodeArray,
            'links': targetLinkArray
        });

        //初始化节点渲染到页面svg
        nodeLinkGraphInit(graphData);
    }


    /**
     * 获取相关与会人员信息
     */
    function getRelativeAttendee() {
        let uniqueId = GraphNewsDataSer.overallData['nodeHover']['unique_id'];
        let type = GraphNewsDataSer.overallData['nodeHover']['type'];
        let allLinks = angular.copy(GraphNewsDataSer.allNodeLinkData['array']['links']);
        let targetNodeArray = [], targetLinkArray = [], tempNodeNameObj = {};

        //来访或出访事件
        if (type == 'visit_event_in' || type == 'visit_event_out') {
            //部门-->出席人-->事件
            targetNodeArray.push(GraphNewsDataSer.allNodeLinkData['obj'][uniqueId]); //初始化填充事件节点
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
                            targetNodeArray.push(GraphNewsDataSer.allNodeLinkData['obj'][link['source']]);

                            //出席人遍历
                            for (let j in attendeeData) {
                                let attendeeUniqueId = uuidv1(); //新创建该出席人节点的unique_id
                                //如果中文名称没有，则添加英文名称
                                if (!OverallGeneralSer.checkDataNotEmpty(attendeeData[j]['cn_name'])) {
                                    attendeeData[j]['cn_name'] = attendeeData[j]['en_name']
                                }
                                tempNodeNameObj[attendeeData[j]['cn_name']] = attendeeUniqueId;
                                //2、添加出席人节点
                                targetNodeArray.push({
                                    'cn_name': attendeeData[j]['cn_name'],
                                    'hover_title': attendeeData[j]['cn_name'],
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
        }
        //校内组织或外方实体
        else if (type == 'gdufs_dept' || type == 'visitor_dept') {
            //部门-->出席人-->事件
            targetNodeArray.push(GraphNewsDataSer.allNodeLinkData['obj'][uniqueId]); //初始化填充部门节点
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
                            targetNodeArray.push(GraphNewsDataSer.allNodeLinkData['obj'][link['target']]);

                            for (let j in attendeeData) {
                                let attendeeUniqueId = '';//添加出席人的uniqueId
                                //如果中文名称没有，则添加英文名称
                                if (!OverallGeneralSer.checkDataNotEmpty(attendeeData[j]['cn_name'])) {
                                    attendeeData[j]['cn_name'] = attendeeData[j]['en_name']
                                }
                                //若之前尚未添加以该出席人姓名的为key的节点，则添加
                                if (!tempNodeNameObj.hasOwnProperty(attendeeData[j]['cn_name'])) {
                                    attendeeUniqueId = uuidv1();
                                    tempNodeNameObj[attendeeData[j]['cn_name']] = attendeeUniqueId;
                                    //添加出席人节点
                                    targetNodeArray.push({
                                        'cn_name': attendeeData[j]['cn_name'],
                                        'hover_title': attendeeData[j]['cn_name'],
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
        }
        // console.log(targetNodeArray);
        // console.log(targetLinkArray);
        let graphData = parseNeoData({
            'nodes': targetNodeArray,
            'links': targetLinkArray
        });

        //初始化节点渲染到页面svg
        nodeLinkGraphInit(graphData);
    }


    /**
     * 搜索对应的节点信息
     */
    function searchTargetNodes() {
        let targetText = GraphNewsDataSer.overallData['search']['text'].trim();
        let targetNodeArray = [], targetLinkArray = [], tempNodeUniqueIdArray = [];
        let allNodes = angular.copy(GraphNewsDataSer.allNodeLinkData['array']['nodes']);
        let allLinks = angular.copy(GraphNewsDataSer.allNodeLinkData['array']['links']);

        //只有搜索内容不为空时才进行搜索
        if (OverallGeneralSer.checkDataNotEmpty(targetText)) {
            //1、搜索部门和事件相关节点
            for (let i in allNodes) {
                let node = allNodes[i];
                try {
                    if (node['label_name'] == 'visit_event_in' || node['label_name'] == 'visit_event_out') {
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
                                targetNodeArray.push(GraphNewsDataSer.allNodeLinkData['obj'][link['target']]);

                            } else if (sourceExist <= -1 && targetExist > -1) {
                                targetNodeArray.push(GraphNewsDataSer.allNodeLinkData['obj'][link['source']]);
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
                    targetNodeArray.push(GraphNewsDataSer.allNodeLinkData['obj'][item])
                }
            }

            //添加人员节点到节点并与事件节点进行链接
            for (let i in teachObj) {
                let uniqueId = uuidv1();
                targetNodeArray.push({
                    'cn_name': i,
                    'hover_title': i,
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
            //设置搜索内容的横向标题
            GraphNewsDataSer.overallData['graphPath']['layer2']['name'] = '搜索节点 “' + targetText + "” 相关内容";
        }
        //若搜索为空，则返回之前的所有数据重新渲染
        else {
            //分别重新设置数据源为第一数据源
            targetNodeArray = allNodes;
            targetLinkArray = allLinks;
            GraphNewsDataSer.overallData['graphPath']['layer2']['name'] = ''; //强制设置第二数据源名称为空
        }

        //console.log(targetNodeArray);
        //分别设置节点和链接数据至渲染数组中
        let graphData = parseNeoData({
            'nodes': targetNodeArray,
            'links': targetLinkArray
        });

        //初始化节点渲染到页面svg
        nodeLinkGraphInit(graphData);
    }


    return {
        getNeoData: getNeoData,
        chooseNodeMenu: chooseNodeMenu,
        chooseNewsShow: chooseNewsShow,
        getNewsOriginInfo: getNewsOriginInfo,
        searchTargetNodes: searchTargetNodes,
    }
});


