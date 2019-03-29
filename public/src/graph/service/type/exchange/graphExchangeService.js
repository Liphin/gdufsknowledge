/**
 * Created by Administrator on 2019/3/27.
 * 新闻类型节点数据渲染
 */
var graphModule = angular.module('Angular.graph');

graphModule.factory('GraphExchangeSer', function ($sce, $timeout, $rootScope, OverallDataSer, OverallGeneralSer,
                                                  $location, $http, GraphExchangeDataSer, GraphNewsSer, AnalyseDataSer, AnalyseSer) {

    /**
     * 获取所有neo4j数据库中的数据
     */
    function getNeoData() {
        //设置等待节点数据loading开启
        GraphExchangeDataSer.loader.nodeLinks.status = true;

        //若用于分析的广外外事数据为空则重新获取，否则直接使用即可
        if (!OverallGeneralSer.checkDataNotEmpty(AnalyseDataSer.knowData)) {
            //获取广外知外事数据
            AnalyseSer.getAllGdufsKnowledgeAnalyseData(() => {
                //初始化交换生数据节点图谱
                initExchangeGraph();
            });

        } else {
            //初始化交换生数据节点图谱
            initExchangeGraph();
        }
    }

    /**
     * 初始化广外外事交换生数据节点图谱
     */
    function initExchangeGraph() {
        //重新拷贝一份交换生原始数据，以免数据脏话
        GraphExchangeDataSer.originalData = angular.copy(AnalyseDataSer.knowData['exchange_student_list']);
        //转换关系数据库list数据为图数据库d3的 学院——交换学校 展示数据
        let result = parseListToInstituteExSchoolGraph();
        //二次包装数据，添加必要的节点设置
        let graphData = parseNeoData(result);
        //初始化节点和关系图数据
        nodeLinkGraphInit(graphData);
    }


    /**
     * 转换关系数据库list数据为图数据库d3展示数据
     * 数据转换为：“学院——交换大学” 节点及关系
     */
    function parseListToInstituteExSchoolGraph() {
        let data = GraphExchangeDataSer.originalData;
        let nodes = [];
        let links = [];
        let tempAllNodeObj = {}; //收录所有节点信息的对象
        let instituteUniqueId, exchangeSchoolUniqueId; //学院和交换大学的unique_id信息
        //遍历每行list数据，解析出 学院——交换大学 节点及关系
        for (let i in data) {
            if (data[i]['exchange_school'] != '学校待定' &&
                OverallGeneralSer.checkDataNotEmpty(data[i]['institute']) &&
                OverallGeneralSer.checkDataNotEmpty(data[i]['exchange_school'])) {

                //institute类型：如果尚未添加则添加否则直接获取其unique_id
                instituteUniqueId = checkAndAddNodes(nodes, tempAllNodeObj, data[i]['institute'], {
                    cn_name: data[i]['institute'],
                    label_name: 'institute'
                });

                //exchange_school类型：如果尚未添加则添加否则直接获取其unique_id
                exchangeSchoolUniqueId = checkAndAddNodes(nodes, tempAllNodeObj, data[i]['exchange_school'], {
                    cn_name: data[i]['exchange_school'],
                    label_name: 'exchange_school'
                });

                //添加 学院--交换大学 关系连接
                links.push({
                    'source': instituteUniqueId,
                    'target': exchangeSchoolUniqueId,
                    'attach': {'unique_id': uuidv1()}
                });
            }
        }
        return {
            nodes: nodes,
            links: links
        }
    }


    /**
     * 转换关系数据库list数据为图数据库d3展示数据
     * 数据转换为：“学院——专业——学生” 节点及关系
     */
    function parseListToInstituteMajorStuGraph(targetNode) {
        let data = GraphExchangeDataSer.originalData;
        let nodes = [];
        let links = [];
        let tempAllNodeObj = {}; //收录所有节点信息的对象
        let instituteUniqueId, majorUniqueId, studentUniqueId; //学院、专业和学生的uniqueId
        //遍历每行list数据，解析出 学院——专业——学生 节点及关系
        for (let i in data) {
            //查找目标学院的数据以及专业和学生名称都不为空
            if (data[i]['institute'] == targetNode['cn_name'] &&
                OverallGeneralSer.checkDataNotEmpty(data[i]['major']) &&
                OverallGeneralSer.checkDataNotEmpty(data[i]['name'])) {

                //institute类型：如果尚未添加则添加否则直接获取其unique_id
                instituteUniqueId = checkAndAddNodes(nodes, tempAllNodeObj, data[i]['institute'], {
                    cn_name: data[i]['institute'],
                    label_name: 'institute'
                });

                //major类型：如果尚未添加则添加否则直接获取其unique_id
                majorUniqueId = checkAndAddNodes(nodes, tempAllNodeObj, data[i]['major'], {
                    cn_name: data[i]['major'],
                    label_name: 'major'
                });

                //student类型：如果尚未添加则添加否则直接获取其unique_id
                studentUniqueId = checkAndAddNodes(nodes, tempAllNodeObj, data[i]['name'], {
                    cn_name: data[i]['name'],
                    label_name: 'student'
                });

                //添加 学院--专业 关系连接
                links.push({
                    'source': instituteUniqueId,
                    'target': majorUniqueId,
                    'attach': {'unique_id': uuidv1()}
                });

                //添加 专业--学生 关系连接
                links.push({
                    'source': majorUniqueId,
                    'target': studentUniqueId,
                    'attach': {'unique_id': uuidv1()}
                });
            }
        }

        //二次包装数据，添加必要的节点设置
        let graphData = parseNeoData({
            nodes: nodes,
            links: links
        });

        //初始化节点和关系图数据
        nodeLinkGraphInit(graphData);
    }


    /**
     * 转换关系数据库list数据为图数据库d3展示数据
     * 数据转换为：“外国学校——专业——学生” 节点及关系
     */
    function parseListToExSchoolMajorStuGraph(targetNode) {
        let data = GraphExchangeDataSer.originalData;
        let nodes = [];
        let links = [];
        let tempAllNodeObj = {}; //收录所有节点信息的对象
        let exSchoolUniqueId, majorUniqueId, studentUniqueId; //交换学校、专业和学生的uniqueId
        //遍历每行list数据，解析出 外国学校——专业——学生 节点及关系
        for (let i in data) {
            //查找目标学院的数据以及专业和学生名称都不为空
            if (data[i]['exchange_school'] == targetNode['cn_name'] &&
                OverallGeneralSer.checkDataNotEmpty(data[i]['major']) &&
                OverallGeneralSer.checkDataNotEmpty(data[i]['name'])) {

                //exchange_school类型：如果尚未添加则添加否则直接获取其unique_id
                exSchoolUniqueId = checkAndAddNodes(nodes, tempAllNodeObj, data[i]['exchange_school'], {
                    cn_name: data[i]['exchange_school'],
                    label_name: 'exchange_school'
                });

                //major类型：如果尚未添加则添加否则直接获取其unique_id
                majorUniqueId = checkAndAddNodes(nodes, tempAllNodeObj, data[i]['major'], {
                    cn_name: data[i]['major'],
                    label_name: 'major'
                });

                //student类型：如果尚未添加则添加否则直接获取其unique_id
                studentUniqueId = checkAndAddNodes(nodes, tempAllNodeObj, data[i]['name'], {
                    cn_name: data[i]['name'],
                    label_name: 'student'
                });

                //添加 外国学校--专业 关系连接
                links.push({
                    'source': exSchoolUniqueId,
                    'target': majorUniqueId,
                    'attach': {'unique_id': uuidv1()}
                });

                //添加 专业--学生 关系连接
                links.push({
                    'source': majorUniqueId,
                    'target': studentUniqueId,
                    'attach': {'unique_id': uuidv1()}
                });
            }
        }

        //二次包装数据，添加必要的节点设置
        let graphData = parseNeoData({
            nodes: nodes,
            links: links
        });

        //初始化节点和关系图数据
        nodeLinkGraphInit(graphData);
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
            let tempRadius = 20 + Math.round(nodesObj[k]['degree'] * 0.5);
            nodesObj[k]['radius'] = (tempRadius > 50 ? 50 : tempRadius); //最大的半径不能大于50
            nodesObj[k]['distance'] = 50 + Math.round(nodesObj[k]['degree'] * 0.5);
        }

        //赋值渲染到页面HTML中的节点数据和nodes对象
        GraphExchangeDataSer.renderData.array.nodes = nodes;
        GraphExchangeDataSer.renderData.array.links = links;
        GraphExchangeDataSer.renderData.obj = nodesObj;

        return {
            nodes: nodes, //所有节点
            links: links, //所有关系连接
            nodesObj: nodesObj, //所有节点组成的对象
        }
    }

    /**
     * 获取页面 svg, linkArray, nodeArray相应的dom元素
     * 若页面尚未渲染完成，获取为空则隔500毫秒后再次获取
     * @returns {{svg, linkArray, nodeArray}}
     */
    function setIntervalGetPageDom(resolve) {
        let svg = d3.select(".knowledgeSvgExchange"); //图数据库展示
        let linkArray = d3.select(".knowledgeSvgExchange .links"); //连接数组
        let nodeArray = d3.select(".knowledgeSvgExchange .nodes"); //节点数组

        //检查是否有任何一个页面元素为空（可能由于页面渲染尚未完成）
        if (svg.empty() || linkArray.empty() || nodeArray.empty()) {
            //设定500毫秒后递归重新获取页面上元素
            $timeout(function () {
                setIntervalGetPageDom(resolve);
            }, 400);

        } else {
            //返回图谱展示的HTML元素三者的封装
            resolve({
                svg: svg,
                linkArray: linkArray,
                nodeArray: nodeArray,
            });
        }
    }

    /**
     * 节点和关系连接数据初始化
     */
    function nodeLinkGraphInit(graphData) {

        //d3获取相应的svg等数据，若页面加载延迟则$timeout重复获取
        let domAsync = new Promise(function (resolve, reject) {
            setIntervalGetPageDom(resolve);
        });
        //同步机制
        domAsync.then(function (domData) {
            let svg = domData.svg, linkArray = domData.linkArray, nodeArray = domData.nodeArray;
            //知识图谱初始化
            D3Service()
                .element(svg, linkArray, nodeArray)
                .nodeLinks(graphData.nodes, graphData.links, graphData.nodesObj)
                .d3Setting(GraphExchangeDataSer.overallData.graphSetting, GraphExchangeDataSer.nodeTypeSetting)
                .interaction(
                    (d, i) => {
                        GraphExchangeDataSer.overallData.nodeHover.status = true;
                        GraphExchangeDataSer.overallData.nodeHover.unique_id = d.unique_id;
                        GraphExchangeDataSer.overallData.nodeHover.type = d.label_name;
                        //console.log('enter', d, i);
                    },
                    (d, i) => {
                        GraphExchangeDataSer.overallData.nodeHover.status = false;
                        //console.log('leave', d, i);
                    },
                    (d, i) => {
                        //存储当前选择的节点相关数据
                        GraphExchangeDataSer.overallData.nodeSelected.unique_id = d.unique_id;
                        GraphExchangeDataSer.overallData.nodeSelected.type = d.label_name;

                        //若热键按住ctrl+点击事件执行click回调
                        if (OverallDataSer.keyBoard['ctrl']) {
                            //获取基础信息数据
                            getGeneralInfo();

                        } else {
                            //若开启其他节点灰化设置，且没有按下ctrl热键时，则设置其他节点灰化，只与之相关的节点展示颜色
                            if (GraphExchangeDataSer.overallData.graphSetting.nodesGray) {
                                D3Service().setUnRelativeNodeGray(d, i, GraphExchangeDataSer.nodeTypeSetting, graphData.links);
                            }
                        }
                    }
                )
                .nodeLinkInit(); //最后才执行此创建步骤

            //设置等待节点数据loading结束
            GraphExchangeDataSer.loader.nodeLinks.status = false;
            $rootScope.$apply();
        });
    }


    /**
     * 选择对应的节点的菜单项
     */
    function chooseNodeMenu(menuType) {
        //把该hover的节点数据传给选择数组
        GraphExchangeDataSer.overallData['nodeSelected']['unique_id'] = GraphExchangeDataSer.overallData['nodeHover']['unique_id'];
        GraphExchangeDataSer.overallData['nodeSelected']['type'] = GraphExchangeDataSer.overallData['nodeHover']['type'];

        //获取相应主节点信息，用于展示在header标题中
        let targetNode = GraphExchangeDataSer.renderData['obj'][GraphExchangeDataSer.overallData['nodeHover']['unique_id']];

        //根据不同菜单类型执行不同操作
        switch (menuType) {
            //该节点的具体信息
            case "infoDetail": {
                //调用展示节点信息详情方法
                getGeneralInfo();
                break;
            }
            //查询相关学生节点
            case "relativeStudent": {
                let infoText = ''; //标题中的二级标题信息
                //广外学院节点类型
                if (targetNode['label_name'] == 'institute') {
                    //广外节点类型搜索相应的学生信息
                    parseListToInstituteMajorStuGraph(targetNode);
                    infoText += '学院 “' + targetNode['cn_name'] + "” ";
                }
                //外国交换学校节点类型
                else if (targetNode['label_name'] == 'exchange_school') {
                    //外国院校节点类型搜索相应的学生信息
                    parseListToExSchoolMajorStuGraph(targetNode);
                    infoText += '交换学校 “' + targetNode['cn_name'] + "” ";
                }
                //设置二级标题内容
                GraphExchangeDataSer.overallData['graphPath']['layer2']['name'] = infoText + "的相关学生节点";
                break;
            }
            //查看具体的交换大学信息
            case 'exchangeSchool': {
                let infoText = ''; //标题中的二级标题信息
                //当节点是专业节点时
                if (targetNode['label_name'] == 'major') {
                    //通过调用全局搜索方式进行搜索对应的节点相关的信息
                    selectTargetColumnData(targetNode['label_name'], targetNode['cn_name']);
                    infoText += '专业 “' + targetNode['cn_name'] + "” ";
                }
                //当节点是学生节点时
                else if (targetNode['label_name'] == 'student') {
                    //通过调用全局搜索方式进行搜索对应的节点相关信息
                    //学生信息在列表中是 "name" 列
                    selectTargetColumnData('name', targetNode['cn_name']);
                    infoText += '学生 “' + targetNode['cn_name'] + "” ";
                }
                //设置二级标题内容
                GraphExchangeDataSer.overallData['graphPath']['layer2']['name'] = infoText + " 的交换大学信息图谱";
                break;
            }
            default: {
                break;
            }
        }
        //菜单响应按键后，收回菜单
        GraphExchangeDataSer.overallData['nodeMenu']['status'] = false;
    }


    /**
     * 新闻事件数据的处理，获取对应新闻数据信息
     */
    function getGeneralInfo() {
        //获取该节点类型和unique_id
        let uniqueId = GraphExchangeDataSer.overallData['nodeSelected']['unique_id'];
        let type = GraphExchangeDataSer.overallData['nodeSelected']['type'];

        //先关闭所有右侧数据展示
        for (let i in GraphExchangeDataSer.nodeLinkSelectedData) {
            GraphExchangeDataSer.nodeLinkSelectedData[i]['status'] = false;
        }
        //单独开启目标数据展示
        GraphExchangeDataSer.nodeLinkSelectedData[type]['status'] = true;

        //赋值基础数据并显示到面板
        assignGeneralData(type, uniqueId);
        GraphExchangeDataSer.nodeLinkSelectedData[type]['info']['general']['status'] = true; //单独设置人员信息显示为true，展开个人信息
    }

    /**
     *
     * @param type
     * @param uniqueId
     */
    function assignGeneralData(type, uniqueId) {
        //赋值基础数据
        let node = GraphExchangeDataSer.renderData.obj[uniqueId];
        for (let i in node) {
            GraphExchangeDataSer.nodeLinkSelectedData[type]['info']['general']['data'][i] = node[i];
        }
        //对于交换学生节点数据进行特殊逻辑设置流程，把与之相关的所有信息都设置进入学生展示节点数据中
        if (type == 'student') {
            //遍历原始list数据，获取该学生行的信息
            for (let j in GraphExchangeDataSer.originalData) {
                //list中的name对应节点中的
                if (GraphExchangeDataSer.originalData[j]['name'] == GraphExchangeDataSer.renderData.obj[uniqueId]['cn_name']) {
                    //查看原始list数据获取该学生所在行的所有数据
                    for (let k in GraphExchangeDataSer.originalData[j]) {
                        GraphExchangeDataSer.nodeLinkSelectedData[type]['info']['general']['data'][k] = GraphExchangeDataSer.originalData[j][k];
                    }
                }
            }
        }

        //如果面板之前已经打开了，则无loading，如果之前尚未打开，则有loading
        if (!GraphExchangeDataSer.overallData['rightBarShow']) {
            //面板展开时，信息尚未显示出来，loading加载
            GraphExchangeDataSer.loader['nodeDetail']['status'] = true;
            //1秒后，动画消失，显示内容
            $timeout(function () {
                GraphExchangeDataSer.loader['nodeDetail']['status'] = false;
            }, 1000);
        }
        //打开相关节点信息面板，并展开右侧面板
        GraphExchangeDataSer.overallData['rightBarShow'] = true;

        //清空原来新闻数组数据并重置控制数据
        GraphExchangeDataSer.nodeLinkSelectedData[type]['info']['general']['status'] = true;
    }


    /**
     * 搜索对应的节点信息
     */
    function searchTargetNodes() {
        let targetText = GraphExchangeDataSer.overallData['search']['text'].trim();
        let nodes = [], links = [], tempAllNodeObj = {};

        //监测目标搜索文本是否为空
        if (OverallGeneralSer.checkDataNotEmpty(targetText)) {
            for (let i in GraphExchangeDataSer.originalData) {
                let row = GraphExchangeDataSer.originalData[i];
                //分别查找 学生|专业|学院|交换学校 相关数据
                // 学院<--专业<--学生-->交换学校
                //check全部字段不为空才显示
                if ((OverallGeneralSer.checkDataNotEmpty(row['name']) &&
                    OverallGeneralSer.checkDataNotEmpty(row['major']) &&
                    OverallGeneralSer.checkDataNotEmpty(row['institute']) &&
                    OverallGeneralSer.checkDataNotEmpty(row['exchange_school'])) &&
                    (row['name'].indexOf(targetText) > -1 ||
                    row['major'].indexOf(targetText) > -1 ||
                    row['institute'].indexOf(targetText) > -1 ||
                    row['exchange_school'].indexOf(targetText) > -1)) {

                    //找到符合数据，并添加至 学院<--专业<--学生-->交换学校 关系图谱
                    addInstituteMajorStuExSchool(nodes, links, row, tempAllNodeObj);
                }
            }
            //分别设置节点和链接数据至渲染数组中
            let graphData = parseNeoData({
                'nodes': nodes,
                'links': links
            });
            //初始化节点渲染到页面svg
            nodeLinkGraphInit(graphData);

            //设置搜索内容的横向标题，第二层级数据标签
            GraphExchangeDataSer.overallData['graphPath']['layer2']['name'] = '搜索信息 “' + targetText + "” 相关内容";

        }
        //如果搜索内容为空则返回数据源中的所有数据信息
        else {
            //重新初始化交换生相关数据
            initExchangeGraph();
            //强制设置第二数据源名称为空，取消第二层级数据标签
            GraphExchangeDataSer.overallData['graphPath']['layer2']['name'] = '';
        }
    }


    /**
     * 获取特定列匹配的列表数据，并封装成节点图
     */
    function selectTargetColumnData(columnType, targetText) {
        //数据初始化
        let nodes = [], links = [], tempAllNodeObj = {};

        //遍历list列表每行进行查找
        for (let i in GraphExchangeDataSer.originalData) {
            let row = GraphExchangeDataSer.originalData[i];
            //如果对应的列的值符合目标文本则添加全节点及关系链接
            if (row[columnType] == targetText) {
                if ((OverallGeneralSer.checkDataNotEmpty(row['name']) &&
                    OverallGeneralSer.checkDataNotEmpty(row['major']) &&
                    OverallGeneralSer.checkDataNotEmpty(row['institute']) &&
                    OverallGeneralSer.checkDataNotEmpty(row['exchange_school'])) &&
                    (row['name'].indexOf(targetText) > -1 ||
                    row['major'].indexOf(targetText) > -1 ||
                    row['institute'].indexOf(targetText) > -1 ||
                    row['exchange_school'].indexOf(targetText) > -1)) {

                    //找到符合数据，并添加至 学院<--专业<--学生-->交换学校 关系图谱
                    addInstituteMajorStuExSchool(nodes, links, row, tempAllNodeObj);
                }
            }
        }

        //分别设置节点和链接数据至渲染数组中
        let graphData = parseNeoData({
            'nodes': nodes,
            'links': links
        });
        //初始化节点渲染到页面svg
        nodeLinkGraphInit(graphData);
    }


    /**
     * 添加 学院<--专业<--学生-->交换学校 关系图谱
     * @param nodes
     * @param links
     * @param row
     * @param tempAllNodeObj
     */
    function addInstituteMajorStuExSchool(nodes, links, row, tempAllNodeObj) {
        //******** 添加节点信息 ********
        // 学生节点
        let studentId = checkAndAddNodes(nodes, tempAllNodeObj, row.name, {
            cn_name: row.name,
            label_name: 'student'
        });
        //专业节点
        let majorId = checkAndAddNodes(nodes, tempAllNodeObj, row.major, {
            cn_name: row.major,
            label_name: 'major'
        });
        //学院节点
        let instituteId = checkAndAddNodes(nodes, tempAllNodeObj, row.institute, {
            cn_name: row.institute,
            label_name: 'institute'
        });
        //交换学校节点
        let exchangeSchoolId = checkAndAddNodes(nodes, tempAllNodeObj, row.exchange_school, {
            cn_name: row.exchange_school,
            label_name: 'exchange_school'
        });

        //******** 添加关系连接信息 ********
        // 学生-->专业
        links.push({
            'source': studentId,
            'target': majorId,
            'attach': {'unique_id': uuidv1()}
        });
        // 专业-->学院
        links.push({
            'source': majorId,
            'target': instituteId,
            'attach': {'unique_id': uuidv1()}
        });
        // 学生-->交换大学
        links.push({
            'source': studentId,
            'target': exchangeSchoolId,
            'attach': {'unique_id': uuidv1()}
        });
    }


    /**
     * 检查并添加节点数据
     */
    function checkAndAddNodes(nodes, tempAllNodeObj, objSearchName, newNodeData) {
        let targetUniqueId = ''; //目标unique_id
        if (!tempAllNodeObj.hasOwnProperty(objSearchName)) {
            //设置新的unique_id
            targetUniqueId = uuidv1();
            //添加新的节点数据
            newNodeData.unique_id = targetUniqueId;
            nodes.push(newNodeData);
            //把该新添加的节点信息填充到节点对象中
            tempAllNodeObj[objSearchName] = targetUniqueId;

        } else {
            //从所有节点对象中获取该目标unique_id信息
            targetUniqueId = tempAllNodeObj[objSearchName];
        }
        return targetUniqueId;
    }


    return {
        getNeoData: getNeoData,
        chooseNodeMenu: chooseNodeMenu,
        searchTargetNodes: searchTargetNodes,
    }
});


