/**
 * Created by Administrator on 2019/3/12.
 */
var analyseModule = angular.module('Angular.analyse');

/**
 * 各学院邀请外事人员来访人数比较——柱形图
 */
analyseModule.directive('expertShortVisitBarGdufsDept', function (AnalyseDataSer) {
    return {
        restrict: 'E',
        scope: {
            minPeopleNum: '@'
        },
        template: '<div></div>',
        link: function (scope, element) {

            //监听最少人数设置，若展示的最少人数手动变动则触发此操作
            scope.$watch("minPeopleNum", function (newValue, oldValue) {
                //各学院2018年因公出访人数统
                let deptObj = {}, deptArray = [];
                for (let i in AnalyseDataSer.knowData['expert_short_visit']) {
                    let tempArray = AnalyseDataSer.knowData['expert_short_visit'][i]['department'].split("、");
                    //如果deptObj尚未有该国家/地区key则新建，否则数字递增
                    for (let j in tempArray) {
                        if (deptObj.hasOwnProperty(tempArray[j])) {
                            deptObj[tempArray[j]]++;
                        } else {
                            deptObj[tempArray[j]] = 1;
                        }
                    }
                }
                for (let j in deptObj) {
                    if (deptObj[j] >= newValue) {
                        deptArray.push([j, deptObj[j]]);
                    }
                }

                //highcharts 最原始的颜色配置
                Highcharts.setOptions({
                    colors: ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"]
                });
                Highcharts.chart(element[0], {
                    chart: {
                        type: 'column',
                        width: 800,
                        height: 500
                    },
                    title: {
                        text: '2018年广外各学院邀请外事人员短期来访人次数统计图表'
                    },
                    xAxis: {
                        type: 'category',
                        labels: {
                            rotation: -45,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Verdana, sans-serif'
                            }
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '来访人次数（单位：人次）'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:11px"></span>',
                        pointFormat: '<span style="font-size: 15px; color: black"> 来访 </span>' +
                        '<span style="font-size: 15px; color: #248dc2;font-weight: bold">{point.name}</span>' +
                        '<span style="font-size: 15px;color: #248dc2;font-weight: bold"> {point.y}</span>' +
                        '<span style="font-size: 15px; color: black"> 人次 </span>'
                    },
                    series: [{
                        name: 'Population',
                        data: deptArray,
                        dataLabels: {
                            enabled: true,
                            rotation: -90,
                            color: '#FFFFFF',
                            align: 'right',
                            format: '{point.y}', // one decimal
                            y: 10, // 10 pixels down from the top
                            style: {
                                fontSize: '13x',
                                fontFamily: '微软雅黑'
                            }
                        }
                    }]
                });
            });
        }
    };
});

/**
 * 外事专家短期来访各国家/地区——人次数：饼状图
 */
