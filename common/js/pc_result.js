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
            departmentResult:[],
            gameInfo:{}
        },
        methods : {
            updateData: function (data) {
                this.playerResult = data.playerResult;
                this.departmentResult = data.departmentResult;
                this.gameInfo = data.gameInfo;
            }
        }
    });

    var t1 = window.setInterval(getGameResult,1000);
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
        }
    });
}

