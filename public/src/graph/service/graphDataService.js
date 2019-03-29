/**
 * Created by Administrator on 2019/2/14.
 */
var graphModule = angular.module('Angular.graph');

graphModule.factory('GraphDataSer', function () {

    //基础数据，用于全局设置使用;
    let generalData = {
        activeGraph: {  //默认是新闻知识图谱模块
            type: 'news',
            year: 2018,
        },
        dataSource: { //知识图谱的数据源
            status: false, //是否选中状态
            targetYear: 2018, //选择数据源中的目标年份
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
