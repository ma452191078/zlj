/**
 * Created by majingyuan on 2017/5/30.
 */

var vm = null;
var gameId = getUrlParam("gameId");
var playerCharts;

// 初始化加载vue
$(document).ready(function() {

    // playerChartsInit(playerCharts);
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

// function playerChartsInit(myCharts) {
//     myCharts = echarts.init(document.getElementById('playerCharts'));
//     myCharts.setOption({
//         title: {
//             text: '异步数据加载示例'
//         },
//         tooltip: {},
//         legend: {
//             data:['销量']
//         },
//         xAxis: {
//             data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
//         },
//         yAxis: {},
//         series: [{
//             name: '销量',
//             type: 'bar',
//             data: [5, 20, 36, 10, 10, 20]
//         }]
//     });
// }
