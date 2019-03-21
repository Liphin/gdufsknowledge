/**
 * Created by Administrator on 2019/2/14.
 */
var graphModule = angular.module('Angular.graph');


graphModule.directive('knowledgeRender', ['GraphDataSer', function (GraphDataSer) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {
            element.bind('contextmenu', function (event) {
                scope.$apply(function () {
                    //当鼠标移动至节点上时才能展开相应的菜单，否则不能展开
                    if(GraphDataSer.overallData['nodeHover']['status']){
                        event.preventDefault();
                        GraphDataSer.overallData['nodeMenu']['status'] = true;
                        GraphDataSer.overallData['nodeMenu']['position']['x'] = event.clientX + 5;
                        GraphDataSer.overallData['nodeMenu']['position']['y'] = event.clientY + 5;
                    }
                })
            });
            element.bind("click", function (event) {
                scope.$apply(function () {
                    GraphDataSer.overallData['nodeMenu']['status'] = false;
                })
            })
        }
    };
}]);