/**
 * Created by Administrator on 2019/2/14.
 */
var editModule = angular.module('Angular.edit');

editModule.controller('EditCtrl', function ($location,$routeParams, EditDataSer, OverallGeneralSer, OverallDataSer) {

    var edit = this;
    edit.visitData = EditDataSer.visitData;
    edit.supportData = EditDataSer.supportData;

    //添加新闻事件数据
    edit.addMeetingPerson = function (type) {
        EditDataSer.visitData[type].push(angular.copy(EditDataSer.supportData['addPerson'][type]))
    };

    edit.removeMeetingPerson = function (type, index) {
        EditDataSer.visitData[type].splice(index, 1)
    };

    edit.resetEditData = function () {
        for (let i in EditDataSer.visitData) {
            if (EditDataSer.visitData[i] instanceof Array) {
                EditDataSer.visitData[i].length = 0;
                EditDataSer.visitData[i].push(angular.copy(EditDataSer.supportData['addPerson'][i]))

            } else {
                EditDataSer.visitData[i] = '';
            }
        }
    };

    edit.addNewVisitData = function () {
        OverallGeneralSer.httpPostData3(EditDataSer.visitData, OverallDataSer.urlData['frontEndHttp']['addVisitNewsData'],
            function (result) {
                console.log('result', result)
            })
    };



    //修改实体数据
    if($routeParams['option']=='modify'){
        //1、显示modify页面，隐藏add页面


        //2、获取所有人物、单位数据


        //3、统计人物、单位分别尚未完成数据设置的有多少，并分别对每个人物或单位对象添加状态标识变量


    }




});






