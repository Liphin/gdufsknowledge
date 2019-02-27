/**
 * Created by Administrator on 2019/2/14.
 */

let gdufsLead = [
    {'name': '隋广军', 'title': '党委书记'},
    {'name': '石佑启', 'title': '校长、党委副书记'},
    {'name': '李云明', 'title': '党委副书记'},
    {'name': '刘建达', 'title': '副校长'},
    {'name': '何传添', 'title': '党委常委、副校长'},
    {'name': '刘海春', 'title': '党委常委、副校长'},
    {'name': '陈林汉', 'title': '副校长'},
    {'name': '阳爱民', 'title': '党委常委、副校长'},
    {'name': '焦方太', 'title': '党委常委、副校长'}
];


let str = '本网讯   12月7日，秘鲁圣玛利亚天主教大学及佛得角大学代表团一行来访，我校校长石佑启、副校长焦方太在北校区行政楼贵宾厅会见来宾。双方就孔子学院建设及拓展校际间合作事宜进行深入交流。';
//let datePattern = new RegExp("\\d+月\\d+日","g");
//console.log(str.match(datePattern));


////集合查找方式('word1'|'word2')
// let masterCollection = '(';
// for (let i in gdufsLead) {
//     masterCollection += gdufsLead[i]['name'];
//     if (i < gdufsLead.length - 1) masterCollection += '|';
// }
// masterCollection += ')';
// let masterPattern = new RegExp(masterCollection, "g");  //str.match(masterPattern)
// console.log(str.match(masterPattern));


////来访事项——来访交流类
// let visitEvent = new RegExp("双方就(.+)(，|。)","g");
// console.log(str.match(visitEvent));


////机构
// let visitDept = new RegExp("双方就(.+)(，|。)","g");
// console.log(str.match(visitDept));


////主要人员
// let visitLead = new RegExp("双方就(.+)(，|。)","g");
// console.log(str.match(visitLead));











