/**
 * Created by Administrator on 2019/2/14.
 * 用于测试utilService的方法
 */
var utilServiceModule = angular.module('Angular.utilService');

utilServiceModule.controller("UtilServiceCtrl", function (OverallDataSer, OverallGeneralSer, D3Test) {
    let util = this;
    util.testObj = {
        d3: true,
    };

    //测试d3的操作
    util.testObj.d3 ? D3Test.targetTest() : false;

});

