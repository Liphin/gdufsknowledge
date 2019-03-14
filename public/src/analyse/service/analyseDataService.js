/**
 * Created by Administrator on 2019/2/14.
 */
var analyseModule = angular.module('Angular.analyse');

analyseModule.factory('AnalyseDataSer', function () {

    //知识图谱对象数据
    let knowData = '';

    //分析数据操作
    let analyseData = {
        //---学院因公出访数据图表---
        'visit_general_list': {
            'status': false,
            'text': '2018年广外外事出访数据分析',
            'selected':'gdufs_dept',
            'file':'assets/resource/2018年出访统计总结.xlsx',

            'factor':{
                //学校部门
                'gdufs_dept': {
                    'status': false,
                    'minPeopleNum': 3,
                },
                //出访国家/地区
                'visit_nation': {
                    'status': false,
                    'minPeopleNum': 5,
                },
                //出访时间
                'visit_time': {
                    'status': false,
                    'dateArray': []
                },
                //访问类型
                'visit_type': {
                    'status': false,
                    'data': []
                },
                //访问性质（原因）
                'visit_reason': {
                    'status': false,
                    'data': []
                },
            }
        },


        //---2018年广外校级接待统计---
        'school_level_reception': {
            'status': false,
            'text': '2018年广外校级接待数据分析',
            'selected':'nation',
            'file':'assets/resource/2018年校级接待总表-交流科.xlsx',

            'factor':{
                //来访国家：柱状图
                'nation': {
                    'status': false,
                    'minPeopleNum': 3,
                },
                //接待时间：折线图
                'visit_time': {
                    'status': false,
                },
                //单位所在大洲：饼图
                'continent': {
                    'status': false,
                }
            }
        },

        //---2018年广外各学院涉外活动报批统计---
        'dept_activity_apply': {
            'status': false,
            'text': '2018广外各学院涉外活动报批统计',
            'selected':'amount',
            'file':'assets/resource/2018涉外活动报批统计-20190312更新-交流科.xlsx',

            'factor':{
                //各学院——报批场数：柱状图
                'amount': {
                    'status': false,
                    'minAmountNum': 1,
                }
            }
        },

        //---短期访学外事专家统计---
        'expert_short_visit': {
            'status': false,
            'text': '2018年广外短期访学外事专家数据分析',
            'selected':'gdufs_dept',
            'file':'assets/resource/2018年度短期访学专家统计表（XX学院或单位）12.20的.xlsx',

            'factor':{
                //学校部门
                'gdufs_dept': {
                    'status': false,
                    'minPeopleNum': 3,
                },
                //出访国家
                'visit_nation': {
                    'minPeopleNum': 4,
                    'status': false,
                },
                //出访时间
                'visit_time': {
                    'status': false,
                    'dateArray': []
                },
            }
        },

        //---2018年广外长期外教数据分析---
        'expert_long_visit': {
            'status': false,
            'text': '2018年广外长期外教专家数据分析',
            'selected':'institute_new',
            'file':'assets/resource/2018长期外教情况表汇总.xlsx',

            'factor':{
                //专家所在学院部门
                'institute_new': {
                    'status': false,
                    'minPeopleNum': 3,
                },
                //所在国籍/地区
                'nation': {
                    'minPeopleNum': 2,
                    'status': false,
                },
                //教育程度
                'education': {
                    'status': false,
                }
            }
        },

        //---2018年广外交换生数据分析---
        'exchange_student_list': {
            'status': false,
            'text': '2018年广外出国境学生数据分析',
            'selected':'institute',
            'file':'assets/resource/项目科：2018年出国境学生名单汇总.xlsx',

            'factor':{
                //邀请的学院部门
                'institute': {
                    'status': false,
                    'minPeopleNum': 3,
                },
                //交换时间
                'exchange_period': {
                    'status': false,
                    'dateArray': []
                },
                //交换学校
                'exchange_school': {
                    'status': false,
                },
                //攻读方向
                'major': {
                    'status': false,
                }
            }
        },


        //---2018年广外外事协议签署数据分析---
        'agreements': {
            'status': false,
            'text': '2018年广外外事协议签署数据分析',
            'selected':'nation',
            'file':'assets/resource/项目科：2018年签署合作协议.xlsx',

            'factor':{
                //签署国家
                'nation': {
                    'status': false,
                    'minAgreementNum': 1,
                },
                //邀请的学院部门
                'sign_time': {
                    'status': false,
                    'minPeopleNum': 3,
                }
            }
        },
    };

    return {
        knowData: knowData,
        analyseData: analyseData,
    }
});
