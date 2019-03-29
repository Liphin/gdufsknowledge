/**
 * Created by Administrator on 2019/2/14.
 */
var graphModule = angular.module('Angular.graph');

graphModule.factory('GraphDataSer', function () {

    //基础数据，用于全局设置使用;
    let generalData = {
        activeGraph: 'news', //默认是新闻知识图谱模块
        dataSource: { //知识图谱的数据源
            yearRange: [2018, 2019],
            yearSelected: 2018,
            data: [
                {year: 2018, type: 'news', name: '2018年广外外事交流数据知识图谱'},
                {year: 2018, type: 'exchange', name: '2018年广外出国境学生数据知识图谱'}
            ]
        }
    };

    return {
        generalData: generalData,
    }
});
