/**
 * Created by Administrator on 2018/2/28.
 */

var overallModule = angular.module('Angular');

overallModule.config(function ($routeProvider, $httpProvider, $sceDelegateProvider) {

    $routeProvider
        // .when('/login/home', {
        //     templateUrl: 'src/login/tmpl/login.html',
        //     controller: 'LoginCtrl',
        //     controllerAs: 'login'
        // })
        .when('/edit/:option', {
            templateUrl: 'src/edit/tmpl/edit.html',
            controller: 'EditCtrl',
            controllerAs: 'edit',
        })
        .otherwise({redirectTo: '/edit/modify'});

    //部署拦截器，每次http请求，会经过拦截器方法后再往下传
    $httpProvider.interceptors.push('interceptHttp');
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        '**'
    ]);
});