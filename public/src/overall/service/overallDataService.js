/**
 * Created by Administrator on 2018/2/28.
 */
var overallModule = angular.module('Angular');

overallModule.factory('OverallDataSer', function ($rootScope) {

    var overallData = {
        'loginStatus': false,
        'loadingData': false, //
        'requestDataErrorMsg': '尊敬的客户，服务出错，请稍后重试',
        'fileSuffix': ['doc','docx','pdf','xls','xlsx','png','jpeg','jpg','gif','pfx','zip'], //文件后缀辅助数据
    };

    /* Url 系统各种文件获取的URL设置 */
    var baseUrlData = {
        'frontEndHttp': "http://127.0.0.1:3037/",
    };

    // http请求的具体路径
    var urlData = {
        'frontEndHttp': {
            'getSqlKeyWord': baseUrlData['frontEndHttp'] + 'helper/sqlKeyWord.txt',
            'managerLogin': baseUrlData['frontEndHttp'] + 'managerLogin',
            'uploadResource': baseUrlData['frontEndHttp'] + 'uploadResource',
            'submitNewArbiData': baseUrlData['frontEndHttp'] + 'submitNewArbiData',
            'getArbiList': baseUrlData['frontEndHttp'] + 'getArbiList',
            'saveArbiInfo': baseUrlData['frontEndHttp'] + 'saveArbiInfo',
            'viewArbiOpt': baseUrlData['frontEndHttp'] + 'viewArbiOpt',
            'progressArbiOpt': baseUrlData['frontEndHttp'] + 'progressArbiOpt',
            'withdrawArbiOpt': baseUrlData['frontEndHttp'] + 'withdrawArbiOpt',
            'getResource': baseUrlData['frontEndHttp'] + 'resource',
            'getArbiJson': baseUrlData['frontEndHttp'] + 'json',
            'deleteBatchArbi': baseUrlData['frontEndHttp'] + 'deleteBatchArbi',


            'addVisitNewsData': baseUrlData['frontEndHttp'] + 'addVisitNewsData',

        }
    };

    //用于sql注入filter
    var sqlVerify = [];


    //location.path的重定向
    var redirect = {
        'loginHome': '/login/home',
        'arbiList': '/arbitration/list',
        'arbiListTest': '/arbitration/listTest',
    };


    var zIndexHelper = {
        'loading': 500000,
        'manager': 100,
        'viewReport': 1000,
        'viewPicture': 1001
    };


    return {
        urlData: urlData,
        redirect: redirect,
        sqlVerify: sqlVerify,
        overallData: overallData,
        baseUrlData: baseUrlData,
        zIndexHelper: zIndexHelper,
    }
});
