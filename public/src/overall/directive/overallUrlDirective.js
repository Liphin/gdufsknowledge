/**
 * Created by Administrator on 2018/2/28.
 */
var overallModule = angular.module('Angular');

/**
 * 退出登录页面
 */
overallModule.directive('signOut', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/overall/tmpl/signOut.html'
    };
}]);








