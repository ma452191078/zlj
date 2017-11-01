var vm = null;
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
            }
        }
    });

});

function getDepartmentList() {
    gameId = getUrlParam("gameId");
    var parameter = {};
    parameter["gameId"] = gameId;
    var url = path + "/department/getDepartmentList";
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