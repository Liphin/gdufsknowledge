/**
 * Created by Administrator on 2016/10/12.
 */
head.load(
    'assets/js/jquery/jquery-1.11.0.js',
    //'http://cdn.static.runoob.com/libs/jquery/1.11.0/jquery.min.js',

    //'vendor/angular/angular.js',
    'https://cdn.bootcss.com/angular.js/1.5.8/angular.js',

    //'vendor/angular/messages/angular-messages.min.js',
    'https://cdn.bootcss.com/angular.js/1.5.8/angular-messages.min.js',

    //'vendor/angular/route/angular-route.min.js',
    'https://cdn.bootcss.com/angular.js/1.5.8/angular-route.min.js',

    //'vendor/angular/animate/angular-animate.min.js',
    'https://cdn.bootcss.com/angular.js/1.5.8/angular-animate.min.js',

    //'vendor/angular/cookie/angular-cookies.min.js',
    'https://cdn.bootcss.com/angular.js/1.5.8/angular-cookies.min.js',

    //'vendor/bootstrap/js/bootstrap.js',
    'https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js',

    //'vendor/others/md5.min.js',//md5加密
    'https://cdn.bootcss.com/blueimp-md5/2.5.0/js/md5.min.js',//md5加密

    //js.cookie.min.js
    'assets/js/others/js.cookie.min.js',

    //日期选择器
    'assets/js/others/laydate_export.js',

    //下载组件模块
    'assets/js/jquery/Blob.js',
    'assets/js/jquery/FileSaver.js',
    'assets/js/jquery/jqueryBinaryTransport.js',

    //angularjs下载组价
    'assets/js/download/angular-file-saver.bundle.js',
    'assets/js/download/angular-file-saver.service.js',
    'assets/js/download/blob.service.js',
    'assets/js/download/file-saver.service.js',
    'assets/js/download/utils.service.js',


    /*login 登录模块*/
    // 'src/login/module/loginModule.js',
    // 'src/login/controller/loginController.js',
    // 'src/login/service/loginDataService.js',
    // 'src/login/service/loginGeneralService.js',
    // 'src/login/service/loginService.js',
    // 'src/login/directive/loginDirective.js',
    // 'src/login/directive/loginUrlDirective.js',


    //edit模块
    'src/edit/module/editModule.js',
    'src/edit/directive/editDirective.js',
    'src/edit/directive/editUrlDirective.js',
    'src/edit/service/editDataService.js',
    'src/edit/service/editService.js',
    'src/edit/service/sub/editAddService.js',
    'src/edit/controller/editController.js',


    /*overall part Angular框架全局设置*/
    'src/overall/module/overallModule.js',
    'src/overall/controller/overallController.js',
    'src/overall/service/overallDataService.js',
    'src/overall/service/overallSettingService.js',
    'src/overall/service/overallConfigService.js',
    'src/overall/service/overallGeneralService.js',
    'src/overall/service/overallService.js',
    'src/overall/directive/overallDirective.js',
    'src/overall/directive/overallUrlDirective.js',
);
