/**
 * Created by Administrator on 2019/2/14.
 */
var graphModule = angular.module('Angular.graph');

//***************************广外新闻数据*****************************************
/**
 * 广外部门详情数据
 */
graphModule.directive('gdufsDeptInfo', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/graph/tmpl/type/news/gdufs_dept.html'
    };
}]);
/**
 * 来访、到访事件信息详情数据
 */
graphModule.directive('visitEventInfo', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/graph/tmpl/type/news/visit_event.html'
    };
}]);
/**
 * 来访嘉宾所在单位信息详情数据
 */
graphModule.directive('visitorDeptInfo', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/graph/tmpl/type/news/visitor_dept.html'
    };
}]);
/**
 * 与会者信息数据
 */
graphModule.directive('attendee', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/graph/tmpl/type/news/attendee.html'
    };
}]);



//***************************Loading加载项*******************************************
/**
 * loading加载js动画
 */
graphModule.directive('graphLoader', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/graph/tmpl/helper/loader.html'
    };
}]);





