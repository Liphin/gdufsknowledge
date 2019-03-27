/**
 * Created by Administrator on 2019/2/14.
 */
var graphModule = angular.module('Angular.graph');

graphModule.factory('GraphDataSer', function () {

    //基础数据，用于全局设置使用;
    let generalData = {
        activeGraph: 'news', //默认是新闻知识图谱模块
    };

    return {
        generalData: generalData,
    }
});
