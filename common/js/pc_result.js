/**
 * Created by majingyuan on 2017/5/30.
 */

var vm = null;
var gameId = getUrlParam("gameId");
var playerCharts;
var chartIndex = 0;
var charStyle = ['#0070C0','#00B050','#0591bb'];

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
                    fontSize : 12,
                    fontWeight:600
                }
            },
            data: playerList
        },
        yAxis: {
            splitLine:{show: false},//去除网格线
            axisLabel: {textStyle: {
                    color: 'auto',
                    fontSize : 12,
                    fontWeight:600
                }
            }
        },
        series: [{
            name: '得分',
            type: 'bar',
            barMinHeight: 10,
            label: {
                normal: {
                            show: true,
                            position: 'top',
                            fontSize: 11,
                            color: '#000000',
                            fontWeight:600,
                            formatter:function(data){ return data.value.toFixed(2);}
                        }
            },
            itemStyle: {
                normal: {color: chartIndex % 2 == 0 ?charStyle[0]:charStyle[1]}
            },
            data: scoreList

        }]
    });
    myCharts.hideLoading();
    chartIndex ++;
}
