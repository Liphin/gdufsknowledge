/**
 * Created by Administrator on 2018/2/28.
 */
var loginModule = angular.module('Angular.login');

loginModule.controller('LoginCtrl', function ($location, LoginDataSer, LoginSer) {

    var login = this;
    login.loginInfo = LoginDataSer.loginInfo;

    /**
     * 管理员信息登录
     */
    login.managerLogin=function () {
        if(LoginSer.managerLoginVerifyCheck()){
            LoginSer.managerLoginOpt();
        }
    };
});