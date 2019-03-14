/**
 * Created by Administrator on 2019/2/14.
 */
var graphModule = angular.module('Angular.graph');

graphModule.factory('GraphSer', function ($rootScope, OverallDataSer, $cookies, $location, $http,GraphDataSer, OverallGeneralSer) {

    /**
     * 返问新闻原网页信息数据
     */
    let getNewsOriginInfo = function (event) {
        let uniqueId = GraphDataSer.overallData['nodeSelected']['unique_id'];
        let type = GraphDataSer.overallData['nodeSelected']['type'];
        let subUniqueId = GraphDataSer.overallData['nodeSelected']['sub_unique_id'];
        //如果是事件节点则直接在新页面打开该事件新闻
        if (type == 'visit_event') {
            window.open(GraphDataSer.neoNodeDataObj[uniqueId]['origin_url'], '_blank');
        }
        //如果是其他节点则手动打开页面按钮来访问该事件
        else {
            window.open(GraphDataSer.neoNodeDataObj[subUniqueId]['origin_url'], '_blank');
        }
        //取消消息体传递
        event.stopPropagation();
    };

    return {
        getNewsOriginInfo: getNewsOriginInfo,
    }
});
