/**
 * Created by majingyuan on 2017/5/30.
 */

var vm = null;
// 初始化加载vue
$(document).ready(function() {

    getJudgeList();
    vm = new Vue({
        el : '#body',
        data : {
            judgeInfoList:[],
            scoreList:[],
            playerResult:[]
        },
        methods : {
            updateData : function(data) {
                this.judgeInfoList = data.judgeInfoList;
            },
            updateScoreList : function (playerResult) {
                this.playerResult = playerResult;
            },
            showScore : function (index) {
                var judgeInfo = this.judgeInfoList[index];
                var parameter = {};
                parameter["judgeId"] = judgeInfo.judgeId;
                parameter["gameId"] = getUrlParam("gameId");
                var url = path + "/player/getPlayerScoreListByJudge";
                $.ajax({
                    data : parameter,
                    url : url,
                    type : 'POST',
                    dataType : 'JSON',
                    timeout : 10000,
                    success : function(data) {
                        vm.updateScoreList(data.playerResult);
                    },
                    error : function() {
                        alert("发生错误，稍后请重新刷新!");
                    }
                });
            }
        }
    });
});


// 获取评委列表
function getJudgeList() {
    gameId = getUrlParam("gameId");
    var parameter = {};
    parameter["gameId"] = gameId;
    var url = path + "/judge/getJudgeListByGame";
    $.ajax({
        data : parameter,
        url : url,
        type : 'POST',
        dataType : 'JSON',
        timeout : 10000,
        success : function(data) {
            vm.updateData(data);
        },
        error : function() {
            alert("发生错误，稍后请重新刷新!");
        }
    });
}
