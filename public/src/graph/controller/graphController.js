/**
 * Created by Administrator on 2019/2/14.
 */
var graphModule = angular.module('Angular.graph');

graphModule.controller('GraphCtrl', function ($location, $routeParams, GraphDataSer, NodeLinkSer, NeoSer, OverallGeneralSer, OverallDataSer) {

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
    graph.getNewsOriginInfo=function () {
        let uniqueId = GraphDataSer.overallData['nodeSelected']['unique_id'];
        let type = GraphDataSer.overallData['nodeSelected']['type'];
        let subUniqueId = GraphDataSer.overallData['nodeSelected']['sub_unique_id'];
        if(type=='visit_event'){
            return GraphDataSer.neoNodeDataObj[uniqueId]['origin_url'];
        }else {
            return GraphDataSer.neoNodeDataObj[subUniqueId]['origin_url'];
        }
    }
});