analyseModule.directive('expertShortVisitBarVisitNation', function (AnalyseDataSer, AnalyseSer, OverallGeneralSer) {
    return {
        restrict: 'E',
        scope: {
            minPeopleNum: '@',
        },
        template: '<div></div>',
        link: function (scope, element) {

            //监听最低占比设置，若手动变动则触发此操作
            scope.$watch("minPeopleNum", function (newValue, oldValue) {
                //准备填充的object和array
                let nationObj = {}, nationArray = [], totalNum = 0;
                //对每个出访地方字符串进行顿号“、”切割解析，并对每个国家/地区装载到nationObj中
                for (let i in AnalyseDataSer.knowData['expert_short_visit']) {
                    let key = AnalyseDataSer.knowData['expert_short_visit'][i]['nation'];
                    //如果nationObj尚未有该国家/地区key则新建，否则数字递增
                    if (OverallGeneralSer.checkDataNotEmpty(key)) {
                        if (nationObj.hasOwnProperty(key)) {
                            nationObj[key]++;
                        } else {
                            nationObj[key] = 1;
                        }
                        totalNum++;//总数自增，用于计算比例
                    }
                }
                //nationObj装填到nationArray中，进行highchart饼状图解析，并获取数值最大的对象
                for (let j in nationObj) {
                    //如果占比低于最小值则不进行设置，继续下一个数据
                    if (nationObj[j] >= newValue) {
                        nationArray.push([j, nationObj[j]]);
                    }
                }

                Highcharts.setOptions({
                    colors: ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"]
                });
                Highcharts.chart(element[0], {
                    chart: {
                        type: 'column',
                        width: 800,
                        height: 500
                    },
                    title: {
                        text: '2018年广外外事专家学者短期来访 各国/地区——人次数 统计图表'
                    },
                    xAxis: {
                        type: 'category',
                        labels: {
                            rotation: -45,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Verdana, sans-serif'
                            }
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '来访人次数（单位：人次）'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:11px"></span>',
                        pointFormat: '<span style="font-size: 15px; color: #248dc2;font-weight: bold">{point.name}</span>' +
                        '<span style="font-size: 15px; color: black"> 来访 </span>' +
                        '<span style="font-size: 15px;color: #248dc2;font-weight: bold">{point.y}</span>' +
                        '<span style="font-size: 15px; color: black"> 人次 </span>'
                    },
                    series: [{
                        name: 'Population',
                        colorByPoint: true,
                        data: nationArray,
                        dataLabels: {
                            enabled: true,
                            rotation: -90,
                            color: '#FFFFFF',
                            align: 'right',
                            format: '{point.y}', // one decimal
                            y: 10, // 10 pixels down from the top
                            style: {
                                fontSize: '13x',
                                fontFamily: '微软雅黑'
                            }
                        }
                    }]
                });
            });
        }
    };
});


/**
 * 外事人员短期应邀来访时间——折线图
 */
analyseModule.directive('expertShortVisitLineVisitTime', function (AnalyseDataSer, AnalyseSer) {
    return {
        restrict: 'E',
        template: '<div></div>',
        link: function (scope, element) {

            //目标日期时间
            let dateObj = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0}, dateArray = [];
            //每个出访时间周期进行解析，人数回填到dateObj
            for (let i in AnalyseDataSer.knowData['expert_short_visit']) {
                AnalyseSer.parseTargetTimeToMonth(AnalyseDataSer.knowData['expert_short_visit'][i]['arrival_time'], dateObj);
            }
            //dateObj装填到dateArray中，进行highchart折线图解析
            for (let i in dateObj) {
                dateArray.push(dateObj[i]);
            }

            Highcharts.setOptions({
                colors: ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"]
            });
            Highcharts.chart(element[0], {
                chart: {
                    width: 800,
                    height: 500
                },
                title: {
                    text: '2018年广外外事专家短期应邀来访月份——人数数据图表'
                },
                xAxis: {
                    categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                },
                yAxis: {
                    title: {
                        text: '来访人次数（单位：人次）'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size: 15px; color: #248dc2;font-weight: bold">{point.key}</span>',
                    pointFormat: '<span style="font-size: 15px; color: black"> 来访 </span>' +
                    '<span style="font-size: 15px;color: #248dc2;font-weight: bold">{point.y}</span>' +
                    '<span style="font-size: 15px; color: black"> 人次 </span>'
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: true
                    }
                },
                series: [{
                    name: '来访时间段——来访人次数',
                    data: dateArray
                }],

                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }
            });
        }
    };
});



