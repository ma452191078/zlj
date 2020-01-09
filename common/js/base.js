/**
 * Created by majingyuan on 2017/5/29.
 */
// 正式系统
 var basePath1 = 'http://weixin.shidanli.cn:8081';
 var basePath = 'http://140.249.23.57:8083';

//测试系统
// var basePath = 'http://localhost:8088';
var actionName = "/qualityprize";
var projectName = '/zlj';
var path = basePath + actionName;
var mPath = basePath + actionName;
var imgUrl = basePath1 + projectName;
var qrUrl = imgUrl + '/mobile/index.html?gameId=';
var loginUrl = "http://" + window.location.host + projectName + "/login.html";
//获取url中的参数
function getUrlParam(name) {
    var param = '';
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r !== null){
        var param = unescape(r[2]);

        if (param === null || param === 'undefined'){
            param = '';
        }
    }
    return param; //返回参数值
}