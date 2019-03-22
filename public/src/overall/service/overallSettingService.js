/**
 * Created by Administrator on 2018/2/28.
 */
var overallModule = angular.module('Angular');

/**
 * 当有外来请求时候进行拦截，可以进行安全防范等操作或者进行页面跳转等。
 * use this to intercept all when there’s an outgoing server call and to turn it off when the call is completed.
 */
overallModule.factory('interceptHttp', function ($cookies, $location, $rootScope) {

    return {
        /*成功请求数据*/
        request: function (receive) {
            return receive;
        },

        /*成功返回数据*/
        response: function (response) {
            return response
        },

        /*请求或返回数据出现错误*/
        requestError: function (err) {
            return err;
        },
        responseError: function (err) {
            return err;
        }
    };
});

/**
 * always we set the changing animation between page changeing
 */
overallModule.run(function ($rootScope, $timeout) {

    /*定义在config中每个path对应controller和view*/
    $rootScope.$on('$routeChangeStart', function (e, curr, prev) {
        $rootScope['loading'] = true;
    });

    $rootScope.$on('$routeChangeSuccess', function (e, curr, prev) {
        $rootScope['loading'] = false;
    });

    /*所有URL跳转，不管是否在config中定义path*/
    $rootScope.$on('$locationChangeStart', function () {
        $rootScope['loading'] = true;
    });
    $rootScope.$on('$locationChangeSuccess', function () {
        $rootScope['loading'] = false;
    });

});