/**
 * Created by Administrator on 2019/2/14.
 */
var graphModule = angular.module('Angular.graph');

graphModule.factory('GraphSer', function ($rootScope, $routeParams, OverallDataSer, $cookies, $location, $http,
                                          OverallGeneralSer, GraphDataSer, GraphNewsSer, GraphNewsDataSer) {

    /**
     * 初始化知识图谱数据
     */
    function initGraph(graph) {
        //根据不同的option类型决定不同的知识图谱数据源
        switch ($routeParams['options']) {
            case 'news': {
                //循环赋值到graph和GraphDataSer中，每次在页面中直接使用对应模块的数据
                for (let i in GraphNewsDataSer) {
                    GraphDataSer[i] = GraphNewsDataSer[i];
                    graph[i] = GraphDataSer[i];
                }
                //新闻数据类型option，获取相应节点数据
                GraphNewsSer.getNeoData();
                break;
            }
        }
    }


    /**
     * 根据不同节点类型选择展示不同菜单项
     */
    function chooseNewsShow(uniqueId, type) {
        switch ($routeParams['options']) {
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
        switch ($routeParams['options']) {
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
        switch ($routeParams['options']) {
            case 'news': {
                GraphNewsSer.chooseNodeMenu(menuType);
                break;
            }
        }
    }


    /**
     * 搜索框输入搜索对应的节点信息
     */
    function searchTargetNodes() {
        switch ($routeParams['options']) {
            case 'news': {
                GraphNewsSer.searchTargetNodes();
                break;
            }
        }
    }


    return {
        initGraph: initGraph,
        chooseNewsShow: chooseNewsShow,//菜单选择
        resetAllNodeStyle: resetAllNodeStyle,//重置节点颜色
        chooseNodeMenu: chooseNodeMenu, //选择对应节点的菜单
        getNewsOriginInfo: getNewsOriginInfo, //获取新闻原始信息
        searchTargetNodes: searchTargetNodes,//搜索对应节点信息
    }
});
