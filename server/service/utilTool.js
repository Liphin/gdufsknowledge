/**
 * Created by Administrator on 2019/2/16.
 * util工具类方法
 */
const pinyin = require('pinyinlite');

/**
 * 返回当前时间，格式为2018-01-01 12:00:00
 * @returns {string}
 */
let getCurrentDataTime = function () {
    var date = new Date();
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "  " + date.getHours() + ":" +
        date.getMinutes() + ":" + date.getSeconds();
};

/**
 * 时间排序，倒序排列，时间最晚排最前
 * @param a
 * @param b
 * @returns {number}
 */
let neo4jSortDate = function (a, b) {
    return new Date(b['timestamp']) - new Date(a['timestamp'])
};

/**
 * 中文字符排序
 * @param item1
 * @param item2
 * @returns {number}
 */
let chineseWordSort = function (item1, item2) {
    let c1 = pinyin(item1['cn_name']).join('');
    let c2 = pinyin(item2['cn_name']).join('');
    return c1.localeCompare(c2)
};



/**
 * 对数据进行判空处理
 * @param data
 */
var checkDataNotEmpty = function (data) {
    var status = false;
    if (data != null && data != undefined) {
        //根据变量的不同类型进行判空处理
        switch (Object.prototype.toString.call(data)) {
            /*String类型数据*/
            case '[object String]': {
                if (data.trim() != '') {
                    status = true;
                }
                break;
            }
            /*Array类型*/
            case '[object Array]': {
                if (data.length > 0) {
                    status = true;
                }
                break;
            }
            /*Object类型*/
            case '[object Object]': {
                if (Object.keys(data).length > 0) {
                    status = true;
                }
                break;
            }
            /*其他类型状态默认设置为true，分别为Number和Boolean类型*/
            default: {
                status = true;
                break;
            }
        }
    }
    return status;
};



module.exports = {
    checkDataNotEmpty: checkDataNotEmpty,
    neo4jSortDate: neo4jSortDate,
    chineseWordSort: chineseWordSort,
    getCurrentDataTime: getCurrentDataTime,
};