/**
 * Created by Administrator on 2019/2/14.
 */
var analyseModule = angular.module('Angular.analyse');


/**
 * 广外外事出访数据分析
 */
analyseModule.directive('visitGeneralListHtml', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/analyse/tmpl/sub/visitGeneralList.html'
    };
}]);


/**
 * 广外短期来访外事专家数据分析
 */
analyseModule.directive('expertShortVisitHtml', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/analyse/tmpl/sub/expertShortVisit.html'
    };
}]);

/**
 * 广外长期来访外事专家数据分析
 */
analyseModule.directive('expertLongVisitHtml', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/analyse/tmpl/sub/expertLongVisit.html'
    };
}]);


/**
 * 广外出国境学生数据分析
 */
analyseModule.directive('exchangeStudent', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/analyse/tmpl/sub/exchangeStudent.html'
    };
}]);

/**
 * 广外与各国签署合作协议
 */
analyseModule.directive('agreements', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/analyse/tmpl/sub/agreements.html'
    };
}]);

/**
 * 校级接待
 */
analyseModule.directive('schoolLevelReception', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/analyse/tmpl/sub/schoolLevelReception.html'
    };
}]);

/**
 * 涉外活动报批
 */
analyseModule.directive('deptActivityApply', ['$document', function ($document) {
    return {
        restrict: 'E',
        templateUrl: 'src/analyse/tmpl/sub/deptActivityApply.html'
    };
}]);




