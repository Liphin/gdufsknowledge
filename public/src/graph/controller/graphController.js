/**
 * Created by Administrator on 2019/2/14.
 */
var graphModule = angular.module('Angular.graph');

graphModule.controller('GraphCtrl', function ($location, $routeParams, OverallGeneralSer, OverallDataSer,
                                              GraphDataSer, GraphSer, GraphNewsDataSer) {

    var graph = this;
    //最基本的数据模板
    graph.generalData = GraphDataSer.generalData;
    //初始化知识图谱数据
    GraphSer.initGraph(graph);


    /**
     * 选择展示出某新闻数据
     * @see GraphSer.chooseNewsShow
     */
    graph.chooseNewsShow = function (uniqueId, type) {
        GraphSer.chooseNewsShow(uniqueId, type);
    };

    /**
     * 用户选择普通模式后重置所有节点样式颜色等重置
     * @see GraphSer.resetAllNodeStyle
     */
    graph.resetAllNodeStyle = function () {
        GraphSer.resetAllNodeStyle();
    };

    /**
     * 返回新闻原网页信息数据
     * @see GraphSer.getNewsOriginInfo
     */
    graph.getNewsOriginInfo = function (event) {
        GraphSer.getNewsOriginInfo(event)
    };

    /**
     * 选择对应节点的菜单项
     * @see GraphSer.chooseNodeMenu
     */
    graph.chooseNodeMenu = function (menuType) {
        GraphSer.chooseNodeMenu(menuType)
    };

    /**
     * 搜索对应的节点信息
     * @see GraphSer.searchTargetNodes
     */
    graph.searchTargetNodes = function () {
        GraphSer.searchTargetNodes();
    };

    /**
     * 返回主数据源
     */
    graph.backToSourceData = function () {
        GraphDataSer.overallData['graphPath']['layer2']['name'] = ''; //设置第二层级数据源名称为空
        GraphDataSer.overallData['search']['text'] = ''; //设置搜索内容为空
        GraphSer.searchTargetNodes();//返回主数据源相当于搜索空内容
    };

    /**
     * 点击切换知识图谱的数据源
     * @see GraphSer.switchDataSource
     */
    graph.switchDataSource= function () {
        GraphSer.switchDataSource();
    };

});






