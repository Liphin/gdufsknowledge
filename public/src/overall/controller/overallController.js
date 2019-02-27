/**
 * Created by Administrator on 2018/2/28.
 */
var overallModule = angular.module('Angular');

overallModule.controller('OverallCtrl', function ($http, $cookies, $rootScope, $location, $timeout, OverallDataSer,
                                                  OverallSer, OverallGeneralSer, $window) {
    /******************************个人信息标签显示和隐藏设置**************************************/

    /*初始化必要变量*/
    $rootScope.loading = false;
    $rootScope.saveAnimate = false;
    $rootScope.overallData = OverallDataSer.overallData;
    $rootScope.zIndexHelper = OverallDataSer.zIndexHelper;
    //OverallSer.getSqlInjectFilterWords(); //获取所有sql注入key words匹配对


    /**
     * 停止事件传递和禁用一些默认事件处理情况
     * @param $event
     */
    $rootScope.preventEventTransport = function ($event) {
        OverallSer.preventEventTransport($event);
    };

    /**
     * 退出登录操作
     */
    $rootScope.signOut = function () {
        //清空用户数据
        OverallDataSer.overallData['loginStatus']=false;
        $cookies.remove('loginStatus');

        //跳转到登录页面
        $location.search({});
        $location.path(OverallDataSer.redirect['loginHome']);

        //刷新当前页面，所有数据重置
        $window.location.reload();
    };
});