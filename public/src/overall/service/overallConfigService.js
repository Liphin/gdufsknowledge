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
        .when('/graph/:option', {
            templateUrl: 'src/graph/tmpl/graph.html',
            controller: 'GraphCtrl',
            controllerAs: 'graph',
        })
        .when('/analyse/:option', {
            templateUrl: 'src/analyse/tmpl/analyse.html',
            controller: 'AnalyseCtrl',
            controllerAs: 'analyse',
        })
        .otherwise({redirectTo: '/graph/nodeLink'});

    //部署拦截器，每次http请求，会经过拦截器方法后再往下传
    $httpProvider.interceptors.push('interceptHttp');
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        '**'
    ]);
});