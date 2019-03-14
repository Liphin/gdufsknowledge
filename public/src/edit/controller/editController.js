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
    //添加部门
    edit.addMeetingDept = function (type) {
        EditDataSer.visitData[type].push(angular.copy(EditDataSer.supportData['addDept'][type]))
    };
    //删除部门
    edit.removeMeetingDept = function (type, index) {
        EditDataSer.visitData[type].splice(index, 1)
    };
    //添加与会人员
    edit.addMeetingPerson = function (type, parent) {
        console.log(type, parent)
        EditDataSer.visitData[type][parent]['attend'].push(angular.copy(EditDataSer.supportData['addPerson'][type]))
    };
    //删除与会人员
    edit.removeMeetingPerson = function (type, parent, index) {
        console.log(type, parent, index)
        EditDataSer.visitData[type][parent]['attend'].splice(index, 1)
    };

    //添加来访、到访事件
    edit.addNewVisitData = function () {
        //单独设置时间戳数据
        let datePattern = new RegExp("\\d+年\\d+月\\d+日", "g");
        let dateTime = EditDataSer.visitData['time'].match(datePattern);
        if (dateTime.length <= 0) {
            alert("填写时间按照****年**月**日； 或 ****年**月**日至****年**月**日");
            return
        }
        EditDataSer.visitData['timestamp'] = dateTime[0].replace('年', '-').replace('月', '-').replace('日', '');
        OverallGeneralSer.httpPostData3(EditDataSer.visitData, OverallDataSer.urlData['frontEndHttp']['addVisitNewsData'],
            function (result) {
                if (result.status != 200) {
                    alert("此次操作有误");
                    console.log('result', result)
                }
            })
    };


    //修改实体数据*************************************************************************************
    if ($routeParams['option'] == 'modify') {
        //1、显示modify页面，隐藏add页面
        EditDataSer.supportData['pageShow']['modify'] = true;
        EditDataSer.supportData['pageShow']['add'] = false;

        //2、获取所有人物、单位数据
        OverallGeneralSer.httpPostData3([], OverallDataSer.urlData['frontEndHttp']['getAllFillData'], function (result) {
            //返回的数据页面初始化赋值
            EditDataSer.modifyData['gdufs_teacher']['data'] = result['gdufs_teacher'];
            EditDataSer.modifyData['visitor']['data'] = result['visitor'];
            EditDataSer.modifyData['visitor_dept']['data'] = result['visitor_dept'];

            //对返回数据进行标签设置，标识哪些尚未设置完全其属性的
            for (let i in EditDataSer.modifyData) {
                for (let j in EditDataSer.modifyData[i]['data']) {
                    //先赋值标识状态为已满
                    EditDataSer.modifyData[i]['data'][j]['isFull'] = true;
                    EditDataSer.modifyData[i]['data'][j]['extend'] = false;
                    //检查每个字段是否均填充完毕，若有字段尚未填充则未满状态，设置为false
                    for (let k in EditDataSer.modifyData[i]['instanceProperties']) {
                        let value = EditDataSer.modifyData[i]['instanceProperties'][k];
                        if (!OverallGeneralSer.checkDataNotEmpty(EditDataSer.modifyData[i]['data'][j][value])) {
                            EditDataSer.modifyData[i]['data'][j]['isFull'] = false;
                            EditDataSer.modifyData[i]['data'][j][value] = '';
                        }
                    }
                }
            }
            console.log('实体数据', EditDataSer.modifyData);
        });
    }
    //添加新闻数据
    else if ($routeParams['option'] == 'add') {
        EditDataSer.supportData['pageShow']['modify'] = false;
        EditDataSer.supportData['pageShow']['add'] = true;
    }


    /**
     * 更改选择条目
     * @param type
     */
    edit.switchChoiceItem = function (type) {
        //全部设置隐藏状态
        for (let i in EditDataSer.modifyData) {
            EditDataSer.modifyData[i]['status'] = false;
        }
        //单独设置显示状态
        EditDataSer.modifyData[type]['status'] = true;
        console.log(EditDataSer.modifyData['visitor_dept']['status'])
    };


    /**
     * 更新该节点数据
     * @param type
     * @param index
     * @param value
     */
    edit.submitNodeData = function (type, index, value) {
        let data = {
            type: type,
            value: value
        };
        OverallGeneralSer.httpPostData3(data, OverallDataSer.urlData['frontEndHttp']['updateNodeInfo'], function (result) {
            if (result == 'OK') {
                EditDataSer.modifyData[type]['data'][index]['isFull'] = true;
                EditDataSer.modifyData[type]['data'][index]['extend'] = false;
            }
        })
    }


});






