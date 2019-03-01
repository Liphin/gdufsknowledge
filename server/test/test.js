/**
 * Created by Administrator on 2019/3/1.
 */

let a = ['2018-12-12', '2018-6-2'];

sortDate = function (a, b) {
  return new Date(a)-new Date(b)
};
//console.log(a.sort(sortDate));


let str = "2018年6月5日至2018年7月18日";
let datePattern = new RegExp("\\d+年\\d+月\\d+日","g");
let dateTime = str.match(datePattern)[0];
console.log(dateTime.replace('年','-').replace('月','-').replace('日',''));

