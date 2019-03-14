/**
 * Created by Administrator on 2019/2/14.
 */
var graphModule = angular.module('Angular.graph');

graphModule.controller('GraphCtrl', function ($location, $routeParams, GraphDataSer, NodeLinkSer, NeoSer,
                                              OverallGeneralSer, OverallDataSer, GraphSer) {

    var graph = this;
    graph.overallData = GraphDataSer.overallData;
    graph.nodeLinkSelectedData = GraphDataSer.nodeLinkSelectedData;
    NeoSer.getNeoData();

    /**
     * 选择展示出某新闻数据
     * @see NeoSer.chooseNewsShow
     */
    graph.chooseNewsShow = function (uniqueId, type) {
        NeoSer.chooseNewsShow(uniqueId, type)
    };

    /**
     * 搜索符合指定内容的节点数据
     */
    graph.searchTargetNode = function () {

    };

    /**
     * 用户选择普通模式后重置所有节点样式颜色等重置
     * @see NodeLinkSer.resetAllNodeStyle
     */
    graph.resetAllNodeStyle = function () {
        NodeLinkSer.resetAllNodeStyle();
    };

    /**
     * 返回新闻原网页信息数据
     */
    graph.getNewsOriginInfo=function (event) {
        GraphSer.getNewsOriginInfo(event)
    }
});






