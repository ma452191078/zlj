/**
 * Created by majingyuan on 2017/5/30.
 */

var vm = null;
// 初始化加载vue
$(document).ready(function() {

    getGameResult();
    vm = new Vue({
        el : '#body',
        data : {
            playerResult:[],
            departmentResult:[]
        },
        methods : {
            updateData: function (data) {
                this.playerResult = data.playerResult;
                this.departmentResult = data.departmentResult;
            }
        }
    });
});


// 获取比赛
function getGameResult() {
    gameId = getUrlParam("gameId");
    var parameter = {};
    parameter["gameId"] = gameId;
    var url = path + "/player/getPlayerScoreListFroResult";
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

