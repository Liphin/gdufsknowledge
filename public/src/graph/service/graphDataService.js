/**
 * Created by Administrator on 2019/2/14.
 */
var graphModule = angular.module('Angular.graph');

graphModule.factory('GraphDataSer', function () {

    //基础数据，用于全局设置使用;
    let generalData = {
        //所有知识图谱设置
        allGraph: {
            news: {
                status: true //默认显示新闻知识图谱数据
            },
        }
    };

    return {
        generalData: generalData,
    }
});
