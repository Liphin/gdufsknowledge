/**
 * Created by Administrator on 2019/3/6.
 * neo4j图数据库展示
 */
var graphModule = angular.module('Angular.graph');

graphModule.factory('NodeLinkSer', function ($sce, $rootScope, OverallDataSer, $cookies, $location, $http, OverallGeneralSer, GraphDataSer) {

    let svg, linkArray, nodeArray;//节点数组

    /**
     * 节点及连接关系初始化操作
     */
    function nodeLinkInit() {
        svg = d3.select("svg");//图数据库展示
        linkArray = d3.select(".links");//连接数组
        nodeArray = d3.select(".nodes");//节点数组

        //清空原来节点和关系连接数据
        linkArray.selectAll("line").data([]).exit().remove();
        nodeArray.selectAll("g").data([]).exit().remove();

        let // values for all forces
            forceProperties = {
                center: {
                    x: 0.5,
                    y: 0.5
                },
                charge: {
                    enabled: true,
                    strength: -30,
                    distanceMin: 1,
                    distanceMax: 2000
                },
                collide: {
                    enabled: true,
                    strength: .7,
                    iterations: 1,
                    radius: 5
                },
                forceX: {
                    enabled: false,
                    strength: .1,
                    x: .5
                },
                forceY: {
                    enabled: false,
                    strength: .1,
                    y: .5
                },
                link: {
                    enabled: true,
                    distance: 30,
                    iterations: 1
                }
            };


        //添加节点及设置相关的力
        let simulation = d3.forceSimulation()
            .nodes(GraphDataSer.neoData['nodes'])
            .force("link", d3.forceLink())
            .force("charge", d3.forceManyBody())
            .force("collide", d3.forceCollide())
            .force("center", d3.forceCenter())
            .force("forceX", d3.forceX())
            .force("forceY", d3.forceY());
        // apply properties to each of the forces
        updateForces();

        // apply new force properties
        function updateForces() {
            // get each force by name and update the properties
            simulation.force("center")
                .x(OverallDataSer.overallData['screen']['width'] * forceProperties.center.x)
                .y(OverallDataSer.overallData['screen']['height'] * forceProperties.center.y);
            simulation.force("charge")
                .strength(forceProperties.charge.strength * forceProperties.charge.enabled)
                .distanceMin(forceProperties.charge.distanceMin)
                .distanceMax(forceProperties.charge.distanceMax);
            simulation.force("collide")
                .strength(forceProperties.collide.strength * forceProperties.collide.enabled)
                .radius(function (d) {
                    return Math.round(GraphDataSer.neoNodeDataObj[d.unique_id]['radius'] * 1.68);
                })
                .iterations(forceProperties.collide.iterations);
            simulation.force("forceX")
                .strength(forceProperties.forceX.strength * forceProperties.forceX.enabled)
                .x(OverallDataSer.overallData['screen']['width'] * forceProperties.forceX.x);
            simulation.force("forceY")
                .strength(forceProperties.forceY.strength * forceProperties.forceY.enabled)
                .y(OverallDataSer.overallData['screen']['height'] * forceProperties.forceY.y);
            simulation.force("link")
                .id(function (d) {
                    return d.unique_id;
                })
                .distance(function (d) {
                    return GraphDataSer.neoNodeDataObj[d.source['unique_id']]['distance'];
                })
                .iterations(forceProperties.link.iterations)
                .links(forceProperties.link.enabled ? GraphDataSer.neoData['links'] : []);

            // updates ignored until this is run
            // restarts the simulation (important if simulation has already slowed down)
            simulation.alpha(1).restart();
        }


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
            .attr("id", function (d, i) {
                return "nodeG" + i;
            })
            .attr("class", "nodeG")
            .style("cursor", "pointer");

        //画圆形节点
        node.append("circle")
            .attr("id", function (d, i) {
                return "nodeCircle" + i;
            })
            .attr("r", function (d) {
                return GraphDataSer.neoNodeDataObj[d.unique_id]['radius']
            })
            .attr("fill", d => {
                return GraphDataSer.nodeTypeSetting[d['label_name']]['bg'];
            })
            .attr("stroke", d => {
                return GraphDataSer.nodeTypeSetting[d['label_name']]['border_color'];
            })
            .attr("type", d => {
                return d.label_name
            })
            .attr("stroke-width", 2);

        //添加文本
        node.append("text")
            .attr("fill", "black")
            .attr("y", 4)
            .style("font-size", function (d, i) {
                let textLength = d[GraphDataSer.nodeTypeSetting[d['label_name']]['textKey']].length;//文本长度
                let radius = GraphDataSer.neoNodeDataObj[d.unique_id]['radius'];//节点半径
                let tempN = Math.round((radius - 23) / 2 + 12);//临时中间变量
                if (textLength <= 3) {
                    return tempN < 12 ? (12 + "px") : (tempN + "px");

                } else {
                    return "12px";
                }
            })
            .style("text-anchor", "middle")
            .text(d => {
                //若文本字数大于4个则用...代替展示
                let text = d[GraphDataSer.nodeTypeSetting[d['label_name']]['textKey']];
                if (text.length > 3) text = text.substring(0, 3) + "...";
                return text
            });

        //添加矩形节点信息信息描述面板
        node.append("rect")
            .attr("id", function (d, i) {
                return "nodeRect" + i;
            })
            .attr("fill", "white")
            .attr("y", function (d) {
                //依据节点半径再上偏移30个单位长度即可
                return -(GraphDataSer.neoNodeDataObj[d.unique_id]['radius'] + 33);
            })
            .attr("x", function (d) {
                //依据不同类型显示不同文本，并根据字数确定左偏移位置
                if (d.label_name == 'visit_event') {
                    return -(d.title.length * 7 + 14);

                } else {
                    return -(d.cn_name.length * 7 + 14);
                }
            })
            .attr("width", function (d) {
                //依据不同类型显示不同文本，并根据字数确定宽度
                if (d.label_name == 'visit_event') {
                    return d.title.length * 14 + 28;

                } else {
                    return d.cn_name.length * 14 + 28;
                }
            })
            .attr("height", 28)
            .attr("stroke", "#585858")
            .attr("stroke-width", 1)
            .attr("visibility", "hidden");

        //添加矩形节点信息信息描述文字
        node.append("text")
            .attr("id", function (d, i) {
                return "nodeText" + i;
            })
            .attr("y", function (d) {
                //依据节点半径再上偏移13个单位长度即可
                return -(GraphDataSer.neoNodeDataObj[d.unique_id]['radius'] + 14);
            })
            .attr("fill", "black")
            .style("font-size", "14px")
            .style("text-anchor", "middle")
            .attr("visibility", "hidden")
            .text(function (d) {
                //依据不同类型显示不同文本
                if (d.label_name == 'visit_event') {
                    return d.title;

                } else {
                    return d.cn_name;
                }
            });


        //设置节点拖拽事件响应
        node.call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        //设置节点点击事件响应
        node.on("mouseenter", (d, i) => {
            d3.select("#nodeRect" + i).attr("visibility", "visible");
            d3.select("#nodeText" + i).attr("visibility", "visible");

        }).on("mouseleave", (d, i) => {
            d3.select("#nodeRect" + i).attr("visibility", "hidden");
            d3.select("#nodeText" + i).attr("visibility", "hidden");

        }).on("click", (d, i) => {
            //获取与该节点相关联的节点信息
            getNewsInfo(d, i);

            //若开启其他节点灰化设置，且没有按下ctrl热键时，则设置其灰化
            if (GraphDataSer.overallData['graphSetting']['nodesGray'] && !OverallDataSer.keyBoard['ctrl']) {
                setUnRelativeNodeGray(d, i);
            }
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
                addRelatedEventNews(type, uniqueId);
                break;
            }
            case 'visitor': {
                //装载相关新闻数组
                addRelatedEventNews(type, uniqueId);
                break;
            }
            case 'gdufs_dept': {
                //装载相关新闻数组
                addRelatedEventNews(type, uniqueId);
                GraphDataSer.nodeLinkSelectedData[type]['info']['general']['status'] = true; //单独设置部门信息显示为true，展开部门信息
                break;
            }
            case 'visitor_dept': {
                //装载相关新闻数组
                addRelatedEventNews(type, uniqueId);
                GraphDataSer.nodeLinkSelectedData[type]['info']['general']['status'] = true; //单独设置部门信息显示为true，展开部门信息
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
     * 和该人物或部门相关的外事新闻事件搜索出来回填到对应的新闻数组中
     * @param type
     * @param uniqueId
     */
    function addRelatedEventNews(type, uniqueId) {
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


    /**
     * 设置非目标及其关联的节点未选择状态时设置为灰色
     * @param d 鼠标选中的目标节点的数据
     * @param i 鼠标选中的目标节点的index位置
     */
    function setUnRelativeNodeGray(d, i) {
        //具化该目标节点及其一度相邻节点，虚化其他节点
        let sumNodesUniqueId = [d.unique_id]; //节点信息数组
        let sumLinkUniqueId = []; //链接信息数组
        //循环查看每个链接，若source或target有对应的unique_id节点则添加至目标不变色数组
        for (let i in GraphDataSer.neoData['links']) {
            let sourceUniqueId = GraphDataSer.neoData['links'][i]['source']['unique_id'];
            let targetUniqueId = GraphDataSer.neoData['links'][i]['target']['unique_id'];
            //若source为目标unique_id则target为和目标节点相连接的终结点
            if (sourceUniqueId == d.unique_id) {
                //添加节点信息到数组
                sumNodesUniqueId.push(targetUniqueId);
                //添加链接信息到数组
                sumLinkUniqueId.push(GraphDataSer.neoData['links'][i]['attach']['unique_id'])
            }
            //若target为目标unique_id则source为和目标节点相连接的终结点
            else if (targetUniqueId == d.unique_id) {
                //添加节点信息到数组
                sumNodesUniqueId.push(sourceUniqueId);
                //添加链接信息到数组
                sumLinkUniqueId.push(GraphDataSer.neoData['links'][i]['attach']['unique_id'])
            }
        }

        //选择所有节点进行迭代属性设置
        d3.selectAll(".nodes circle").each(function (d2, i2) {
            //如果该节点在目标节点的范围内则进行填充灰色
            if (sumNodesUniqueId.indexOf(d2.unique_id) == -1) {
                d3.select(this).attr("fill", "#c4c4c4");
                d3.select(this).attr("stroke", "#c4c4c4");

            }
            //否则进行填充指定的颜色
            else {
                d3.select(this).attr("fill", GraphDataSer.nodeTypeSetting[d2.label_name]['bg']);
                d3.select(this).attr("stroke", GraphDataSer.nodeTypeSetting[d2.label_name]['border_color']);
            }
        });

        //console.log(sumLinkUniqueId);
        //选择所有链接进行迭代属性设置
        d3.selectAll(".links line").each(function (d2, i2) {
            //如果该节点在目标节点的范围内则进行填充灰色
            //console.log(d2.attach.unique_id)
            if (sumLinkUniqueId.indexOf(d2.attach.unique_id) == -1) {
                d3.select(this).attr("stroke", "#999");

            }
            //否则进行填充指定的颜色
            else {
                d3.select(this).attr("stroke", "#007a32");
            }
        });
    }


    /**
     * 重置显示所有节点颜色
     */
    function resetAllNodeStyle() {
        //若之前是聚焦灰化模式则进行更改设置，否则不进行更改
        if (GraphDataSer.overallData['graphSetting']['nodesGray']) {
            GraphDataSer.overallData['graphSetting']['nodesGray'] = false;
            //对nodes父节点下的circle样式每个单独进行颜色设置
            d3.selectAll(".nodes circle").each(function (d2, i2) {
                d3.select(this).attr("fill", GraphDataSer.nodeTypeSetting[d2.label_name]['bg']);
                d3.select(this).attr("stroke", GraphDataSer.nodeTypeSetting[d2.label_name]['border_color']);
            });

            //对links父节点下的line样式每条线单独进行颜色设置
            d3.selectAll(".links line").each(function (d2, i2) {
                d3.select(this).attr("stroke", "#999");
            });
        }
    }


    return {
        nodeLinkInit: nodeLinkInit,
        resetAllNodeStyle: resetAllNodeStyle,
    }
});