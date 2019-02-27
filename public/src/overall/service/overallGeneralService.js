/**
 * Created by Administrator on 2018/8/20.
 */
var overallModule = angular.module('Angular');

overallModule.factory('OverallGeneralSer', function ($http, OverallDataSer, $timeout, $rootScope, $cookies, $location) {

    /**
     * 设置cookie三小时的生存时间
     * @returns {Date}
     */
    var getNewCookiesExpireDate = function () {
        var expireDate = new Date();
        expireDate.setHours(expireDate.getHours() + 3, expireDate.getMinutes(), expireDate.getSeconds(), expireDate.getMilliseconds());
        return expireDate;
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


    /**
     * 对每个sql key word进行监测是否在content中出现，
     * 若出现则返回false验证，否则返回true通过
     * @param content
     */
    var sqlInjectFilter = function (content) {
        //循环每个sql key word进行监测
        for (var i in OverallDataSer.sqlVerify) {
            if (String(content).indexOf(OverallDataSer.sqlVerify[i]) >= 0) {
                return false;
            }
        }
        return true;
    };


    /**
     * 返回当前时间的timestamp
     * 若有前缀则添加前缀，否则直接返回时间戳数据
     */
    var getTimeStamp = function (prefix) {
        if (checkDataNotEmpty(prefix)) {
            return prefix + '' + (new Date()).valueOf();

        } else {
            return (new Date()).valueOf();
        }
    };


    /**
     * 返回当前时间，格式为2018-01-01 12:00:00
     * @returns {string}
     */
    var getCurrentDataTime = function () {
        var date = new Date();
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "  " + date.getHours() + ":" +
            date.getMinutes() + ":" + date.getSeconds();
    };


    /**
     * 设置需要添加完成动画时添加此句
     */
    var setSubmitAnimateSuccess = function (successWord) {
        $rootScope['saveAnimate'] = true;
        if (OverallGeneralSer.checkDataNotEmpty(successWord)) {
            $rootScope['successWord'] = successWord;
        } else {
            $rootScope['successWord'] = "Save Successfully";
        }
        /*设置timeout时间为2秒，2秒后该$rootScope['saveAnimate']变为false，下次可通过再次变为true继续出现动画*/
        $timeout(function () {
            $rootScope['saveAnimate'] = false;
        }, 1700);
    };


    /**
     * http get获取资源数据
     */
    var httpGetFiles = function (url, callback) {
        //设置loading状态
        OverallDataSer.overallData['loadingData'] = true;
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            if (response['status'] == 200) {
                //返回正确操作后执行回调函数
                callback(response['data'])

            } else {
                alert(OverallDataSer.overallData['requestDataErrorMsg'] + ",.");
            }
        }, function errorCallback(err) {
            alert(OverallDataSer.overallData['requestDataErrorMsg'] + ".," + err);

        }).finally(function () {
            //重置loading状态
            OverallDataSer.overallData['loadingData'] = false;
        });
    };


    /**
     * http get获取资源数据
     */
    var httpGetFiles2 = function (url, callback) {
        OverallDataSer.overallData['loadingData'] = true;
        $http({
            method: 'Get',
            url: url,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            responseType: 'blob'
        }).success(function (result) {
            var blob = new Blob([result], {type: 'application/octet-stream'});
            //读取Blob数据
            var reader = new FileReader();
            reader.readAsText(blob, 'utf-8');
            reader.onload = function (e) {
                var strInline = reader.result.replace(/\s/g, ''); //把数据转为一行
                var strNoComment = strInline.replace(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, ''); //取消注释操作
                var jsonDoc = JSON.parse(strNoComment); //json解析
                OverallDataSer.overallData['loadingData'] = false; //重置loading状态
                callback(jsonDoc);
            }

        }).error(function (result) {
            //console.log("download error：",result);
            alert("很抱歉，获取约束文档失败，请稍后重试！" + JSON.stringify(result))

        }).finally(function () {
            OverallDataSer.overallData['loadingData'] = false;
        });
    };


    /**
     * http post获取资源数据
     */
    var httpPostData = function (url, obj, callback, markLoadData) {
        //设置loading状态
        if (markLoadData != undefined) {
            OverallDataSer.overallData['loadingData'] = markLoadData;
        } else {
            OverallDataSer.overallData['loadingData'] = true;
        }

        //初始化表单数据
        var fd = new FormData();
        //动态装载数据
        for (var i in obj) {
            fd.append(i, obj[i]);
        }
        $http.post(url, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},

        }).success(function (response) {
            if (response['status_code'] == 200) {
                //返回正确操作后执行回调函数
                callback(response['data']);

            } else {
                alert(OverallDataSer.overallData['requestDataErrorMsg'] + ".");
            }
        }).error(function (err) {
            alert(OverallDataSer.overallData['requestDataErrorMsg'] + ",");

        }).finally(function () {
            //设置loading状态
            OverallDataSer.overallData['loadingData'] = false;
        });
    };


    /**
     * 发送post请求数据，发送非formData数据
     * @param data
     * @param url
     * @param callback
     * @param finallyCallback
     */
    var httpPostData2 = function (data, url, callback, finallyCallback) {
        $http({
            method: 'POST',
            url: url,
            data: ($.param(data)),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            //data: data,
            //headers: {'Content-Type': 'application/json'}
        }).success(function (response) {
            callback(response);

        }).error(function (err) {
            OverallGeneralSer.alertHttpRequestError("请求出错: ", 600, err);

        }).finally(function () {
            finallyCallback();
        });
    };


    /**
     * 发送post请求数据，发送非formData数据
     * @param data
     * @param url
     * @param callback
     */
    var httpPostData3 = function (data, url, callback) {
        $http({
            method: 'POST',
            url: url,
            data: ($.param(data)),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            //data: data,
            //headers: {'Content-Type': 'application/json'}
        }).success(function (response) {
            callback(response);

        }).error(function (err) {
            OverallGeneralSer.alertHttpRequestError("请求出错: ", 600, err);
        });
    };


    /**
     * 上传资源文件信息
     * 用于提交文件操作，并开放callback函数接口
     */
    var uploadResource = function (obj, callback) {
        var fd = new FormData();
        //动态装载数据
        for (var i in obj) {
            fd.append(i, obj[i]);
        }
        //提交表单数据
        var url = OverallDataSer.urlData['frontEndHttp']['uploadResource'];
        $http.post(url, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
        }).success(function (response) {
            callback(response);

        }).error(function (err) {
            OverallGeneralSer.alertHttpRequestError("uploadResource", 600, err);
        })
    };


    /**
     * 上传文件到易简网
     * @param obj
     * @param callback
     */
    var uploadFileToYJW = function (obj, callback) {
        var url = 'https://14.23.88.138:7777/api/1.0/file';
        var headers = {
            'Content-Type': undefined,
            "Accept": "application/json",
            'Authorization': 'Bearer 987b2847-3a78-3a49-970b-264fbaa3ec7c'
        };
        var fd = new FormData();
        //动态装载数据
        for (var i in obj) {
            fd.append(i, obj[i]);
        }
        $http.post(url, fd, {
            transformRequest: angular.identity,
            headers: headers,
            rejectUnauthorized: false

        }).success(function (response) {
            callback(response);

        }).error(function (err) {
            alert(OverallDataSer.overallData['requestDataErrorMsg'] + ",");

        });
    };


    /**
     * 组装生成新闻时间
     * @returns {string}
     * @param dateTime
     * @param optType
     */
    var generateSearchTime = function (dateTime, optType) {
        if (optType == 1) {
            var searchTime = dateTime + " 00:00:00";
        }
        else if (optType == 2) {
            var searchTime = dateTime + " 23:59:59";
        }

        return searchTime;
    };

    /**
     * http 请求错误返回的处理
     * @param errFunction
     * @param errCode
     * @param err
     */
    var alertHttpRequestError = function (errFunction, errCode, err) {
        //请求出错打印错误消息和弹出alert视窗提醒客户
        console.error(errFunction, errCode, err);
        alert("Sorry, service error please try again later.\n很抱歉，服务异常，请稍后重试");
    };


    /**
     * urlEncode每个param数据节点
     */
    var resetNewData = function (target) {
        //遍历target中每个数据
        for (var i in target) {
            //如果该数据为对象或数组则回调处理，否则encodeURI处理
            switch (Object.prototype.toString.call(target[i])) {
                /*String类型数据*/
                case '[object String]': {
                    target[i] = '';
                    break;
                }
                /*Number类型*/
                case '[object Number]': {
                    target[i] = 0;
                    break;
                }
                /*Boolean类型*/
                case '[object Boolean]': {
                    target[i] = true;
                    break;
                }
                /*Array类型*/
                case '[object Array]': {
                    resetNewData(target[i])
                    break;
                }
                /*Object类型*/
                case '[object Object]': {
                    resetNewData(target[i])
                    break;
                }
            }
        }
    };


    return {
        httpGetFiles2: httpGetFiles2,
        httpGetFiles: httpGetFiles,
        httpPostData: httpPostData,
        getTimeStamp: getTimeStamp,
        getCurrentDataTime: getCurrentDataTime,
        httpPostData2: httpPostData2,
        httpPostData3: httpPostData3,
        uploadFileToYJW: uploadFileToYJW,
        uploadResource: uploadResource,
        sqlInjectFilter: sqlInjectFilter,
        checkDataNotEmpty: checkDataNotEmpty,
        getNewCookiesExpireDate: getNewCookiesExpireDate,
        setSubmitAnimateSuccess: setSubmitAnimateSuccess,
        generateSearchTime: generateSearchTime,
        alertHttpRequestError: alertHttpRequestError,
    }
});
