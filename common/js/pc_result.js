/**
 * Created by majingyuan on 2017/5/30.
 */

var vm = null;
var gameId = getUrlParam("gameId");
var playerCharts;

// 初始化加载vue
$(document).ready(function() {


    getGameResult();
    vm = new Vue({
        el : '#body',
        data : {
            playerResult:[],
            departmentResult:[],
            groupList:[],
            gameInfo:{}
        },
        methods : {
            updateData: function (data) {
                this.playerResult = data.playerResult;
                this.departmentResult = data.departmentResult;
                this.gameInfo = data.gameInfo;
                this.groupList = data.groupList;
                for (var i = 0; i < this.groupList.length; i++){
                    playerChartsInit(playerCharts, this.groupList[i], this.playerResult);
                }

            }
        }
    });

    var t1 = window.setInterval(getGameResult,1000);
});


// 获取比赛
function getGameResult() {

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

function showFinalResult() {
    window.location.href = "finalresults.html?gameId="+gameId;
}

function playerChartsInit(myCharts, groupInfo, playerResult) {
    var playerList = new Array();
    var scoreList = [];
    var j = 0;

    for(var i = 0; i < playerResult.length; i++){
        if (playerResult[i].groupId === groupInfo.groupId){
            playerList[j] = playerResult[i].playerName;
            scoreList[j] = playerResult[i].playerAverage;
            j++;
        }
    }
    
    myCharts = echarts.init(document.getElementById('playerCharts_'+groupInfo.groupId));
    myCharts.showLoading();
    myCharts.setOption({
        title: {
            text: groupInfo.groupName
        },
        tooltip: {},
        legend: {
            data:['得分']
        },
        xAxis: {
            splitLine:{show: false},//去除网格线
            axisLabel: {textStyle: {
                    color: 'auto',
                    fontSize : 12
                }
            },
            data: playerList
        },
        yAxis: {
            splitLine:{show: false}//去除网格线
        },
        series: [{
            name: '得分',
            type: 'bar',
            barMinHeight: 10,
            label: {
                normal: {
                            show: true,
                            position: 'inside',
                            fontSize: 12,
                            color: '#434343'
                        }
                },
            itemStyle: {
                normal: {color: '#acbb2e'}
            },
            data: scoreList
        }]
    });
    myCharts.hideLoading();

}
