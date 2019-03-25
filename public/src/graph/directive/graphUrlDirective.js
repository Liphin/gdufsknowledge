/**
 * Created by Administrator on 2019/2/14.
 */
var graphModule = angular.module('Angular.graph');

/**
 * 广外部门详情数据
 */
graphModule.directive('gdufsDeptInfo', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/graph/tmpl/sub/info/gdufs_dept.html'
    };
}]);


/**
 * 来访、到访事件信息详情数据
 */
graphModule.directive('visitEventInfo', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/graph/tmpl/sub/info/visit_event.html'
    };
}]);

/**
 * 来访嘉宾所在单位信息详情数据
 */
graphModule.directive('visitorDeptInfo', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/graph/tmpl/sub/info/visitor_dept.html'
    };
}]);

/**
 * 与会者信息数据
 */
graphModule.directive('attendee', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/graph/tmpl/sub/info/attendee.html'
    };
}]);

/**
 * loading加载js动画
 */
graphModule.directive('graphLoader', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/graph/tmpl/sub/helper/loader.html'
    };
}]);