//
//
// /**
//  * 广外外事出访类型占比——饼状图
//  */
// analyseModule.directive('visitGeneralListPieVisitType', function (AnalyseDataSer, AnalyseSer) {
//     return {
//         restrict: 'E',
//         template: '<div></div>',
//         link: function (scope, element) {
//             //准备填充的object和array
//             let typeObj = {}, typeArray = [];
//             //对每个出访类型解析，数目增加到typeObj中
//             for (let i in AnalyseDataSer.knowData['visit_general_list']) {
//                 let tempType = AnalyseDataSer.knowData['visit_general_list'][i]['visit_type'];
//                 //如果typeObj尚未有该访问类型key则新建，否则数字递增
//                 if (typeObj.hasOwnProperty(tempType)) {
//                     typeObj[tempType]++;
//                 } else {
//                     typeObj[tempType] = 0;
//                 }
//             }
//             //typeObj装填到typeArray中，进行highchart折线图解析，并获取数值最大的对象
//             let record = {'maxVal': 0, 'maxIndex': 0};
//             for (let j in typeObj) {
//                 typeArray.push({
//                     'name': j,
//                     'y': typeObj[j],
//                 });
//                 if (record['maxVal'] < typeObj[j]) {
//                     record['maxVal'] = typeObj[j];
//                     record['maxIndex'] = typeArray.length - 1;
//                 }
//             }
//             //设置第一个obj选择状态为true
//             typeArray[record['maxIndex']]['sliced'] = true;
//             typeArray[record['maxIndex']]['selected'] = true;
//
//             Highcharts.setOptions({
//                 colors: ['#50B432', '#FF9655', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FFF263', '#6AF9C4']
//             });
//             Highcharts.chart(element[0], {
//
//                 chart: {
//                     width: 800,
//                     height: 500,
//                     plotBackgroundColor: null,
//                     plotBorderWidth: null,
//                     plotShadow: false,
//                     type: 'pie'
//                 },
//                 title: {
//                     text: '2018年广外外事出访类型占比数据图表'
//                 },
//                 tooltip: {
//                     pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
//                 },
//                 plotOptions: {
//                     pie: {
//                         allowPointSelect: true,
//                         cursor: 'pointer',
//                         dataLabels: {
//                             enabled: true,
//                             format: '<b>{point.name}</b>: {point.percentage:.1f} %',
//                             style: {
//                                 color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
//                             }
//                         }
//                     }
//                 },
//                 series: [{
//                     name: '占比',
//                     colorByPoint: true,
//                     data: typeArray
//                 }]
//             });
//         }
//     };
// });
//
//
// /**
//  * 广外外事出访性质占比——饼状图
//  */
// analyseModule.directive('visitGeneralListPieVisitReason', function (AnalyseDataSer, AnalyseSer) {
//     return {
//         restrict: 'E',
//         template: '<div></div>',
//         link: function (scope, element) {
//             //准备填充的object和array
//             let reasonObj = {}, reasonArray = [];
//             //对每个出访原因解析，数目增加到reasonObj中
//             for (let i in AnalyseDataSer.knowData['visit_general_list']) {
//                 let tempType = AnalyseDataSer.knowData['visit_general_list'][i]['visit_reason'];
//                 //如果reasonObj尚未有该访问原因key则新建，否则数字递增
//                 if (reasonObj.hasOwnProperty(tempType)) {
//                     reasonObj[tempType]++;
//                 } else {
//                     reasonObj[tempType] = 0;
//                 }
//             }
//             //reasonObj装填到reasonArray中，进行highchart折线图解析，并获取数值最大的对象
//             let record = {'maxVal': 0, 'maxIndex': 0};
//             for (let j in reasonObj) {
//                 reasonArray.push({
//                     'name': j,
//                     'y': reasonObj[j],
//                 });
//                 if (record['maxVal'] < reasonObj[j]) {
//                     record['maxVal'] = reasonObj[j];
//                     record['maxIndex'] = reasonArray.length - 1;
//                 }
//             }
//             //设置第一个obj选择状态为true
//             reasonArray[record['maxIndex']]['sliced'] = true;
//             reasonArray[record['maxIndex']]['selected'] = true;
//
//             Highcharts.setOptions({
//                 colors: ['#7CB5EC', '#50B432', '#FF9655', '#ED561B', '#24CBE5', '#64E572', '#FFF263', '#6AF9C4']
//             });
//             Highcharts.chart(element[0], {
//                 chart: {
//                     width: 800,
//                     height: 500,
//                     plotBackgroundColor: null,
//                     plotBorderWidth: null,
//                     plotShadow: false,
//                     type: 'pie'
//                 },
//                 title: {
//                     text: '2018年广外外事出访性质占比数据图表'
//                 },
//                 tooltip: {
//                     pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
//                 },
//                 plotOptions: {
//                     pie: {
//                         allowPointSelect: true,
//                         cursor: 'pointer',
//                         dataLabels: {
//                             enabled: true,
//                             format: '<b>{point.name}</b>: {point.percentage:.1f} %',
//                             style: {
//                                 color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'                            }
//                         },
//                     }
//                 },
//                 series: [{
//                     name: '占比',
//                     colorByPoint: true,
//                     data: reasonArray
//                 }]
//             });
//         }
//     };
// });
