/**
 * Created by Administrator on 2019/3/12.
 */
var analyseModule = angular.module('Angular.analyse');

/**
 * 2018年广外各学院出国境学生数据分析——柱形图
 */
analyseModule.directive('exchangeStudentBarInstituteNew', function (AnalyseDataSer) {
    return {
        restrict: 'E',
        scope: {
            minPeopleNum: '@'
        },
        template: '<div></div>',
        link: function (scope, element) {
            //监听最少人数设置，若展示的最少人数手动变动则触发此操作
            scope.$watch("minPeopleNum", function (newValue, oldValue) {
                //各学院2018年出国境学生数据
                let deptObj = {}, deptArray = [];
                for (let i in AnalyseDataSer.knowData['exchange_student_list']) {
                    let key = AnalyseDataSer.knowData['exchange_student_list'][i]['institute'];
                    //如果deptObj尚未有该学院的key则新建，否则数字递增
                    if (deptObj.hasOwnProperty(key)) {
                        deptObj[key]++;
                    } else {
                        deptObj[key] = 0;
                    }
                }
                for (let j in deptObj) {
                    if (deptObj[j] >= newValue) {
                        deptArray.push([j, deptObj[j]]);
                    }
                }
                //console.log(deptArray)

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
                        text: '2018年广外各学院出国境学生数据图表'
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
                            text: '学生人次数（单位：人次）'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size: 15px; color: #248dc2;font-weight: bold">{point.key}</span>',
                        pointFormat: '<span style="font-size: 15px; color: black"> 学生出国境 </span>' +
                        '<span style="font-size: 15px;color: #248dc2;font-weight: bold">{point.y}</span>' +
                        '<span style="font-size: 15px; color: black"> 人次 </span>'
                    },
                    series: [{
                        name: 'Population',
                        // colorByPoint: true,
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
 * 2018年广外出国境学生交流时间段数据分析——柱形图
 */
analyseModule.directive('exchangeStudentBarExchangePeriod', function (AnalyseDataSer, AnalyseSer) {
    return {
        restrict: 'E',
        scope: {
            minPeopleNum: '@'
        },
        template: '<div></div>',
        link: function (scope, element) {
            //监听最少人数设置，若展示的最少人数手动变动则触发此操作
            scope.$watch("minPeopleNum", function (newValue, oldValue) {
                //目标时间周期, key代表多少个月 TODO：后续可手动添加显示的字段数
                let dateObj = {1: {num:0, name:'一个月'}, 3:{num:0, name:'三个月'}, 6:{num:0, name:'半年'},
                    12:{num:0, name:'一年'}, 24:{num:0, name:'两年'}, 36:{num:0, name:'三年及以上'}};
                let dateArray = [];
                //每个出访时间周期进行解析，人数回填到dateObj
                for (let i in AnalyseDataSer.knowData['exchange_student_list']) {
                    AnalyseSer.parseExchangeStudentDate(AnalyseDataSer.knowData['exchange_student_list'][i]['exchange_period'], dateObj);
                }
                //dateObj装填到dateArray中，进行highchart折线图解析
                for (let i in dateObj) {
                    dateArray.push({'name':dateObj[i]['name'], 'y':dateObj[i]['num']});
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
                        text: '2018年广外学生出国境 时长——人次数 统计图表'
                    },
                    xAxis: {
                        type: 'category',
                        labels: {
                            rotation: -45,
                            style: {
                                fontSize: '17px',
                                fontFamily: 'Verdana, sans-serif'
                            }
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '学生人次数（单位：人次）'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:11px"></span>',
                        pointFormat: '<span style="font-size:15px; color: black; font-family: 微软雅黑">出国境外 </span><span style="color: #248dc2;font-weight: bold;font-size:15px; font-family: 微软雅黑">{point.name}</span><span style="font-size:15px; color: black; font-family: 微软雅黑"> 学生 : {point.y} (人次)</span>'
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: '{point.y} 人次'
                            }
                        }
                    },
                    series:[
                        {
                            "name": "学生境外留学时间段",
                            "colorByPoint": true,
                            "data": dateArray
                        }
                    ]
                });
            });
        }
    };
});

/**
 * 外事专家短期来访各国家/地区占比——饼状图
 */
// analyseModule.directive('expertLongVisitPieVisitNation', function (AnalyseDataSer, AnalyseSer, OverallGeneralSer) {
//     return {
//         restrict: 'E',
//         scope: {
//             minNationRate: '@',
//         },
//         template: '<div></div>',
//         link: function (scope, element) {
//
//             //监听最低占比设置，若手动变动则触发此操作
//             scope.$watch("minNationRate", function (newValue, oldValue) {
//                 //准备填充的object和array
//                 let nationObj = {}, nationArray = [], totalNum = 0;
//                 //对每个出访地方对每个国家/地区装载到nationObj中
//                 for (let i in AnalyseDataSer.knowData['exchange_student_list']) {
//                     let key = AnalyseDataSer.knowData['exchange_student_list'][i]['nation'];
//                     //如果nationObj尚未有该国家/地区key则新建，否则数字递增
//                     if (OverallGeneralSer.checkDataNotEmpty(key)) {
//                         if (nationObj.hasOwnProperty(key)) {
//                             nationObj[key]++;
//                         } else {
//                             nationObj[key] = 1;
//                         }
//                         totalNum++;//总数自增，用于计算比例
//                     }
//                 }
//                 //nationObj装填到nationArray中，进行highchart饼状图解析，并获取数值最大的对象
//                 let record = {'maxVal': 0, 'maxIndex': 0};
//                 for (let j in nationObj) {
//                     //如果占比低于最小值则不进行设置，继续下一个数据
//                     //console.log(j, nationObj[j], totalNum, parseFloat(nationObj[j]) / totalNum * 100, parseFloat(nationObj[j]) / totalNum * 100 < parseFloat(newValue))
//                     if (parseFloat(nationObj[j]) / totalNum * 100 < parseFloat(newValue)) continue;
//                     nationArray.push({
//                         'name': j,
//                         'y': nationObj[j],
//                     });
//                     if (record['maxVal'] < nationObj[j]) {
//                         record['maxVal'] = nationObj[j];
//                         record['maxIndex'] = nationArray.length - 1;
//                     }
//                 }
//
//                 //设置第一个obj选择状态为true
//                 nationArray[record['maxIndex']]['sliced'] = true;
//                 nationArray[record['maxIndex']]['selected'] = true;
//
//                 Highcharts.setOptions({
//                     colors: ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"]
//                 });
//                 Highcharts.chart(element[0], {
//                     chart: {
//                         width: 800,
//                         height: 500,
//                         plotBackgroundColor: null,
//                         plotBorderWidth: null,
//                         plotShadow: false,
//                         type: 'pie',
//                     },
//                     title: {
//                         text: '2018年广外长期外教专家所属国家/地区占比数据图表'
//                     },
//                     tooltip: {
//                         pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
//                     },
//                     plotOptions: {
//                         pie: {
//                             allowPointSelect: true,
//                             cursor: 'pointer',
//                             dataLabels: {
//                                 enabled: true,
//                                 format: '<b>{point.name}</b>: {point.percentage:.1f} %',
//                                 style: {
//                                     color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
//                                 }
//                             }
//                         }
//                     },
//                     series: [{
//                         name: '占比',
//                         colorByPoint: true,
//                         data: nationArray
//                     }]
//                 });
//             });
//         }
//     };
// });


/**
 * 广外长期外教专家学历占比——饼状图
 */
// analyseModule.directive('expertLongVisitPieEducation', function (AnalyseDataSer, AnalyseSer) {
//     return {
//         restrict: 'E',
//         template: '<div></div>',
//         link: function (scope, element) {
//             //准备填充的object和array
//             let educateObj = {}, educateArray = [];
//             //对每个长期外教专家学历进行解析，数目增加到educateObj中
//             for (let i in AnalyseDataSer.knowData['exchange_student_list']) {
//                 let tempType = AnalyseDataSer.knowData['exchange_student_list'][i]['education'];
//                 //如果educateObj尚未有该访问类型key则新建，否则数字递增
//                 if (educateObj.hasOwnProperty(tempType)) {
//                     educateObj[tempType]++;
//                 } else {
//                     educateObj[tempType] = 1;
//                 }
//             }
//             //educateObj装填到educateArray中，进行highchart折线图解析，并获取数值最大的对象
//             let record = {'maxVal': 0, 'maxIndex': 0};
//             for (let j in educateObj) {
//                 educateArray.push({
//                     'name': j,
//                     'y': educateObj[j],
//                 });
//                 if (record['maxVal'] < educateObj[j]) {
//                     record['maxVal'] = educateObj[j];
//                     record['maxIndex'] = educateArray.length - 1;
//                 }
//             }
//             //设置第一个obj选择状态为true
//             educateArray[record['maxIndex']]['sliced'] = true;
//             educateArray[record['maxIndex']]['selected'] = true;
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
//                     text: '2018年广外长期外教专家学历占比数据图表'
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
//                     data: educateArray
//                 }]
//             });
//         }
//     };
// });

