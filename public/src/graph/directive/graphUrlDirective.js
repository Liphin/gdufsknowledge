/**
 * Created by Administrator on 2019/2/14.
 */
var graphModule = angular.module('Angular.graph');

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
/**
 * 选择数据源的方法
 */
graphModule.directive('allGraph', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/graph/tmpl/helper/allGraph.html'
    };
}]);


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
/**
 * news数据图谱集合
 */
graphModule.directive('newsGraph', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/graph/tmpl/type/news/news_graph.html'
    };
}]);



//*************************** 交换生数据知识图谱 *******************************************
graphModule.directive('exchangeGraph', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/graph/tmpl/type/exchange/exchange_graph.html'
    };
}]);
//广外学院
graphModule.directive('exchangeInstitute', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/graph/tmpl/type/exchange/exchange_institute.html'
    };
}]);
//学生出国交换的学校
graphModule.directive('exchangeForeignSchool', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/graph/tmpl/type/exchange/exchange_foreign_school.html'
    };
}]);
//交流的学生在广外专业
graphModule.directive('exchangeMajor', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/graph/tmpl/type/exchange/exchange_major.html'
    };
}]);
//交流的学生
graphModule.directive('exchangeStudentGraph', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/graph/tmpl/type/exchange/exchange_student.html'
    };
}]);
