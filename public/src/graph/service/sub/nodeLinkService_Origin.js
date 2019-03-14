/**
 * Created by Administrator on 2019/3/6.
 * neo4j图数据库展示
 */
var graphModule = angular.module('Angular.graph');

graphModule.factory('NodeLinkSer', function ($sce, $rootScope, OverallDataSer, $cookies, $location, $http, OverallGeneralSer, GraphDataSer) {

    let svg = d3.select("svg");//图数据库展示
    let linkArray = d3.select(".links");//连接数组
    let nodeArray = d3.select(".nodes");//节点数组

    /**
     * 节点及连接关系初始化操作
     */
    function nodeLinkInit() {

        //清空原来节点和关系连接数据
        linkArray.selectAll("line").data([]).exit().remove();
        nodeArray.selectAll("g").data([]).exit().remove();

        //节点间连接线力的设置
        let forceLink = d3.forceLink(GraphDataSer.neoData['links'])
        //两节点间距离设置120~180之间
            .distance(function (d) {
                return GraphDataSer.neoNodeDataObj[d.source['unique_id']]['distance'];
            })
            //节点间拉力作用
            .strength(1)
            //设置节点连接起点和终点的key
            .id(function (d) {
                return d.unique_id;
            });

        //添加节点及设置相关的力
        let simulation = d3.forceSimulation()
            .nodes(GraphDataSer.neoData['nodes'])
            .force("link", forceLink) //节点连接线力的作用
            .force("charge", d3.forceManyBody().strength(-30).distanceMin(10).distanceMax(2000)) //节点相互吸引，排斥力大小及距离
            .force("collide", d3.forceCollide().strength(0.3).radius(function (d) {
                return Math.round(GraphDataSer.neoNodeDataObj[d.unique_id]['radius']*1.68);
            })) //节点间碰撞力


        //添加节点间的连接线
        let link = linkArray.selectAll("line")
            .data(GraphDataSer.neoData['links'])
            .enter()
            .append("line")
            .attr("stroke", "#999")
            .attr("stroke-width", 2);

        //添加圆形节点及相关设置
        let node = nodeArray
            .selectAll("g")
            .data(GraphDataSer.neoData['nodes'])
            .enter()
            .append("g") //添加装载节点的<g>标签，用于包装circle节点和text文本
            .style("cursor", "pointer");
        //画圆形节点
        node.append("circle")
            .attr("r", function (d) {
                return GraphDataSer.neoNodeDataObj[d.unique_id]['radius']
            })
            .attr("fill", d => {
                return GraphDataSer.nodeTypeSetting[d['label_name']]['bg'];
            })
            .attr("stroke", d => {
                return GraphDataSer.nodeTypeSetting[d['label_name']]['border_color'];
            })
            .attr("stroke-width", 2);
        //添加文本
        node.append("text")
            .attr("fill", "white")
            .attr("y", 3)
            .style("font-size", "12px")
            .style("text-anchor", "middle")
            .text(d => {
                //若文本字数大于4个则用...代替展示
                let text = d[GraphDataSer.nodeTypeSetting[d['label_name']]['textKey']];
                if (text.length > 4) text = text.substring(0, 4) + "...";
                return text
            });
        //设置节点拖拽事件响应
        node.call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        //设置节点点击事件响应
        node.on("mouseenter", (d, i) => {

        }).on("mouseleave", (d, i) => {

        }).on("click", (d, i) => {
            getNewsInfo(d, i)
        });

        //设置svg中zoom移动和缩放交互
        d3.zoom().on("zoom", zoomActions)(svg);
        //设置力导图的tick渲染事件
        simulation.on("tick", tickActions);


        /**
         * tick事件是渲染发生改变时
         */
        function tickActions() {
            //更新线段起始和终止位置
            link.attr("x1", function (d) {
                return d.source.x;
            }).attr("y1", function (d) {
                return d.source.y;
            }).attr("x2", function (d) {
                return d.target.x;
            }).attr("y2", function (d) {
                return d.target.y;
            });

            //更新节点位置
            node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        }

        /**
         * 节点拖拽开始事件
         * @param d
         */
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        /**
         * 节点拖拽运动时事件
         * @param d
         */
        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        /**
         * 节点拖拽完成时事件
         * @param d
         */
        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0.0001);
//        d.x= d.fx;
//        d.y= d.fy;
//        d.fx = null;
//        d.fy = null;
        }

        /**
         * zoom交互事件
         */
        function zoomActions() {
            linkArray.attr("transform", d3.event.transform);
            nodeArray.attr("transform", d3.event.transform);
        }
    }


    /**
     * 新闻事件数据的处理，获取对应新闻数据信息
     */
    function getNewsInfo(d, i) {
        //获取该节点类型和unique_id
        let uniqueId = d['unique_id'];
        let type = d['label_name'];

        //存储当前选择的节点相关数据
        GraphDataSer.overallData['nodeSelected']['unique_id'] = uniqueId;
        GraphDataSer.overallData['nodeSelected']['type'] = type;

        //打开相关节点信息面板
        GraphDataSer.overallData['rightBarShow'] = true;
        //先关闭所有右侧数据展示
        for (let i in GraphDataSer.nodeLinkSelectedData) {
            GraphDataSer.nodeLinkSelectedData[i]['status'] = false;
        }
        //单独开启目标数据展示
        GraphDataSer.nodeLinkSelectedData[d['label_name']]['status'] = true;

        //根据不同节点类型展示不同消息信息体
        switch (type) {
            case 'gdufs_teacher': {
                //装载相关新闻数组
                addPersonRelatedEventNews(type, uniqueId);
                break;
            }
            case 'visitor': {
                //装载相关新闻数组
                addPersonRelatedEventNews(type, uniqueId);
                break;
            }
            case 'visitor_dept': {
                break;
            }
            case 'visit_event': {
                //直接获取该新闻具体消息体，并显示在右侧面板中
                let url = OverallDataSer.urlData['frontEndHttp']['gdufsNewsOssUrl'] + "html/" + d['unique_id'] + ".html";
                OverallGeneralSer.httpGetFiles(url, result => {
                    GraphDataSer.nodeLinkSelectedData['visit_event']['info']['detail']['news'] = $sce.trustAsHtml(result);
                });
                GraphDataSer.nodeLinkSelectedData[type]['info']['detail']['status'] = true;
                break;
            }
            default: {
                return;
            }
        }
        //赋值基础数据并显示到面板
        assignGeneralData(type, i);
        //HTML页面中赋值显示出来
        $rootScope.$apply();

        console.log(GraphDataSer.nodeLinkSelectedData[type]['info']['general']['data'])
    }


    /**
     *
     * @param type
     * @param index
     */
    function assignGeneralData(type, index) {
        let node = GraphDataSer.neoData['nodes'][index];
        for (let i in node) {
            GraphDataSer.nodeLinkSelectedData[type]['info']['general']['data'][i] = node[i];
        }
    }


    /**
     * 和该人物相关的外事新闻事件搜索出来回填到对应的新闻数组中
     * @param type
     * @param uniqueId
     */
    function addPersonRelatedEventNews(type, uniqueId) {
        //清空原来新闻数组数据并重置控制数据
        GraphDataSer.nodeLinkSelectedData[type]['info']['general']['status'] = false;
        GraphDataSer.nodeLinkSelectedData[type]['info']['detail']['status'] = true;
        GraphDataSer.nodeLinkSelectedData[type]['info']['detail']['newsDetail']['status'] = false;
        GraphDataSer.nodeLinkSelectedData[type]['info']['detail']['news'].length = 0;

        //console.log('source',uniqueId);
        //从连接关系中读取所有相关新闻数据填充到数组
        for (let i in GraphDataSer.neoData['links']) {
            //读取该源点为uniqueId的节点
            //console.log(GraphDataSer.neoData['links'][i])
            if (GraphDataSer.neoData['links'][i]['source']['unique_id'] == uniqueId) {
                let eventUniqueId = GraphDataSer.neoData['links'][i]['target']['unique_id']; //目标事件节点unique_id
                let eventData = GraphDataSer.neoNodeDataObj[eventUniqueId]; //从节点对象中直接读取
                //如果是事件节点则添加，否则不添加
                if (eventData['label_name'] == 'visit_event') {
                    GraphDataSer.nodeLinkSelectedData[type]['info']['detail']['news'].push(eventData); //添加进目标新闻数组中
                }
            }
        }
    }


    return {
        nodeLinkInit: nodeLinkInit,
    }
});
