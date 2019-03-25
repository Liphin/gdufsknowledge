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


/**
 * 监听输入框中的enter按键事件，触发此事件进行搜索对应的节点信息
 */
graphModule.directive('enterSearchNode', function (NeoSer) {
    return{
        restrict:'A',
        link:function (scope, element) {
            element.bind('keydown', function (event) {
                var keyObj = event.key.toLowerCase();
                //enter键盘事件操作
                if(keyObj=='enter'){
                    //进入搜索函数
                    scope.$apply(function () {
                        NeoSer.searchTargetNodes();
                    })
                }
            })
        }
    }
});






