/**
 * Created by Administrator on 2019/2/14.
 */
var graphModule = angular.module('Angular.graph');

graphModule.factory('GraphDataSer', function () {

    let overallData = {
        'leftBarShow': true,
        'rightBarShow': false,
        //'lockRightBar': false,//标识是否锁定右侧展开面板，弃用<deprecated>
        "nodeSelected": { //选择了的节点类型和unique_id信息
            "unique_id": "",
            "type": "", //记录对应gdufs_dept, visit_event, visitor_event类型，不同类型有不同的显示颜色
            "sub_unique_id": "", //对应节点的子unique_id
        },
        "nodeHover": { //鼠标放在节点上方时记录该节点
            "unique_id": "",
            "type": "", //记录对应gdufs_dept, visit_event, visitor_event类型，不同类型有不同的菜单选择
            "status": false, //记录是否出现该节点被hover
        },
        "nodeMenu": { //是否显示该节点的菜单信息
            "status": false,
            "position": {"x": 0, "y": 0}
        },
        "search": {
            "text": "",
        },
        "graphSetting": { //节点图的设置描述
            "nodesGray": true, //是否设置非目标及其关联的节点未选择状态时设置为灰色
        }
    };


    /**
     * 目标知识图谱节点图
     */
    let graphPath = {};


    //从Neo4j数据库中读取相关数据并展示
    let neoData = {
        //节点数据
        "nodes": [
            {"name": "Travis", "sex": "M", "cn_name": "柯晓华"},
            {"name": "Rake", "sex": "M", "cn_name": "RakeRakeRakeRake"},
            {"name": "Diana", "sex": "F", "cn_name": "DianaDiana"},
            {"name": "Rachel", "sex": "F", "cn_name": "Rachel"},
            {"name": "Shawn", "sex": "M", "cn_name": "Shawn"},
            {"name": "Emerald", "sex": "F", "cn_name": "Emerald"}
        ],
        //连接关系数据
        "links": [
            {"source": "Travis", "target": "Rake", "cn_name": "柯晓华"},
            {"source": "Diana", "target": "Rake", "cn_name": "RakeRakeRakeRake"},
            {"source": "Diana", "target": "Rachel", "cn_name": "DianaDiana"},
            {"source": "Rachel", "target": "Rake", "cn_name": "Rachel"},
            {"source": "Rachel", "target": "Shawn", "cn_name": "Shawn"},
            {"source": "Emerald", "target": "Rachel", "cn_name": "Emerald"}
        ]
    };
    //单独以unique_id为键装载节点的对象
    let neoNodeDataObj = {};


    //读取的节点和连接关系数据设置
    let nodeTypeSetting = {
        "gdufs_dept": {
            "bg": "#ecb5c9",
            "border_color": "#da7298",
            "textKey": "cn_name",
            "menu": [{"name": "事件详情", "icon": "fa fa-newspaper-o", "type": "newsDetail"}, {
                "name": "相关人物",
                "icon": "fa fa-user-o",
                "type": "relativePeople"
            }]
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
            "menu": [{"name": "事件详情", "icon": "fa fa-newspaper-o", "type": "newsDetail"}, {
                "name": "相关人物",
                "icon": "fa fa-user-o",
                "type": "relativePeople"
            }]
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
            "menu": [{"name": "事件详情", "icon": "fa fa-newspaper-o", "type": "newsDetail"}, {
                "name": "相关人物",
                "icon": "fa fa-user-o",
                "type": "relativePeople"
            }]
        }
    };

    /**
     * 选择了的节点相关数据
     * （如广外教师节点，则纪录该节点基础数据及所有相关连接的事件节点）
     */
    let nodeLinkSelectedData = {
        "gdufs_dept": {
            "status": false,
            "info": {
                "general": { //该部门的个人信息数据
                    "status": false,
                    "data": {},//该教师个人数据
                },
                "detail": { //该教师所相关联的具体新闻数据
                    "status": true,
                    "news": [], //装载具体新闻数据节点对象
                    "newsDetail": {
                        "status": false, //是否展开显示某条新闻具体详情
                        "news": "",//具体新闻HTML内容
                    },//该新闻的详情
                }
            }
        },
        "gdufs_teacher": {
            "status": false,
            "info": {
                "general": { //该教师的个人信息数据
                    "status": false,
                    "data": {},//该教师个人数据
                },
                "detail": { //该教师所相关联的具体新闻数据
                    "status": true,
                    "news": [], //装载具体新闻数据节点对象
                    "newsDetail": {
                        "status": false, //是否展开显示某条新闻具体详情
                        "news": "",//具体新闻HTML内容
                    },//该新闻的详情
                }
            }
        },
        "visitor": {
            "status": false,
            "info": {
                "general": { //该来访嘉宾的个人信息数据
                    "status": false,
                    "data": {},//该来访嘉宾个人数据
                },
                "detail": { //该来访嘉宾所相关联的具体新闻数据
                    "status": true,
                    "news": [], //装载具体新闻数据节点对象
                    "newsDetail": {
                        "status": false, //是否展开显示某条新闻具体详情
                        "news": "",//具体新闻HTML内容
                    },//该新闻的详情
                }
            }
        },
        "visitor_dept": {
            "status": false,
            "info": {
                "general": { //该来访嘉宾所在单位信息数据
                    "status": true,
                    "data": {},//该单位数据
                },
                "detail": { //来访者所在部门的具体连接到的事件
                    "status": true,
                    "news": [], //装载具体新闻数据节点对象
                    "newsDetail": {
                        "status": false, //是否展开显示某条新闻具体详情
                        "news": "",//具体新闻HTML内容
                    },//该新闻的详情
                }
            }
        },
        "visit_event": {
            "status": false, //是否选中该类型的节点数据
            "info": {
                "general": { //该新闻的基础数据
                    "status": false,
                    "data": {},//该来访事件的基础数据
                },
                "detail": { //具体新闻数据
                    "status": false,//是否展开状态
                    "news": "",//具体新闻HTML内容
                }
            }
        },
    };


    /**
     * 加载loading属性
     */
    var loader = {
        "nodeLinks": {"status": false},
        "nodeDetail": {"status": false},
    };


    return {
        loader: loader,
        neoData: neoData,
        graphPath: graphPath,
        neoNodeDataObj: neoNodeDataObj,
        nodeTypeSetting: nodeTypeSetting,
        overallData: overallData,
        nodeLinkSelectedData: nodeLinkSelectedData,
    }
});
