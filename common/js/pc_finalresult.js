var vm = null;
var gameId = null;
// 初始化加载vue
$(document).ready(function() {

    getDepartmentList();
    vm = new Vue({
        el : '#body',
        data : {
            departmentInfoList:[],
            groupInfoList:[],
            departmentScoreInfoList:[]
        },
        methods : {
            updateData: function (data) {
                this.departmentInfoList = data.departmentInfoList;
                this.groupInfoList = data.groupInfoList;
                this.departmentScoreInfoList = data.departmentScoreInfoList;
            },
            saveData: function () {
                var departmentList = [];
                var department = {};
                //遍历查询单位信息
                for (var i = 0; i < this.departmentInfoList.length; i++){
                    var departmentInfo = {};
                    departmentInfo["gameId"] = gameId;
                    departmentInfo["departmentName"] = $("#departmentName_"+i).html();
                    departmentInfo["score2"] = $("#score2_"+i).val();
                    departmentInfo["score3"] = $("#score3_"+i).val();
                    departmentInfo["score4"] = $("#score4_"+i).val();
                    departmentInfo["score5"] = $("#score5_"+i).val();
                    departmentInfo["score6"] = $("#score6_"+i).val();
                    departmentInfo["score7"] = $("#score7_"+i).val();
                    var detailList = [];
                    for (var j = 0; j < this.groupInfoList.length; j++){
                        var detailInfo = {};
                        detailInfo["groupName"] = $("#groupName_"+i+"_"+j).html();
                        detailInfo["groupId"] = $("#groupId_"+i+"_"+j).val();
                        detailInfo["score2"] = $("#score2_"+i+"_"+j).val();
                        detailList.push(detailInfo);
                    }
                    departmentInfo["scoreDetailInfoList"] = detailList;
                    departmentList.push(departmentInfo);
                }

                var parameter = {};
                parameter["gameId"] = gameId;
                parameter["scoreList"] = departmentList;
                var jsonOb = eval(parameter);

                var url = path + "/department/saveDepartmentList";

                $.ajax({
                    data : JSON.stringify(jsonOb),
                    url : url,
                    type : 'POST',
                    dataType : 'JSON',
                    timeout : 10000,
                    contentType: 'application/json;charset=utf-8',
                    success : function(data) {

                    },
                    error : function() {
                    }
                });


            }
        }
    });

});

function getDepartmentList() {
    gameId = getUrlParam("gameId");
    var parameter = {};
    parameter["gameId"] = gameId;
    var url = path + "/department/getFinalResult";
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