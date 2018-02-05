var store = null;
var vm = null;

// 初始化加载vue
$(document).ready(function() {
    wechatConfigInit();
    initLocalStorage();

    vm = new Vue({
        el : '#body',
        data : {
            gameInfo : {},
            playerList : [],
            imgUrl : imgUrl,
            roleList : [],
            scoreList : [],
            groupList : []
        },
        methods : {
            updateData : function(data) {
                this.playerList = data.playerList;
                this.gameInfo = data.gameInfo;
                this.roleList = data.gameInfo.gameRoleInfoList;
            },
            updateGroup : function (data) {
                this.groupList = data.result;
            },
            updateScoreList : function (data) {
                this.scoreList = data;
            }
        }
    });
});

/**
 * 获取比赛分组列表
 */
function getGroupList() {
    var parameter = {
        gameId : getUrlParam('gameId')
    };

    var url = path + "/group/getGroupInfoList";
    $.ajax({
        data : parameter,
        url : url,
        type : 'POST',
        dataType : 'JSON',
        timeout : 10000,
        success : function(data) {
            vm.updateGroup(data);
        },
        error : function(data) {

        }
    });
}

/**
 * 获取参赛样品列表
 */
function getPlayerList() {
    var judgeId = store.get('judgeId');
    // if (judgeId === undefined){
    //     judgeId = '';
    // }
    var parameter = {
        gameId : getUrlParam('gameId'),
        judgeId : judgeId
    };

    var url = path + "/player/getPlayerListByGame";
    $.ajax({
        data : parameter,
        url : url,
        type : 'POST',
        dataType : 'JSON',
        timeout : 10000,
        success : function(data) {
            vm.updateData(data);
            if (vm.gameInfo.gameRole === "" || vm.gameInfo.gameRole === null){
                $("#role_head").hide();
            }
        },
        error : function(data) {

        }
    });
}

/**
 * 提交得分
 * @param gameId
 * @param playerId
 */
function onSumbitScore(gameId, playerId) {
    var parameter = {};
    parameter["scoreValue"] = 0.00;
    parameter["playerId"]= playerId;
    parameter["gameId"]= gameId;
    parameter['judgeId'] = store.get('judgeId');
    var roleList = [];
    var tmpIndex = 0;
    var errFlag = 0;
    var errMsg;
    $("#roleScoreList").find(".roleScoreDetail").each(
        function() {
            var roleScoreDetail = {};
            var maxValue = 0;
            var scoreValue = $("input[name='roleScore_"+tmpIndex+"']");
            roleScoreDetail["scoreValue"] = scoreValue.val();
            roleScoreDetail["roleId"] = $("input[name='roleId_"+tmpIndex+"']").val();
            maxValue = $("input[name='max_"+tmpIndex+"']").val();
            // 检查是否超过最大值
            if (parseInt(maxValue) < parseInt(roleScoreDetail["scoreValue"])){
                errMsg = '该项分数不能高于' + maxValue + '分！';
                scoreValue.select();
                errFlag = 1;
                return;
            }
            // 检查分值是否有效
            if (parseInt(roleScoreDetail["scoreValue"]) < 0 || roleScoreDetail["scoreValue"] === ""){
                errMsg = '请输入有效分数！';
                scoreValue.select();
                errFlag = 1;
                return;
            }

            roleList.push(roleScoreDetail);
            tmpIndex ++;
        }
    );
    if (errFlag === 1){
        alert(errMsg);
        return
    }
    parameter['scoreRoleInfoList'] = roleList;
    var jsonOb = eval(parameter);

    var url = path + "/score/addScore";
    $.ajax({
        data : JSON.stringify(jsonOb),
        url : url,
        type : 'POST',
        dataType : 'JSON',
        timeout : 10000,
        contentType: 'application/json;charset=utf-8',
        success : function(data) {
            var message = $('#message');
            message.html('');
            message.html(data.message);
            if (data.flag === 'success'){
                getPlayerList();
                $('.am-modal-prompt-input').val('');
                // var tmpIndex = 0;
                // $("#roleScoreList").find(".roleScoreDetail").each(
                //     function () {
                //         $("input[name='roleScore_"+tmpIndex+"']").val('');
                //         tmpIndex ++;
                //     }
                // );
            }
            $('#my-prompt').modal('close');
            $('#submitAlert').modal('open');
        },
        error : function(data) {
            alert("发生错误，稍后请重新刷新!");
        }
    });
}

