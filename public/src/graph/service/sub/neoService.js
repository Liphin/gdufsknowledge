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
                GraphDataSer.neoNodeDataObj[k]['radius'] = 22 + Math.round(GraphDataSer.neoNodeDataObj[k]['degree']);
                GraphDataSer.neoNodeDataObj[k]['distance'] = 50 + Math.round(GraphDataSer.neoNodeDataObj[k]['degree'] * 0.5);
            }
            //装载返回节点数据
            GraphDataSer.neoData = result;

            //初始化节点渲染到页面
            NodeLinkSer.nodeLinkInit();

            // console.log('neodata',GraphDataSer.neoData);
            // console.log('neoobj', GraphDataSer.neoNodeDataObj);

        }, GraphDataSer.loader['nodeLinks'])
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


    return {
        getNeoData: getNeoData,
        chooseNodeMenu: chooseNodeMenu,
        chooseNewsShow: chooseNewsShow,
    }
});
