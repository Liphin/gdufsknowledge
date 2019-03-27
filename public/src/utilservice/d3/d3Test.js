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
                    "menu": [{"name": "信息详情", "icon": "fa fa-newspaper-o", "type": "infoDetail"}, {
                        "name": "相关人物",
                        "icon": "fa fa-user-o",
                        "type": "relativeAttendee"
                    }]
                },
                "visit_event_in": {
                    "bg": "#57c7e3",
                    "border_color": "#23b3d7",
                    "textKey": "title",
                    "menu": [{"name": "信息详情", "icon": "fa fa-newspaper-o", "type": "infoDetail"}, {
                        "name": "相关人物",
                        "icon": "fa fa-user-o",
                        "type": "relativeAttendee"
                    }]
                },
                "visit_event_out": {
                    "bg": "#c3aced",
                    "border_color": "#9a6ced",
                    "textKey": "title",
                    "menu": [{"name": "信息详情", "icon": "fa fa-newspaper-o", "type": "infoDetail"}, {
                        "name": "相关人物",
                        "icon": "fa fa-user-o",
                        "type": "relativeAttendee"
                    }]
                },
                "visitor_dept": {
                    "bg": "#f7d5b0",
                    "border_color": "#f3a470",
                    "textKey": "cn_name",
                    "menu": [{"name": "信息详情", "icon": "fa fa-newspaper-o", "type": "infoDetail"}, {
                        "name": "相关人物",
                        "icon": "fa fa-user-o",
                        "type": "relativeAttendee"
                    }]
                },
                "attendee": {
                    "bg": "#e6e3c0",
                    "border_color": "#8baea2",
                    "textKey": "cn_name",
                    "menu": [{"name": "信息详情", "icon": "fa fa-newspaper-o", "type": "infoDetail"}, {
                        "name": "相关事件",
                        "icon": "fa fa-user-o",
                        "type": "relativeEvent"
                    }]
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
                    let tempRadius = 22 + Math.round(nodesObj[k]['degree']);
                    nodesObj[k]['radius'] = (tempRadius > 60 ? 60 : tempRadius); //最大的半径不能大于60
                    nodesObj[k]['distance'] = 50 + Math.round(nodesObj[k]['degree'] * 0.5);
                }

                D3Service()
                    .element(svg, linkArray, nodeArray)
                    .nodeLinks(nodes, links, nodesObj)
                    .d3Setting(graphSetting, nodeTypeSetting)
                    .interaction(
                        (d, i) => {
                            //console.log('enter', d, i);
                        },
                        (d, i) => {
                            //console.log('leave', d, i);
                        },
                        (d, i) => {

                            //若热键按住ctrl+点击事件执行click回调
                            if (OverallDataSer.keyBoard['ctrl']) {
                                console.log('ctrl click')

                            } else {
                                //若开启其他节点灰化设置，且没有按下ctrl热键时，则设置其他节点灰化，只与之相关的节点展示颜色
                                if (graphSetting['nodesGray']) {
                                    D3Service().setUnRelativeNodeGray(d, i, nodeTypeSetting, links);
                                }
                            }
                        }
                    )
                    .nodeLinkInit(); //最后才执行此创建步骤
            });
        }, 1000)
    }

    return {
        targetTest: targetTest,
    }

});