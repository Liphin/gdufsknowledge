/**
 * Created by Administrator on 2019/2/14.
 */
var editModule = angular.module('Angular.edit');

editModule.controller('EditCtrl', function ($location, EditDataSer, OverallGeneralSer, OverallDataSer) {

    var edit = this;
    edit.visitData = EditDataSer.visitData;
    edit.supportData = EditDataSer.supportData;





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
    }
});






