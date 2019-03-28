/**
 * Created by Administrator on 2019/2/14.
 */
var graphModule = angular.module('Angular.graph');

graphModule.factory('GraphExchangeDataSer', function () {

    let overallData = {
        leftBarShow: true,
        rightBarShow: false,
        renderSvgGraph: true, //是否渲染svg数据
        nodeSelected: { //选择了的节点类型和unique_id信息
            unique_id: "",
            type: "", //记录对应gdufs_dept, visit_event, visitor_event类型，不同类型有不同的显示颜色
            sub_unique_id: "", //对应节点的子unique_id
        },
        nodeHover: { //鼠标放在节点上方时记录该节点
            unique_id: "",
            type: "", //记录对应gdufs_dept, visit_event, visitor_event类型，不同类型有不同的菜单选择
            status: false, //记录是否出现该节点被hover
        },
        nodeMenu: { //是否显示该节点的菜单信息
            status: false,
            position: {x: 0, y: 0}
        },
        search: {
            text: "",
        },
        graphSetting: { //节点图的设置描述
            nodesGray: true, //是否设置非目标及其关联的节点未选择状态时设置为灰色
        },
        graphPath: { //目标知识图谱节点图路径
            layer1: {name: '2018年广外外事交流数据知识图谱'},
            layer2: {name: ''}
        }
    };

    //该交换学生的原始数据
    let originalData = '';

    //渲染到d3节点上时的活跃数据
    let renderData = {
        obj: {},
        array: {nodes: [], links: []},
    };

    let allNodeLinkData = {
        obj: {},
        array: {nodes: [], links: []},
    };

    //读取的节点和连接关系数据设置
    let nodeTypeSetting = {
        gdufs_dept: {
            bg: "#ecb5c9",
            border_color: "#da7298",
            textKey: "cn_name",
            menu: [{name: "信息详情", icon: "fa fa-newspaper-o", type: "infoDetail"}, {
                name: "相关人物",
                icon: "fa fa-user-o",
                type: "relativeAttendee"
            }]
        },
        visit_event_in: {
            bg: "#57c7e3",
            border_color: "#23b3d7",
            textKey: "title",
            menu: [{name: "信息详情", icon: "fa fa-newspaper-o", type: "infoDetail"}, {
                name: "相关人物",
                icon: "fa fa-user-o",
                type: "relativeAttendee"
            }]
        },
        visit_event_out: {
            bg: "#c3aced",
            border_color: "#9a6ced",
            textKey: "title",
            menu: [{name: "信息详情", icon: "fa fa-newspaper-o", type: "infoDetail"}, {
                name: "相关人物",
                icon: "fa fa-user-o",
                type: "relativeAttendee"
            }]
        },
        visitor_dept: {
            bg: "#f7d5b0",
            border_color: "#f3a470",
            textKey: "cn_name",
            menu: [{name: "信息详情", icon: "fa fa-newspaper-o", type: "infoDetail"}, {
                name: "相关人物",
                icon: "fa fa-user-o",
                type: "relativeAttendee"
            }]
        },
        attendee: {
            bg: "#e6e3c0",
            border_color: "#8baea2",
            textKey: "cn_name",
            menu: [{name: "信息详情", icon: "fa fa-newspaper-o", type: "infoDetail"}, {
                name: "相关事件",
                icon: "fa fa-user-o",
                type: "relativeEvent"
            }]
        }
    };

    /**
     * 选择了的节点相关数据
     * （如广外教师节点，则纪录该节点基础数据及所有相关连接的事件节点）
     */
    let nodeLinkSelectedData = {
        gdufs_dept: {
            status: false,
            info: {
                general: { //该部门的个人信息数据
                    status: false,
                    data: {},//该教师个人数据
                },
                detail: { //该教师所相关联的具体新闻数据
                    status: true,
                    news: [], //装载具体新闻数据节点对象
                    newsDetail: {
                        status: false, //是否展开显示某条新闻具体详情
                        news: "",//具体新闻HTML内容
                    },//该新闻的详情
                }
            }
        },
        visitor_dept: {
            status: false,
            info: {
                general: { //该来访嘉宾所在单位信息数据
                    status: true,
                    data: {},//该单位数据
                },
                detail: { //来访者所在部门的具体连接到的事件
                    status: true,
                    news: [], //装载具体新闻数据节点对象
                    newsDetail: {
                        status: false, //是否展开显示某条新闻具体详情
                        news: "",//具体新闻HTML内容
                    },//该新闻的详情
                }
            }
        },
        visit_event_in: {
            status: false, //来访节点
            info: {
                general: { //该新闻的基础数据
                    status: false,
                    data: {},//该来访事件的基础数据
                },
                detail: { //具体新闻数据
                    status: false,//是否展开状态
                    news: "",//具体新闻HTML内容
                }
            }
        },
        visit_event_out: {
            status: false, //出访节点
            info: {
                general: { //该新闻的基础数据
                    status: false,
                    data: {},//该来访事件的基础数据
                },
                detail: { //具体新闻数据
                    status: false,//是否展开状态
                    news: "",//具体新闻HTML内容
                }
            }
        },
        attendee: {
            status: false,
            info: {
                general: { //该出访人的个人信息数据
                    status: false,
                    data: {},//该出访人个人数据
                },
                detail: { //该出访人所相关联的具体新闻数据
                    status: true,
                    news: [], //装载具体新闻数据节点对象
                    newsDetail: {
                        status: false, //是否展开显示某条新闻具体详情
                        news: "",//具体新闻HTML内容
                    },//该新闻的详情
                }
            }
        },
    };

    /**
     * 加载loading属性
     */
    let loader = {
        nodeLinks: {status: false},
        nodeDetail: {status: false},
    };


    return {
        loader: loader,
        renderData: renderData,
        nodeTypeSetting: nodeTypeSetting,
        overallData: overallData,
        originalData: originalData,
        allNodeLinkData:allNodeLinkData,
        nodeLinkSelectedData: nodeLinkSelectedData,
    }
});
