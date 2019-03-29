/**
 * Created by Administrator on 2019/2/14.
 */
var graphModule = angular.module('Angular.graph');

graphModule.factory('GraphSer', function ($rootScope, $routeParams, OverallDataSer, $cookies, $location, $http,
                                          OverallGeneralSer, GraphDataSer, GraphNewsSer, GraphNewsDataSer,
                                          GraphExchangeSer, GraphExchangeDataSer) {

    /**
     * 初始化知识图谱数据
     */
    function initGraph(graph) {
        //设置数据源
        GraphDataSer.generalData.activeGraph = $routeParams;

        //根据不同的option类型决定不同的知识图谱数据源
        switch (GraphDataSer.generalData.activeGraph['type']) {
            case 'news': {
                //循环赋值到graph和GraphDataSer中，每次在页面中直接使用对应模块的数据
                for (let i in GraphNewsDataSer) {
                    GraphDataSer[i] = GraphNewsDataSer[i];
                    graph[i] = GraphNewsDataSer[i];
                }
                //新闻数据类型option，获取相应节点数据
                GraphNewsSer.getNeoData();
                break;
            }
            case 'exchange': {
                //循环赋值到graph和GraphDataSer中，每次在页面中直接使用对应模块的数据
                for (let i in GraphExchangeDataSer) {
                    GraphDataSer[i] = GraphExchangeDataSer[i];
                    graph[i] = GraphExchangeDataSer[i];
                }
                //交换生类型的option，获取相应节点数据
                GraphExchangeSer.getNeoData();
                break;
            }
        }
    }


    /**
     * 针对新闻数据类型，打开对应的新闻数据在屏幕右侧面板
     */
    function chooseNewsShow(uniqueId, type) {
        switch (GraphDataSer.generalData.activeGraph['type']) {
            case 'news': {
                GraphNewsSer.chooseNewsShow(uniqueId, type);
                break;
            }
        }
    }


    /**
     * 用户选择普通模式后重置所有节点样式颜色等重置
     */
    function resetAllNodeStyle() {
        D3Service().resetAllNodeStyle(GraphDataSer.overallData.graphSetting, GraphDataSer.nodeTypeSetting);
    }


    /**
     * 返问新闻原网页信息数据
     */
    function getNewsOriginInfo(event) {
        switch (GraphDataSer.generalData.activeGraph['type']) {
            case 'news': {
                GraphNewsSer.getNewsOriginInfo(event);
                break;
            }
        }
    }


    /**
     * 选择对应节点的菜单项
     */
    function chooseNodeMenu(menuType) {
        switch (GraphDataSer.generalData.activeGraph['type']) {
            case 'news': {
                GraphNewsSer.chooseNodeMenu(menuType);
                break;
            }
            case 'exchange': {
                GraphExchangeSer.chooseNodeMenu(menuType)
            }
        }
    }


    /**
     * 搜索框输入搜索对应的节点信息
     */
    function searchTargetNodes() {
        switch (GraphDataSer.generalData.activeGraph['type']) {
            //新闻实体数据
            case 'news': {
                GraphNewsSer.searchTargetNodes();
                break;
            }
            //交换生实体数据
            case 'exchange': {
                GraphExchangeSer.searchTargetNodes();
                break;
            }
        }
    }


    /**
     * 点击切换数据源
     */
    function switchDataSource(year, type) {
        //设置location跳转路径
        $location.path('graph/' + year + '/' + type);
        //关闭数据源面板
        GraphDataSer.generalData.dataSource.status = false;
    }


    return {
        initGraph: initGraph,
        switchDataSource: switchDataSource,
        chooseNewsShow: chooseNewsShow,//菜单选择
        resetAllNodeStyle: resetAllNodeStyle,//重置节点颜色
        chooseNodeMenu: chooseNodeMenu, //选择对应节点的菜单
        getNewsOriginInfo: getNewsOriginInfo, //获取新闻原始信息
        searchTargetNodes: searchTargetNodes,//搜索对应节点信息
    }
});
