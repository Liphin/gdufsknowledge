/**
 * Created by Administrator on 2019/3/19.
 * 用于测试d3的操作
 */

var utilServiceModule = angular.module('Angular.utilService');

utilServiceModule.service("D3Test", function (OverallGeneralSer, OverallDataSer) {

    function targetTest() {
        //测试d3封装方法体
        setTimeout(function () {

            let svg = d3.select("svg");//图数据库展示
            let linkArray = d3.select(".links");//连接数组
            let nodeArray = d3.select(".nodes");//节点数组

            let screenDimension = {
                width: window.innerWidth,
                height: window.innerHeight,
            };
            let graphSetting = {
                nodesGray: true
            };
            let nodeTypeSetting = {
                "gdufs_dept": {
                    "bg": "#ecb5c9",
                    "border_color": "#da7298",
                    "textKey": "cn_name",
                },
                "gdufs_teacher": {
                    "bg": "#f79767",
                    "border_color": "#f36924",
                    "textKey": "cn_name",
                },
                "visit_event": {
                    "bg": "#57c7e3",
                    "border_color": "#23b3d7",
                    "textKey": "title",
                },
                "visitor": {
                    "bg": "#e088a8",
                    "border_color": "#bb3264",
                    "textKey": "cn_name",
                },
                "visitor_dept": {
                    "bg": "#f7d5b0",
                    "border_color": "#f3a470",
                    "textKey": "cn_name",
                }
            };

            OverallGeneralSer.httpPostData3({}, OverallDataSer.urlData['frontEndHttp']['getAllNodeAndLinksData'], function (result) {
                let nodes = result['nodes'];
                let links = result['links'];
                let nodesObj = {};
                //转换节点为以unique_id为key的对象，用于后续查找节点
                for (let i in nodes) {
                    nodes[i]['index'] = i; //记录该节点所在nodes中的下标index
                    nodes[i]['degree'] = 0; //记录入度和出度的数目，用来计算节点的大小
                    nodesObj[nodes[i]['unique_id']] = nodes[i]
                }
                //通过关系Links计算每个节点的度数，入度数和出度数
                for (let j in links) {
                    nodesObj[links[j]['source']]['degree']++
                    nodesObj[links[j]['target']]['degree']++
                }
                //设置每个节点的radius
                for (let k in nodesObj) {
                    nodesObj[k]['radius'] = 22 + Math.round(nodesObj[k]['degree']);
                    nodesObj[k]['distance'] = 50 + Math.round(nodesObj[k]['degree'] * 0.5);
                }

                new D3Service()
                    .element(svg, linkArray, nodeArray)
                    .nodeLinks(nodes, links, nodesObj)
                    .setting(screenDimension, graphSetting, nodeTypeSetting)
                    .nodeLinkInit((d, i) => {
                        //填写鼠标按下该节点后的相关相应操作
                        console.log(d, i);
                    });
            });
        }, 1000)
    }

    return{
        targetTest:targetTest,
    }

});