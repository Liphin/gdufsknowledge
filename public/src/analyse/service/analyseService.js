/**
 * Created by Administrator on 2019/2/14.
 */
var analyseModule = angular.module('Angular.analyse');

analyseModule.factory('AnalyseSer', function ($rootScope, OverallDataSer, $cookies, $location, $http, OverallGeneralSer, AnalyseDataSer) {

    /**
     * 初始化函数操作
     */
    function initData() {
        //获取所有广外外事分析数据
        getAllGdufsKnowledgeAnalyseData(()=>{
            //解析外事数据进行数据解析
            parseResponseData();
        });
    }

    /**
     * 获取所有广外数据进行分析
     */
    function getAllGdufsKnowledgeAnalyseData(callback) {
        OverallGeneralSer.httpPostData3('', OverallDataSer.urlData['frontEndHttp']['getAllGdufsKnowledgeMysqlData'], result => {
            //返回填充外事分析数据
            AnalyseDataSer.knowData = result;
            //函数回调
            callback()
        })
    }

    /**
     * 解析外事分析及回调函数
     */
    function parseResponseData() {
        //初始化后显示外事出访数据分析 “各学院——出访人” 数柱状图
        chooseAnalyseGraph('visit_general_list', 'gdufs_dept');

        //赋值公派出访数据填充
        AnalyseDataSer.analyseData['abroad_back_people']['factor']['back_plan']['data'].length = 0;
        for (let i = 0; i < AnalyseDataSer.knowData['abroad_back_people'].length; i++) {
            let info = {
                'name1': AnalyseDataSer.knowData['abroad_back_people'][i]['name'],
                'back_plan1': AnalyseDataSer.knowData['abroad_back_people'][i]['back_plan'],
            };
            if (++i < AnalyseDataSer.knowData['abroad_back_people'].length) {
                info['name2'] = AnalyseDataSer.knowData['abroad_back_people'][i]['name'];
                info['back_plan2'] = AnalyseDataSer.knowData['abroad_back_people'][i]['back_plan'];
            }
            AnalyseDataSer.analyseData['abroad_back_people']['factor']['back_plan']['data'].push(info);
        }
    }


    /**
     * ---学院因公出访数据图表---
     * 显示对应分析变量所对应的数据图
     * @param type
     * @param subType
     */
    function chooseAnalyseGraph(type, subType) {
        //如果subType为空则获取第一个子属性
        if (!OverallGeneralSer.checkDataNotEmpty(subType)) {
            subType = AnalyseDataSer.analyseData[type]['selected'];
        }

        //关闭其他数据分析源
        for (let i in AnalyseDataSer.analyseData) {
            AnalyseDataSer.analyseData[i]['status'] = false;
        }
        //单独开启该数据分析源的数据
        AnalyseDataSer.analyseData[type]['status'] = true;

        //关闭该数据源其他分析变量图展示
        for (let i in AnalyseDataSer.analyseData[type]['factor']) {
            AnalyseDataSer.analyseData[type]['factor'][i]['status'] = false;
        }
        //单独开启某分析变量对应的分析数据图
        AnalyseDataSer.analyseData[type]['factor'][subType]['status'] = true;
    }


    /**
     * 解析目标时间日期
     */
    function parseTargetDateTime(str, dateObj) {
        //如果数据为空则直接返回
        if (!OverallGeneralSer.checkDataNotEmpty(str)) return;

        let datePattern = new RegExp("\\d*.*\\d*.*\\d*.*\\d*.*\\d*.*\\d*.*", "g");
        let targetStr = str.match(datePattern)[0];
        let targetArray = targetStr.replace(/年/g, ',')
            .replace(/月/g, ',')
            .replace(/日/g, ',')
            .replace(/至/g, ',')
            .replace(/-/g, ',')
            .split(',');
        let finalNum = [];
        for (let i in targetArray) {
            if (targetArray[i] != '') {
                finalNum.push(targetArray[i])
            }
        }
        switch (finalNum.length) {
            case 4: {
                dateObj[parseInt(finalNum[1])]++;
                break;
            }
            case 5: {
                dateObj[parseInt(finalNum[1])]++;
                dateObj[parseInt(finalNum[3])]++;
                break;
            }
            case 6: {
                dateObj[parseInt(finalNum[1])]++;
                dateObj[parseInt(finalNum[4])]++;
                break;
            }
            default: {
                console.log('error parse', finalNum);
                break;
            }
        }
    }


    /**
     * 解析目标时间日期点，并装载日期点所在月份
     */
    function parseTargetTimeToMonth(str, dateObj) {
        //如果数据为空则直接返回
        if (!OverallGeneralSer.checkDataNotEmpty(str)) return;

        let datePattern = new RegExp("\\d*.*\\d*.*\\d*.*\\d*.*\\d*.*\\d*.*", "g");
        let targetStr = str.match(datePattern)[0];
        let targetArray = targetStr.replace(/年/g, ',')
            .replace(/月/g, ',')
            .replace(/日/g, ',')
            .replace(/至/g, ',')
            .replace(/-/g, ',')
            .replace(/\//g, ",")
            .replace(/\./g, ",")
            .split(',');
        let finalNum = [];
        for (let i in targetArray) {
            if (targetArray[i] != '') {
                finalNum.push(targetArray[i])
            }
        }
        //直接添加目标月份即可，parseInt可以去掉某些数字字符串前的0。如08-->8
        dateObj[parseInt(finalNum[1])]++;
    }


    /**
     * 解析出国境学生日期数据
     * @param str
     * @param dateObj
     */
    function parseExchangeStudentDate(str, dateObj) {
        //如果数据为空则直接返回
        if (!OverallGeneralSer.checkDataNotEmpty(str)) return;

        //准备装载时间的区间
        let periodArray = [];
        //某些用~分隔
        if (str.indexOf('~') > -1) {
            periodArray = str.split('~');
        }
        //某些用-分隔
        else if (str.indexOf('-') > -1) {
            periodArray = str.split('-');
        }

        //如果区间两边均不为空则进行解析，否则不解析
        if (periodArray.length == 2 &&
            OverallGeneralSer.checkDataNotEmpty(periodArray[0]) &&
            OverallGeneralSer.checkDataNotEmpty(periodArray[1])) {

            //获取交换时间跨度（月份）
            let timePeriodMonths = (new Date(periodArray[1]) - new Date(periodArray[0])) / 2592000000;
            //一个月内
            if (timePeriodMonths <= 1) {
                dateObj[1]['num']++;
            }
            //三个月内
            else if (timePeriodMonths <= 3) {
                dateObj[3]['num']++;
            }
            //半年内
            else if (timePeriodMonths <= 6) {
                dateObj[6]['num']++;
            }
            //一年内
            else if (timePeriodMonths <= 12) {
                dateObj[12]['num']++;
            }
            //两年内
            else if (timePeriodMonths <= 24) {
                dateObj[24]['num']++;
            }
            //三年及以上
            else {
                dateObj[36]['num']++;
            }
        }
    }


    /**
     * 时间段比较设置
     * @param str1
     * @param str2
     * @param dateObj
     */
    function parseTimePeriod(str1, str2, dateObj) {
        let timePeriodMonths = (new Date(str2) - new Date(str1)) / 2592000000;
        //console.log(str2, str1, timePeriodMonths)
        //一个月内
        if (timePeriodMonths <= 1) {
            dateObj[1]['num']++;
        }
        //三个月内
        else if (timePeriodMonths <= 3) {
            dateObj[3]['num']++;
        }
        //半年内
        else if (timePeriodMonths <= 6) {
            dateObj[6]['num']++;
        }
        //九个月
        else if (timePeriodMonths <= 9) {
            dateObj[9]['num']++;
        }
        //一年内
        else if (timePeriodMonths <= 12) {
            dateObj[12]['num']++;
        }
        //两年内
        else if (timePeriodMonths <= 24) {
            dateObj[24]['num']++;
        }
        //三年及以上
        else {
            dateObj[36]['num']++;
        }

    }


    return {
        initData: initData,
        parseTimePeriod: parseTimePeriod,
        parseTargetTimeToMonth: parseTargetTimeToMonth,
        chooseAnalyseGraph: chooseAnalyseGraph,
        parseTargetDateTime: parseTargetDateTime,
        parseExchangeStudentDate: parseExchangeStudentDate,
        getAllGdufsKnowledgeAnalyseData: getAllGdufsKnowledgeAnalyseData,
    }
});
