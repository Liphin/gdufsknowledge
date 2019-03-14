/**
 * Created by Administrator on 2019/3/12.
 */
var analyseModule = angular.module('Angular.analyse');

/**
 * 2018涉外活动报批统计-20190312更新-交流科
 */
analyseModule.directive('deptActivityApplyBarAmount', function (AnalyseDataSer) {
    return {
        restrict: 'E',
        scope: {
            minAmountNum: '@'
        },
        template: '<div></div>',
        link: function (scope, element) {
            let deptAmountData = {
                "西语学院": 24,
                "东语学院": 11,
                "高翻学院": 8,
                "广东国际战略研究院": 6,
                "非洲研究院": 6,
                "商学院": 5,
                "日语学院、亚非筹学院": 4,
                "国际治理创新研究院": 3,
                "国际经济贸易研究中心": 3,
                "法学院": 3,
                "中文学院": 2,
                "艺术学院": 2,
                "留学生院": 2,
                "国际移民研究中心": 2,
                "粤港澳大湾区研究院": 1,
                "英文学院": 1,
                "学生就业指导中心": 1,
                "校友会": 1,
                "外语研究与语言服务协同创新中心": 1,
                "马克思主义学院": 1,
                "经贸学院": 1,
                "加拿大研究中心": 1,
            };
            //监听最少人数设置，若展示的最少人数手动变动则触发此操作
            scope.$watch("minAmountNum", function (newValue, oldValue) {

                let deptAmountArray = [];
                for (let i in deptAmountData) {
                    if (deptAmountData[i] >= parseInt(newValue)) {
                        deptAmountArray.push([i, deptAmountData[i]])
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
                        text: '2018广外各学院涉外活动报批统计图'
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
                            text: '场数（单位：场）'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:11px"></span>',
                        pointFormat: '<span style="font-size: 15px; color: #248dc2; font-weight: bold">{point.name}</span>' +
                        '<span style="font-size: 15px; color: black"> 报批 </span>' +
                        '<span style="font-size: 15px; color: #248dc2; font-weight: bold">{point.y}</span>' +
                        '<span style="font-size: 15px; color: black"> 场 </span>'
                    },
                    series: [{
                        name: 'Population',
                        colorByPoint: true,
                        data: deptAmountArray,
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

