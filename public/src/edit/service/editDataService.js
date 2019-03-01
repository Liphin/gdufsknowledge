/**
 * Created by Administrator on 2019/2/14.
 */
var editModule = angular.module('Angular.edit');

editModule.factory('EditDataSer', function () {

    //一则完整的新闻来访数据
    let visitData = {
        type: '1', //1：来访交流、2：出访交流
        title: '', //会议标题
        cover: '', //封面url
        time: '2017年', //会议时间
        timestamp: '', //时间戳
        place: '', //会议地址
        theme: '', //会议主题
        origin_url: '', //广外新闻原网址
        abstract: '', //广外外事管理内容摘要
        unique_id: '',//来访事件唯一标识

        //广外接待会见人员
        gdufs_teacher: [
            {'cn_name': '', 'role': '1', 'title':''}, //1：主接待人； 2：陪同接待
        ],

        //来访人
        visitor: [
            {'cn_name': '', 'en_name': '', 'role': '1', 'title': ''} //1：主出访人；2：陪同出访
        ],

        //来访人/出访的机构、部门、学校信息
        visitor_dept: {
            'cn_name': '', //中文名称
            'nation': '', //国籍
        },
    };

    let supportData = {
        pageShow: {
            modify: false,
            add: false
        },
        addPerson: {
            gdufs_teacher: {'name': '', 'role': '1', 'title':''},
            visitor: {'cn_name': '', 'en_name': '', 'role': '1', 'dept': ''}
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
