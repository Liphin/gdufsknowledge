/**
 * Created by Administrator on 2019/2/14.
 */
var editModule = angular.module('Angular.edit');

editModule.controller('EditCtrl', function ($location, $routeParams, EditDataSer, OverallGeneralSer, OverallDataSer) {

    var edit = this;
    edit.visitData = EditDataSer.visitData;
    edit.supportData = EditDataSer.supportData;
    edit.modifyData = EditDataSer.modifyData;


    //添加新闻事件数据*************************************************************************************

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


    //修改实体数据*************************************************************************************

    if ($routeParams['option'] == 'modify') {
        //1、显示modify页面，隐藏add页面
        EditDataSer.modifyData['pageShow']['modify'] = true;
        EditDataSer.modifyData['pageShow']['add'] = false;

        //2、获取所有人物、单位数据
        OverallGeneralSer.httpPostData3([], OverallDataSer.urlData['frontEndHttp']['getAllFillData'], function (result) {
            //返回的数据页面初始化赋值
            EditDataSer.modifyData['gdufs_teacher']['data'] = result['gdufs_teacher'];
            EditDataSer.modifyData['visitor']['data'] = result['visitor'];
            EditDataSer.modifyData['visit_dept']['data'] = result['visit_dept'];

            //对返回数据进行标签设置，标识哪些尚未设置完全其属性的
            for (let i in EditDataSer.modifyData) {
                for (let j in EditDataSer.modifyData[i]['data']) {
                    //先赋值标识状态为已满
                    EditDataSer.modifyData[i]['data'][j]['isFull'] = true;
                    //检查每个字段是否均填充完毕，若有字段尚未填充则未满状态，设置为false
                    for (let k in EditDataSer.modifyData[i]['instanceProperties']) {
                        if (!OverallGeneralSer.checkDataNotEmpty(EditDataSer.modifyData[i]['data'][j][k])) {
                            EditDataSer.modifyData[i]['data'][j]['isFull'] = false;
                            break;
                        }
                    }
                }
            }
        });
    }


    /**
     * 更改选择条目
     * @param type
     */
    edit.switchChoiceItem = function (type) {

    };


    /**
     * 更新该节点数据
     * @param nodeName
     * @param unique_id
     * @param value
     */
    edit.submitNodeData = function (nodeName, unique_id, value) {
        let data = {
            nodeName: nodeName,
            unique_id: unique_id,
            value: value
        };
        OverallGeneralSer.httpPostData3(data, OverallDataSer.urlData['frontEndHttp']['updateNodeInfo'], function (result) {

        })

    }


});






