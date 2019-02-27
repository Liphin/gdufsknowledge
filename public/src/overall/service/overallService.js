/**
 * Created by Administrator on 2018/2/28.
 */
var overallModule = angular.module('Angular');

overallModule.factory('OverallSer', function ($rootScope, OverallDataSer, $cookies,  $location, $http, OverallGeneralSer) {

    /**
     * 返回当前时间，格式为2018-01-01 12:00:00
     * @returns {string}
     */
    var getUploadFileTime = function () {
        var date = new Date();
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "  " + date.getHours() + ":" +
            date.getMinutes() + ":" + date.getSeconds();
    };


    /**
     * 鼠标事件停止传递
     * @param $event
     */
    var preventEventTransport = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
    };


    /**
     * modal的黑色遮罩层背景去掉
     */
    var modalBackRemove = function () {
        $(".modal-backdrop").remove();
    };


    /**
     * 获取sql注入的每个key word
     */
    var getSqlInjectFilterWords = function () {
        /*获取所有嫌疑sql注入key word*/
        var allSqlKeyWords = OverallDataSer.urlData['frontEndHttp']['getSqlKeyWord'];

        //1. 如果尚未获取全部sql key word数据则http请求获取
        if (Object.keys(OverallDataSer.sqlVerify.length <= 0)) {
            $http({
                method: 'GET',
                url: allSqlKeyWords
            }).then(function successCallback(response) {
                if (response['status'] == 200) {
                    OverallDataSer.sqlVerify = response['data'].split(",");
                }
            }, function errorCallback(err) {
                OverallSer.alertHttpRequestError("OverallSer.sqlInjectFilter", 500, err);
            });
        }
    };


    return {
        modalBackRemove: modalBackRemove,
        getUploadFileTime: getUploadFileTime,
        preventEventTransport: preventEventTransport,
        //分别获取sql注入的key word方法和监测是否有该注入
        getSqlInjectFilterWords: getSqlInjectFilterWords,
    }
});
