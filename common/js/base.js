/**
 * Created by majingyuan on 2017/5/29.
 */
// 正式系统
 var basePath = 'http://weixin.shidanli.cn:8081';
 var basePath1 = 'http://140.249.23.57:8083';
 // var basePath1 = 'http://localhost:8080';

//测试系统
// var basePath = 'http://localhost:8080';
// var actionName = "";
var actionName = "/qualityprize";
var projectName = '/zlj';
var path = basePath + actionName;
var mPath = basePath1 + actionName;
var imgUrl = basePath + projectName;
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