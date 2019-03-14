/**
 * Created by Administrator on 2019/2/14.
 */
var analyseModule = angular.module('Angular.analyse');

analyseModule.controller('AnalyseCtrl', function ($location, $routeParams, AnalyseSer, AnalyseDataSer, OverallGeneralSer, OverallDataSer) {

    var analyse = this;
    analyse.analyseData = AnalyseDataSer.analyseData;

    /**
     * 选择对应分析数据源，并展示对应分析变量对应的的数据图
     * @see AnalyseSer.visitGeneralListShow
     */
    analyse.chooseAnalyseGraph = function (type, subType) {
        AnalyseSer.chooseAnalyseGraph(type, subType);
    };


    AnalyseSer.initData();

});