// 展示弹窗
function showModel(gameId, playerId, playerName) {
    $('#playerName').html(playerName);
    $('#playerId').val(playerId);

    var parameter = {};
    parameter["playerId"]= playerId;
    parameter["gameId"]= gameId;
    parameter['judgeId'] = store.get('judgeId');
    var url = path + "/score/checkScoreByJudgeId";
    $.ajax({
        data : parameter,
        url : url,
        type : 'POST',
        dataType : 'JSON',
        timeout : 10000,
        success : function(data) {
            var message = $('#message');
            if (data.flag === 'success'){
                message.html('样品<strong>'+playerName+'</strong>您已提交评分，不能再次评分。');
                $('#submitAlert').modal('open');
            }else{
                message.html('');

                $('#my-prompt').modal({
                    relatedTarget: this,
                    onConfirm: function(options) {
                        onSumbitScore(gameId, $('#playerId').val());

                    },
                    closeOnConfirm: false,
                    onCancel: function() {

                    }
                });
            }
        },
        error : function(data) {
            alert("发生错误，稍后请重新刷新!");
        }
    });
}

/**
 * 初始化评委信息
 */
function initLocalStorage() {
    //初始化本地存储对象
    store = $.AMUI.store;

    if (!store.enabled) {
        alert('您的浏览器无法使用本地存储功能. 请禁用隐私模式或更新您的浏览器。');
        return;
    }
    store.clear();
    // var judgeId = store.get('judgeId');
    // var judgeName = store.get('judgeName');

    // if (judgeId === null || judgeId === undefined || judgeId === ''){
        var parameter = {};
        parameter["gameId"]= getUrlParam('gameId');
        parameter["code"]= getUrlParam('code');

        var url = path + "/game/getGameInfoById";
        $.ajax({
            data : parameter,
            url : url,
            type : 'POST',
            dataType : 'JSON',
            timeout : 10000,
            success : function(data) {
                createJudge();
            },
            error : function(data) {

            }
        });
    // }else{
    //     getGroupList();
    //     getPlayerList();
    // }
}

/**
 * 创建评委
 */
function createJudge(realNameFlag) {
    var code = getUrlParam('code');
    var parameter = {};
    parameter["gameId"]= getUrlParam("gameId");
    parameter["code"] = code;
    var url = path + "/judge/createJudge";
    $.ajax({
        data : parameter,
        url : url,
        type : 'POST',
        dataType : 'JSON',
        timeout : 10000,
        success : function(data) {
            if (data.errFlag === 0){
                alert(data.errMsg);
            }else{
                store.set("judgeName", data.judgeInfo.judgeName);
                store.set("judgeId", data.judgeInfo.judgeId);
                getGroupList();
                getPlayerList();
            }
        },
        error : function(data) {
            alert("发生错误，稍后请重新刷新!");
        }
    });
}

function wechatConfigInit() {
    var pageUrl = window.location.href;
    // pageUrl = pageUrl.replace(/localhost:63342/, 'weixin.shidanli.cn');
    var parameter = {};
    parameter["pageUrl"]= pageUrl;

    var url = path + "/wechat/getJsapiTicket";
    $.ajax({
        data : parameter,
        url : url,
        type : 'POST',
        dataType : 'JSON',
        timeout : 10000,
        success : function(data) {
            if (data.errFlag === 1){
                wx.config({
                    beta: true,// 必须这么写，否则在微信插件有些jsapi会有问题
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.wxJsapiSignature.appId, // 必填，企业微信的corpID
                    timestamp: data.wxJsapiSignature.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.wxJsapiSignature.nonceStr, // 必填，生成签名的随机串
                    signature: data.wxJsapiSignature.signature,// 必填，签名，见[附录1](#11974)
                    jsApiList: ['onHistoryBack','closeWindow'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            }
        },
        error : function(data) {
            alert("发生错误，稍后请重新刷新!");
        }
    });

}

wx.closeWindow(
    function () {
        var waitFlag = '';
        for (var i = 0; i < vm.playerList.length; i ++){
            if (vm.playerList[i].playerIsScore === '0'){
                waitFlag = '1';
            }
        }
        if (waitFlag === '1'){
            return confirm("还有样品未评分，确认退出吗？");
        }
    }
);