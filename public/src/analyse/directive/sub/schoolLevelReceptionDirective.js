/**
 * Created by Administrator on 2019/3/12.
 */
var analyseModule = angular.module('Angular.analyse');

/**
 * 2018年广外校级接待（国家/地区——人次）柱形图
 */
analyseModule.directive('schoolLevelReceptionBarNation', function (AnalyseDataSer) {
    return {
        restrict: 'E',
        scope: {
            minPeopleNum: '@'
        },
        template: '<div></div>',
        link: function (scope, element) {
            //监听最少人数设置，若展示的最少人数手动变动则触发此操作
            scope.$watch("minPeopleNum", function (newValue, oldValue) {
                let nationObj = {}, nationArray = [];
                for (let i in AnalyseDataSer.knowData['school_level_reception']) {
                    let keyArray = AnalyseDataSer.knowData['school_level_reception'][i]['nation'].split("、");
                    for (let j in keyArray) {
                        //如果nationObj尚未有该学院的key则新建，否则数字递增
                        if (nationObj.hasOwnProperty(keyArray[j])) {
                            nationObj[keyArray[j]] += AnalyseDataSer.knowData['school_level_reception'][i]['people_num'];
                        } else {
                            nationObj[keyArray[j]] = AnalyseDataSer.knowData['school_level_reception'][i]['people_num'];
                        }
                    }
                }
                for (let j in nationObj) {
                    if (nationObj[j] >= newValue) {
                        nationArray.push([j, nationObj[j]]);
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
                        text: '2018年广外校级外事接待各国/地区单位来访统计图'
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
                            text: '嘉宾人次数（单位：人次）'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:11px"></span>',
                        pointFormat: '<span style="font-size: 15px; color: #248dc2;font-weight: bold">{point.name}</span>' +
                        '<span style="font-size: 15px; color: black"> 嘉宾 </span>' +
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
 * 2018年广外校级接待来访 时间——人次 折线图
 */
analyseModule.directive('schoolLevelReceptionLineSignTime', function (AnalyseDataSer, AnalyseSer) {
    return {
        restrict: 'E',
        template: '<div></div>',
        link: function (scope, element) {

            //目标时间周期, key代表多少个月 TODO：后续可手动添加显示的字段数
            let dateObj = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0}, dateArray = [];
            //每个出访时间周期进行解析，人数回填到dateObj
            for (let i in AnalyseDataSer.knowData['school_level_reception']) {
                AnalyseSer.parseTargetTimeToMonth(AnalyseDataSer.knowData['school_level_reception'][i]['visit_time'], dateObj);
            }
            //dateObj装填到dateArray中，进行highchart折线图解析
            for (let i in dateObj) {
                dateArray.push(dateObj[i]);
            }

            //highcharts 最原始的颜色配置
            Highcharts.setOptions({
                colors: ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"]
            });
            Highcharts.chart(element[0], {
                chart: {
                    width: 800,
                    height: 500
                },
                title: {
                    text: '2018年广外校级接待外事来访嘉宾的 时间段——人次数 折线图'
                },
                xAxis: {
                    categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                },
                yAxis: {
                    title: {
                        text: '嘉宾人次数（单位：人次）'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size: 15px; color: #248dc2;font-weight: bold">{point.key}</span>',
                    pointFormat: '<span style="font-size: 15px; color: black"> 校级接待 </span>' +
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
                    name: '接待时间段——嘉宾人次数',
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

/**
 * 2018年广外校级接待来访嘉宾单位所在大洲占比
 */
analyseModule.directive('schoolLevelReceptionPieContinent', function (AnalyseDataSer, AnalyseSer, OverallGeneralSer) {
    return {
        restrict: 'E',
        scope: {
            minNationRate: '@',
        },
        template: '<div></div>',
        link: function (scope, element) {
            //准备填充的object和array
            let continentObj = {}, continentArray = [], totalNum = 0;
            for (let i in AnalyseDataSer.knowData['school_level_reception']) {
                let keyArray = AnalyseDataSer.knowData['school_level_reception'][i]['continent'].split("、");
                for(let j in keyArray){
                    //如果continentObj尚未有该大洲的key则新建，否则数字递增
                    if (OverallGeneralSer.checkDataNotEmpty(keyArray[j])) {
                        if (continentObj.hasOwnProperty(keyArray[j])) {
                            continentObj[keyArray[j]]++;
                        } else {
                            continentObj[keyArray[j]] = 1;
                        }
                        totalNum++;//总数自增，用于计算比例
                    }
                }
            }
            //continentObj装填到continentArray中，进行highchart饼状图解析，并获取数值最大的对象
            let record = {'maxVal': 0, 'maxIndex': 0};
            for (let j in continentObj) {
                continentArray.push({
                    'name': j,
                    'y': continentObj[j],
                });
                if (record['maxVal'] < continentObj[j]) {
                    record['maxVal'] = continentObj[j];
                    record['maxIndex'] = continentArray.length - 1;
                }
            }

            //设置第一个obj选择状态为true
            continentArray[record['maxIndex']]['sliced'] = true;
            continentArray[record['maxIndex']]['selected'] = true;

            console.log(continentArray)

            Highcharts.setOptions({
                colors: ['#FF9655', '#50B432', '#24CBE5', '#ED561B', '#24CBE5', '#64E572', '#FFF263', '#6AF9C4']
            });
            Highcharts.chart(element[0], {
                chart: {
                    width: 800,
                    height: 500,
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie',
                },
                title: {
                    text: '2018年广外校级接待外事来访嘉宾单位所在大洲占比'
                },
                tooltip: {
                    headerFormat: '<span style="font-size:15px;color: #248dc2;font-weight: bold">{point.key}</span>',
                    pointFormat:'<span style="font-size: 15px; color: black"> 占比 </span>' +
                    '<span style="font-size: 15px;color: #248dc2;font-weight: bold">{point.percentage:.1f}%</span>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<span style="font-size: 15px; color: black">{point.name}: {point.percentage:.1f} %</span>',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: [{
                    name: '占比',
                    colorByPoint: true,
                    data: continentArray
                }]
            });

        }
    };
});


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
//             for (let i in AnalyseDataSer.knowData['school_level_reception']) {
//                 let tempType = AnalyseDataSer.knowData['school_level_reception'][i]['education'];
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

