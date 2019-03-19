/**
 * Created by Administrator on 2019/3/19.
 * d3的相关服务，用于基础接口调用
 */

    //节点间力的作用参数
let forceProperties = {
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


function D3Service() {

    let svg, linkArray, nodeArray, nodes, links, nodesObj, screenDimension, graphSetting, nodeTypeSetting;

    /**
     * 基础元素设置
     * @param _svg svg画图节点设置
     * @param _linkArray 关系数组设置
     * @param _nodeArray 节点数组设置
     */
    function element(_svg, _linkArray, _nodeArray) {
        svg = _svg;
        linkArray = _linkArray;
        nodeArray = _nodeArray;
        return this;
    }

    /**
     * 节点/关系数据初始化
     * @param _nodes 节点数组
     * @param _links 关系数组
     * @param _nodesObj 节点对象，由节点数组转换而成
     */
    function nodeLinks(_nodes, _links, _nodesObj) {
        nodes = _nodes;
        links = _links;
        nodesObj = _nodesObj;
        return this;
    }

    /**
     * 生成图片相关设置
     * @param _screenDimension
     * @param _graphSetting
     * @param _nodeTypeSetting
     */
    function setting(_screenDimension, _graphSetting, _nodeTypeSetting) {
        screenDimension = _screenDimension;
        graphSetting = _graphSetting;
        nodeTypeSetting = _nodeTypeSetting;
        return this;
    }


    /**
     * 节点及连接关系初始化操作
     */
    function nodeLinkInit(nodeClickHandler) {
        //清空原来节点和关系连接数据
        linkArray.selectAll("line").data([]).exit().remove();
        nodeArray.selectAll("g").data([]).exit().remove();

        //添加节点及设置相关的力
        let simulation = d3.forceSimulation()
            .nodes(nodes)
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
            //如果angularjs尚未完成Windows的width和height的设置则使用
            if (screenDimension['width'] == undefined || screenDimension['width'] == '') {
                screenDimension['width'] = window.innerWidth;
                screenDimension['height'] = window.innerHeight;
            }
            simulation.force("center")
                .x(screenDimension['width'] * forceProperties.center.x)
                .y(screenDimension['height'] * forceProperties.center.y);
            simulation.force("charge")
                .strength(forceProperties.charge.strength * forceProperties.charge.enabled)
                .distanceMin(forceProperties.charge.distanceMin)
                .distanceMax(forceProperties.charge.distanceMax);
            simulation.force("collide")
                .strength(forceProperties.collide.strength * forceProperties.collide.enabled)
                .radius(function (d) {
                    return Math.round(nodesObj[d.unique_id]['radius'] * 1.68);
                })
                .iterations(forceProperties.collide.iterations);
            simulation.force("forceX")
                .strength(forceProperties.forceX.strength * forceProperties.forceX.enabled)
                .x(screenDimension['width'] * forceProperties.forceX.x);
            simulation.force("forceY")
                .strength(forceProperties.forceY.strength * forceProperties.forceY.enabled)
                .y(screenDimension['height'] * forceProperties.forceY.y);
            simulation.force("link")
                .id(function (d) {
                    return d.unique_id;
                })
                .distance(function (d) {
                    return nodesObj[d.source['unique_id']]['distance'];
                })
                .iterations(forceProperties.link.iterations)
                .links(forceProperties.link.enabled ? links : []);

            // updates ignored until this is run
            // restarts the simulation (important if simulation has already slowed down)
            simulation.alpha(1).restart();
        }


        //添加节点间的连接线
        let link = linkArray.selectAll("line")
            .data(links)
            .enter()
            .append("line")
            .attr("stroke", "#999")
            .attr("stroke-width", 2);

        //添加圆形节点及相关设置
        let node = nodeArray
            .selectAll("g")
            .data(nodes)
            .enter()
            .append("g") //添加装载节点的<g>标签，用于包装circle节点和text文本
            .attr("class", "nodeG")
            .style("cursor", "pointer")
            .attr("id", function (d, i) {
                return "nodeG" + i;
            });

        //画圆形节点
        node.append("circle")
            .attr("id", function (d, i) {
                return "nodeCircle" + i;
            })
            .attr("r", function (d) {
                return nodesObj[d.unique_id]['radius']
            })
            .attr("fill", d => {
                return nodeTypeSetting[d['label_name']]['bg'];
            })
            .attr("stroke", d => {
                return nodeTypeSetting[d['label_name']]['border_color'];
            })
            .attr("type", d => {
                return d.label_name
            })
            .attr("stroke-width", 2);

        //添加文本
        node.append("text")
            .attr("y", 4)
            .attr("fill", "black")
            .style("text-anchor", "middle")
            .style("font-size", function (d, i) {
                let textLength = d[nodeTypeSetting[d['label_name']]['textKey']].length;//文本长度
                let radius = nodesObj[d.unique_id]['radius'];//节点半径
                let tempN = Math.round((radius - 23) / 2 + 12);//临时中间变量
                if (textLength <= 3) {
                    return tempN < 12 ? (12 + "px") : (tempN + "px");

                } else {
                    return "12px";
                }
            })
            .text(d => {
                //若文本字数大于4个则用...代替展示
                let text = d[nodeTypeSetting[d['label_name']]['textKey']];
                if (text.length > 3) text = text.substring(0, 3) + "...";
                return text
            });


        //添加最后一个node节点，用于鼠标放上节点时显示节点名称，并且永远在渲染层的顶端
        let nodeTextNode = nodeArray.append("g").attr("id", "lastRefNode");

        //添加矩形节点信息信息描述面板
        nodeTextNode.append("rect")
            .attr("id", "nodeRect")
            .attr("fill", "white")
            .attr("height", 28)
            .attr("stroke", "#585858")
            .attr("stroke-width", 1);

        //添加矩形节点信息信息描述文字
        nodeTextNode.append("text")
            .attr("id", "nodeText")
            .attr("fill", "black")
            .style("font-size", "14px")
            .style("text-anchor", "middle");


        //设置节点点击事件响应
        node.on("mouseenter", (d, i) => {

            //设置节点是否显示text消息体为true，用于节点移动时tickActions判断使用
            d['textShow'] = true;

            //显示节点文本的节点，把该节点转换至特定的位置
            nodeTextNode.attr("transform", function () {
                return "translate(" + d.x + "," + d.y + ")";
            });

            //设置文本上偏移及文本内容
            nodeTextNode.select("text")
                .attr("y", function () {
                    //依据节点半径再上偏移13个单位长度即可
                    return -(nodesObj[d['unique_id']]['radius'] + 14);
                })
                .text(function () {
                    //依据不同类型显示不同文本
                    if (d['label_name'] == 'visit_event') {
                        return d['title'];

                    } else {
                        return d['cn_name'];
                    }
                });

            //设置文本背景白色矩形框的上偏移、左偏移和宽度
            nodeTextNode.select("rect")
                .attr("y", function () {
                    //依据节点半径再上偏移30个单位长度即可
                    return -(nodesObj[d['unique_id']]['radius'] + 33);
                })
                .attr("x", function () {
                    //依据不同类型显示不同文本，并根据字数确定左偏移位置
                    if (d['label_name'] == 'visit_event') {
                        return -(d['title'].length * 7 + 14);

                    } else {
                        return -(d['cn_name'].length * 7 + 14);
                    }
                })
                .attr("width", function () {
                    //依据不同类型显示不同文本，并根据字数确定宽度
                    if (d['label_name'] == 'visit_event') {
                        return d['title'].length * 14 + 28;

                    } else {
                        return d['cn_name'].length * 14 + 28;
                    }
                })


        }).on("mouseleave", (d, i) => {
            //当鼠标移开是，设置是否显示文本图标为false
            d['textShow'] = false;
            //设置文本节点位置到一个很远的位置即可
            nodeTextNode.attr("transform", function () {
                return "translate(-5000,-5000)";
            })

        }).on("click", (d, i) => {
            //若开启其他节点灰化设置，且没有按下ctrl热键时，则设置其灰化
            if (graphSetting['nodesGray']) {
                setUnRelativeNodeGray(d, i);
            }

            //鼠标处理点击节点事件的接口方法
            nodeClickHandler(d, i);
        });


        //设置节点拖拽事件响应
        node.call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

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
                //如果该节点时鼠标放上去需要显示该节点文本时，则该段文本跟随节点运动而运动
                if (d['textShow']) {
                    nodeTextNode.attr("transform", function () {
                        return "translate(" + d.x + "," + d.y + ")";
                    });
                }
                //返回该节点本身运动的位置
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
            nodeTextNode.attr("transform", function () {
                return "translate(" + d.fx + "," + d.fy + ")";
            })
        }

        /**
         * 节点拖拽完成时事件
         * @param d
         */
        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0.0001);
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
     * 设置非目标及其关联的节点未选择状态时设置为灰色
     * @param d 鼠标选中的目标节点的数据
     * @param i 鼠标选中的目标节点的index位置
     */
    function setUnRelativeNodeGray(d, i) {
        //具化该目标节点及其一度相邻节点，虚化其他节点
        let sumNodesUniqueId = [d.unique_id]; //节点信息数组
        let sumLinkUniqueId = []; //链接信息数组
        //循环查看每个链接，若source或target有对应的unique_id节点则添加至目标不变色数组
        for (let i in links) {
            let sourceUniqueId = links[i]['source']['unique_id'];
            let targetUniqueId = links[i]['target']['unique_id'];
            //若source为目标unique_id则target为和目标节点相连接的终结点
            if (sourceUniqueId == d.unique_id) {
                //添加节点信息到数组
                sumNodesUniqueId.push(targetUniqueId);
                //添加链接信息到数组
                sumLinkUniqueId.push(links[i]['attach']['unique_id'])
            }
            //若target为目标unique_id则source为和目标节点相连接的终结点
            else if (targetUniqueId == d.unique_id) {
                //添加节点信息到数组
                sumNodesUniqueId.push(sourceUniqueId);
                //添加链接信息到数组
                sumLinkUniqueId.push(links[i]['attach']['unique_id'])
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
                d3.select(this).attr("fill", nodeTypeSetting[d2.label_name]['bg']);
                d3.select(this).attr("stroke", nodeTypeSetting[d2.label_name]['border_color']);
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
        if (graphSetting['nodesGray']) {
            graphSetting['nodesGray'] = false;
            //对nodes父节点下的circle样式每个单独进行颜色设置
            d3.selectAll(".nodes circle").each(function (d2, i2) {
                d3.select(this).attr("fill", nodeTypeSetting[d2.label_name]['bg']);
                d3.select(this).attr("stroke", nodeTypeSetting[d2.label_name]['border_color']);
            });

            //对links父节点下的line样式每条线单独进行颜色设置
            d3.selectAll(".links line").each(function (d2, i2) {
                d3.select(this).attr("stroke", "#999");
            });
        }
    }


    return {
        element: element,
        nodeLinks: nodeLinks,
        setting: setting,
        nodeLinkInit: nodeLinkInit,
        resetAllNodeStyle: resetAllNodeStyle,
    }
}






