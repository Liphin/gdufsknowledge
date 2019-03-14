/**
 * Created by Administrator on 2019/3/12.
 */
var analyseModule = angular.module('Angular.analyse');

/**
 * 2018年广外公派回国人员所属 学院——人数：柱形图
 */
analyseModule.directive('abroadBackPeopleBarGdufsDept', function (AnalyseDataSer) {
    return {
        restrict: 'E',
        scope: {
            minPeopleNum: '@'
        },
        template: '<div></div>',
        link: function (scope, element) {
            //监听最少人数设置，若展示的最少人数手动变动则触发此操作
            scope.$watch("minPeopleNum", function (newValue, oldValue) {
                let gdufsDeptObj = {}, gdufsDeptArray = [];
                for (let i in AnalyseDataSer.knowData['abroad_back_people']) {
                    let key = AnalyseDataSer.knowData['abroad_back_people'][i]['gdufs_dept'];
                    //如果gdufsDeptObj尚未有该学院的key则新建，否则数字递增
                    if (gdufsDeptObj.hasOwnProperty(key)) {
                        gdufsDeptObj[key]++;
                    } else {
                        gdufsDeptObj[key] = 1;
                    }
                }
                for (let j in gdufsDeptObj) {
                    if (gdufsDeptObj[j] >= newValue) {
                        gdufsDeptArray.push([j, gdufsDeptObj[j]]);
                    }
                }
                //console.log(gdufsDeptArray)

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
                        text: '2018年广外公派回国人员 各学院——人次数 统计图'
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
                            text: '人次数（单位：人次）'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:11px"></span>',
                        pointFormat: '<span style="font-size: 15px; color: #248dc2; font-weight: bold">{point.name}</span>' +
                        '<span style="font-size: 15px; color: black"> 公派回国 </span>' +
                        '<span style="font-size: 15px; color: #248dc2; font-weight: bold">{point.y}</span>' +
                        '<span style="font-size: 15px; color: black"> 人次 </span>'
                    },
                    series: [{
                        name: 'Population',
                        //colorByPoint: true,
                        data: gdufsDeptArray,
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
 * 2018年广外公派回国人员出访 大学——人次数：柱形图
 */
analyseModule.directive('abroadBackPeopleBarDestination', function (AnalyseDataSer, AnalyseSer, OverallGeneralSer) {
    return {
        restrict: 'E',
        scope: {
            minPeopleNum: '@'
        },
        template: '<div></div>',
        link: function (scope, element) {
            //监听最少人数设置，若展示的最少人数手动变动则触发此操作
            scope.$watch("minPeopleNum", function (newValue, oldValue) {
                let destinationObj = {}, destinationArray = [];
                for (let i in AnalyseDataSer.knowData['abroad_back_people']) {
                    let key = AnalyseDataSer.knowData['abroad_back_people'][i]['destination'];
                    //如果destinationObj尚未有该学院的key则新建，否则数字递增
                    if (destinationObj.hasOwnProperty(key)) {
                        destinationObj[key]++;
                    } else {
                        destinationObj[key] = 1;
                    }
                }
                for (let j in destinationObj) {
                    if (destinationObj[j] >= newValue) {
                        destinationArray.push([j, destinationObj[j]]);
                    }
                }
                //console.log(destinationArray)

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
                        text: '2018年广外公派回国人员 公派所在国家/大学——人次数 统计图'
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
                            text: '人次数（单位：人次）'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:11px"></span>',
                        pointFormat: '<span style="font-size: 15px; color: black"> 公派至 </span>' +
                        '<span style="font-size: 15px; color: #248dc2; font-weight: bold">{point.name}</span>' +
                        '<span style="font-size: 15px; color: #248dc2; font-weight: bold">{point.y}</span>' +
                        '<span style="font-size: 15px; color: black"> 人次 </span>'
                    },
                    series: [{
                        name: 'Population',
                        colorByPoint: true,
                        data: destinationArray,
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
 * 2018年广外公派回国人员出访 时间段——人次数：柱形图
 */
analyseModule.directive('abroadBackPeopleBarTimePeriod', function (AnalyseDataSer, AnalyseSer, OverallGeneralSer) {
    return {
        restrict: 'E',
        template: '<div></div>',
        link: function (scope, element) {

            //目标时间周期, key代表多少个月 TODO：后续可手动添加显示的字段数
            let dateObj = {
                1: {num: 0, name: '一个月'},
                3: {num: 0, name: '三个月'},
                6: {num: 0, name: '半年'},
                9: {num: 0, name: '九个月'},
                12: {num: 0, name: '一年'},
                24: {num: 0, name: '两年'},
                36: {num: 0, name: '三年及以上'}
            };
            let dateArray = [];
            //每个出访时间周期进行解析，人数回填到dateObj
            for (let i in AnalyseDataSer.knowData['abroad_back_people']) {
                AnalyseSer.parseTimePeriod(AnalyseDataSer.knowData['abroad_back_people'][i]['begin_time'],
                    AnalyseDataSer.knowData['abroad_back_people'][i]['end_time'], dateObj);
            }
            //dateObj装填到dateArray中，进行highchart折线图解析
            for (let i in dateObj) {
                dateArray.push({'name': dateObj[i]['name'], 'y': dateObj[i]['num']});
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
                    text: '2018年广外公派回国人员 公派时长——人次数 统计图'
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
                        text: '人次数（单位：人次）'
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    headerFormat: '<span style="font-size:11px"></span>',
                    pointFormat: '<span style="font-size: 15px; color: black"> 公派 </span>' +
                    '<span style="font-size: 15px; color: #248dc2; font-weight: bold">{point.name} </span>' +
                    '<span style="font-size: 15px; color: #248dc2; font-weight: bold">{point.y}</span>' +
                    '<span style="font-size: 15px; color: black"> 人次 </span>'
                },
                series: [{
                    name: 'Population',
                    colorByPoint: true,
                    data: dateArray,
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
        }
    };
});


/**
 * 2018年广外公派回国人员公派类型占比统计：饼状图
 */
analyseModule.directive('abroadBackPeopleBarType', function (AnalyseDataSer, AnalyseSer, OverallGeneralSer) {
    return {
        restrict: 'E',
        template: '<div></div>',
        link: function (scope, element) {

            //准备填充的object和array
            let typeObj = {}, typeArray = []
            //对每个公派类型装载到typeObj中
            for (let i in AnalyseDataSer.knowData['abroad_back_people']) {
                let key = AnalyseDataSer.knowData['abroad_back_people'][i]['type'];
                //如果typeObj尚未有该国家/地区key则新建，否则数字递增
                if (OverallGeneralSer.checkDataNotEmpty(key)) {
                    if (typeObj.hasOwnProperty(key)) {
                        typeObj[key]++;
                    } else {
                        typeObj[key] = 1;
                    }
                }
            }
            //typeObj装填到typeArray中，进行highchart饼状图解析，并获取数值最大的对象
            for (let j in typeObj) {
                typeArray.push({
                    'name': j,
                    'y': typeObj[j],
                });
            }
            Highcharts.setOptions({
                colors: ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"]
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
                    text: '2018年广外公派回国人员公派类型占比统计'
                },
                tooltip:  {
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
                            format: '<span style="font-size: 15px; color: black">{point.name}: {point.percentage:.1f} %</span>',                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: [{
                    name: '占比',
                    colorByPoint: true,
                    data: typeArray
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
//             for (let i in AnalyseDataSer.knowData['agreements']) {
//                 let tempType = AnalyseDataSer.knowData['agreements'][i]['education'];
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

