/**
 * Created by Administrator on 2019/3/12.
 */
var analyseModule = angular.module('Angular.analyse');

/**
 * 2018年广外各学院长期外教专家数据图表——柱形图
 */
analyseModule.directive('expertLongVisitBarGdufsDept', function (AnalyseDataSer) {
    return {
        restrict: 'E',
        scope: {
            minPeopleNum: '@'
        },
        template: '<div></div>',
        link: function (scope, element) {

            //监听最少人数设置，若展示的最少人数手动变动则触发此操作
            scope.$watch("minPeopleNum", function (newValue, oldValue) {
                //各学院2018年外教人数统计分析
                let deptObj = {}, deptArray = [];
                for (let i in AnalyseDataSer.knowData['expert_long_visit']) {
                    let tempArray = AnalyseDataSer.knowData['expert_long_visit'][i]['institute_new'].split("、");
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
                        text: '2018年广外各学院长期外教专家数据图表'
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
                            text: '专家人数（单位：人）'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    // tooltip: {
                    //     pointFormat: '专家人数: <b>{point.y} 人</b>'
                    // },
                    tooltip: {
                        headerFormat: '<span style="font-size: 15px; color: #248dc2;font-weight: bold">{point.key}</span>',
                        pointFormat: '<span style="font-size: 15px; color: black"> 专家人数 </span>' +
                        '<span style="font-size: 15px;color: #248dc2;font-weight: bold">{point.y}</span>' +
                        '<span style="font-size: 15px; color: black"> 人 </span>'
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
 * 外事专家短期来访 各国家/地区——人次数：柱状图
 */
analyseModule.directive('expertLongVisitBarVisitNation', function (AnalyseDataSer, AnalyseSer, OverallGeneralSer) {
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
                //对每个出访地方对每个国家/地区装载到nationObj中
                for (let i in AnalyseDataSer.knowData['expert_long_visit']) {
                    let key = AnalyseDataSer.knowData['expert_long_visit'][i]['nation'];
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
                let record = {'maxVal': 0, 'maxIndex': 0};
                for (let j in nationObj) {
                    //如果占比低于最小值则不进行设置，继续下一个数据
                    //console.log(j, nationObj[j], totalNum, parseFloat(nationObj[j]) / totalNum * 100, parseFloat(nationObj[j]) / totalNum * 100 < parseFloat(newValue))
                    if (parseFloat(nationObj[j]) / totalNum * 100 < parseFloat(newValue)) continue;
                    nationArray.push({
                        'name': j,
                        'y': nationObj[j],
                    });
                    if (record['maxVal'] < nationObj[j]) {
                        record['maxVal'] = nationObj[j];
                        record['maxIndex'] = nationArray.length - 1;
                    }
                }

                //设置第一个obj选择状态为true
                nationArray[record['maxIndex']]['sliced'] = true;
                nationArray[record['maxIndex']]['selected'] = true;

                Highcharts.setOptions({
                    colors: ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"]
                });
                Highcharts.chart(element[0], {
                    chart: {
                        width: 800,
                        height: 500,
                        type: 'column',
                    },
                    title: {
                        text: '2018年广外长期外教专家所属国家/地区——人数统计图表'
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
                            text: '专家人数（单位：人）'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:11px"></span>',
                        pointFormat:  '<span style="font-size: 15px; color: black"> 来自 </span>' +
                        '<span style="font-size: 15px; color: #248dc2;font-weight: bold">{point.name} </span>' +
                        '<span style="font-size: 15px;color: #248dc2;font-weight: bold">{point.y}</span>' +
                        '<span style="font-size: 15px; color: black"> 人 </span>'
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
 * 广外长期外教专家学历占比——饼状图
 */
analyseModule.directive('expertLongVisitPieEducation', function (AnalyseDataSer, AnalyseSer) {
    return {
        restrict: 'E',
        template: '<div></div>',
        link: function (scope, element) {
            //准备填充的object和array
            let educateObj = {}, educateArray = [];
            //对每个长期外教专家学历进行解析，数目增加到educateObj中
            for (let i in AnalyseDataSer.knowData['expert_long_visit']) {
                let tempType = AnalyseDataSer.knowData['expert_long_visit'][i]['education'];
                //如果educateObj尚未有该访问类型key则新建，否则数字递增
                if (educateObj.hasOwnProperty(tempType)) {
                    educateObj[tempType]++;
                } else {
                    educateObj[tempType] = 1;
                }
            }
            //educateObj装填到educateArray中，进行highchart折线图解析，并获取数值最大的对象
            let record = {'maxVal': 0, 'maxIndex': 0};
            for (let j in educateObj) {
                educateArray.push({
                    'name': j,
                    'y': educateObj[j],
                });
                if (record['maxVal'] < educateObj[j]) {
                    record['maxVal'] = educateObj[j];
                    record['maxIndex'] = educateArray.length - 1;
                }
            }
            //设置第一个obj选择状态为true
            educateArray[record['maxIndex']]['sliced'] = true;
            educateArray[record['maxIndex']]['selected'] = true;

            Highcharts.setOptions({
                colors: ['#50B432', '#FF9655', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FFF263', '#6AF9C4']
            });
            Highcharts.chart(element[0], {

                chart: {
                    width: 800,
                    height: 500,
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: '2018年广外长期外教专家学历占比数据图表'
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
                    data: educateArray
                }]
            });
        }
    };
});

