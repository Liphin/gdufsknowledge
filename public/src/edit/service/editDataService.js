/**
 * Created by Administrator on 2019/2/14.
 */
var editModule = angular.module('Angular.edit');

editModule.factory('EditDataSer', function () {

    //一则完整的新闻来访数据
    let visitData = {
        title: '', //会议标题
        time: '2018年', //会议时间
        type: '1', //1：来访交流、2：出访交流
        cover: '', //封面url
        origin_url: '', //广外新闻原网址
        key_word: '', //广外外事管理内容关键词，用于搜索时使用
        timestamp: '', //时间戳
        unique_id: '',//来访事件唯一标识

        gdufs_dept: [{'cn_name': '', 'attend': [{'cn_name': '', 'identity': '1', 'title': ''}]}], //广外接待部门
        visitor_dept: [{'cn_name': '', 'nation': '', 'attend': [{'cn_name': '', 'en_name': '', 'title': ''}]}] //来访人部门
    };

    let supportData = {
        pageShow: {
            modify: false,
            add: false
        },
        addDept: {
            gdufs_dept: {'cn_name': '', 'attend': [{'cn_name': '', 'identity': '1', 'title': ''}]}, //广外部门添加
            visitor_dept: {'cn_name': '', 'nation': '', 'attend': [{'cn_name': '', 'en_name': '', 'title': ''}]} //来访单位添加
        },
        addPerson: {
            gdufs_dept: {'cn_name': '', 'identity': '1', 'title': ''},  //identity: 1:教师； 2：学生
            visitor_dept: {'cn_name': '', 'en_name': '', 'title': ''}
        }
    };

    //编辑或修改人物或单位数据
    let modifyData = {
        gdufs_teacher: {
            status: false, //标识是否选中进行编辑状态
            data: [], //填充neo4j数据库中数据
            instanceProperties: ['unique_id', 'account', 'cn_name', 'en_name', 'title', 'post', 'profile', 'portrait', 'phone', 'email', 'open_id_mini'] //所有非空的字段
        },
        visitor: {
            status: true,
            data: [],
            instanceProperties: ['unique_id', 'en_name', 'cn_name', 'title', 'profile']
        },
        visitor_dept: {
            status: false,
            data: [],
            instanceProperties: ['unique_id', 'en_name', 'cn_name', 'introduction', 'nation']
        }
    };


    return {
        visitData: visitData,
        supportData: supportData,
        modifyData: modifyData,
    }
});
