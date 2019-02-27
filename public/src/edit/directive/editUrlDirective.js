/**
 * Created by Administrator on 2019/2/14.
 */
var editModule = angular.module('Angular.edit');

/**
 * 添加新的广外知识图谱数据
 */
editModule.directive('editAdd', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/edit/tmpl/add.html'
    };
}]);


/**
 * 修改广外知识图谱数据
 */
editModule.directive('editModify', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/edit/tmpl/modify.html'
    };
}]);
