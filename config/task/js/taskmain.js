require.config({
    shim: {
        'ztree': {
            deps: ['jquery']
        },
        'frame': {
            deps: ['jquery', 'menu', 'MenuService'],
            exports: "frame"
        },
        'common': {
            deps: ['jquery'],
            exports: "common"
        },
        'layer': {
            deps: ['jquery'],
            exports: "layer"
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'bootstrap-table': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapTable"
        },
        'bootstrap-table-zh-CN': {
            deps: ['bootstrap-table', 'jquery'],
            exports: "bootstrapTableZhcN"
        },
        'bootstrap-datetimepicker': {
            deps: ['bootstrap', 'jquery'],
            exports: "datetimepicker"
        },
        'bootstrap-datetimepicker.zh-CN': {
            deps: ['bootstrap-datetimepicker', 'jquery']
        },
        'bootstrapValidator': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapValidator"
        },
    },
    paths: {
        "jquery": '../../../common/lib/jquery/jquery-3.3.1.min',
        "bootstrap": "../../../common/lib/bootstrap/js/bootstrap.min",
        "bootstrapValidator": "../../../common/lib/bootstrap/libs/bootstrap-validator/js/bootstrapValidator.min",
        "bootstrap-table": "../../../common/lib/bootstrap/libs/BootstrapTable/bootstrap-table",
        "bootstrap-table-zh-CN": "../../../common/lib/bootstrap/libs/bootstrapTable/locale/bootstrap-table-zh-CN.min",
        "bootstrap-datetimepicker": "../../../common/lib/bootstrap/libs/bootstrap-datetimepicker/js/bootstrap-datetimepicker",
        "bootstrap-datetimepicker.zh-CN": "../../../common/lib/bootstrap/libs/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN",
        "frame": "../../sidebar/js/wframe",
        "common": "../../common/js/util",
        "layer": "../../../common/lib/layer/layer",
        "topBar": "../../../common/component/head/js/topbar",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",
        "orgService": "../../../common/js/service/OrgController",
        "taskService": "../../../common/js/service/taskController",
        "ztree": "../../../common/lib/ztree/js/jquery.ztree.core",
        "ztreeCheck": "../../../common/lib/ztree/js/jquery.ztree.excheck"
    }
});
require(['jquery', 'common', 'layer','bootstrap','frame','bootstrapValidator', 'bootstrap-table', 'bootstrap-table-zh-CN','bootstrap-datetimepicker','bootstrap-datetimepicker.zh-CN','topBar','orgService','ztree','taskService'],
    function (jquery, common, layer,bootstrap,frame,bootstrapValidator, bootstrapTable, bootstrapTableZhcN,datetimepicker, datetimepickerzhCN,topBar,orgService,ztree,taskService) {
        //初始化frame
        $('#sidebar').html(frame.taskHtm);
        frame.showLeave();
        //初始化头部
        $('#head').html(topBar.htm);
        topBar.init();
        //解决layer不显示问题
        layer.config({
            path: '../../../common/lib/layer/'
        });
        /********************************* 数字加减操作 ***************************************/
        $('.spinner .btn:first-of-type').on('click', function() {
            $('.spinner input').val( parseInt($('.spinner input').val(), 10) + 1);
        });
        $('.spinner .btn:last-of-type').on('click', function() {
            $('.spinner input').val( parseInt($('.spinner input').val(), 10) - 1);
        });
        /********************************* 任务表格 ***************************************/
        var taskTable={};
        taskTable.init=function () {
            var queryUrl = common.task +"/task"+"/list";
            $('#task_table').bootstrapTable({
                columns: [{
                    checkbox: true
                }, {
                    field: 'taskId',
                    title: '任务编号',
                    align: 'center'
                }, {
                    field: 'taskName',
                    title: '任务名称',
                    align: 'center'
                }, {
                    field: 'jobType',
                    title: '任务类型',
                    align: 'center'
                }, {
                    field: 'priority',
                    title: '优先级',
                    align: 'center'
                }, {
                    field: 'triggerTime',
                    title: '开始时间',
                    align: 'center'
                }, {
                    field: 'cronTemplet',
                    title: '周期模板',
                    align: 'center'
                }, {
                    field: 'taskType',
                    title: '业务名称',
                    align: 'center'
                }, {
                    field: 'submitResult',
                    title: '提交结果',
                    align: 'center'
                }, {
                    field: 'remarks',
                    title: '备注',
                    align: 'center'
                }, {
                    field: 'executeResult',
                    title: '详情',
                    align: 'center',
                    events: {
                        "click #showDetail": function (e, value, row, index) {
                            alert(value)
                        }
                    },
                    formatter: function () {
                        var icons = "<button id='showDetail' class='btn btn-success btn-xs'><i class='fa fa-pencil'></i>查看</button>"
                        return icons;
                    }
                }, {
                    title: '操作',
                    align: 'center',
                    events: {
                        "click #edit": function (e, value, row, index) {
                            retryTask.init(row)
                        },
                        "click #del": function (e, value, row, index) {
                            taskDel.init(row)
                        }
                    },
                    formatter: function () {
                        var icons = "<button id='edit' class='btn btn-success btn-xs'><i class='fa fa-pencil'></i>重试</button>" +
                            "<button id='del' class='btn btn-danger btn-xs'><i class='fa fa-remove'></i>删除</button>"
                        return icons;
                    }
                }],
                url: queryUrl,
                method: 'GET',
                cache: false,
                pagination: true,
                sidePagination: 'server',
                pageNumber: 1,
                pageSize: 10,
                pageList: [10, 20, 30],
                smartDisplay: false,
                showRefresh: false,
                queryParamsType: '',
                responseHandler: function (res) {
                    var rows = res.data;
                    var total = res.extra;
                    return {
                        "rows": rows,
                        "total": total
                    }
                },
                queryParams: function (params) {
                    var temp = {
                        pageNo: params.pageNumber,
                        pageSize: params.pageSize
                    }
                    return temp
                }
            })
        }
        taskTable.init();
        //初始化表格高度
        $('#domain_table').bootstrapTable('resetView', {height: $(window).height() - 135});
        //自适应表格高度
        common.resizeTableH('#domain_table');
        /********************************* 组织树 ***************************************/
        var orgTree = {};
        orgTree.setting = {
            data: {
                simpleData: {
                    enable: true,
                    idKey: "code",
                    pIdKey: "parentCode",
                },
                key: {
                    name: "name"
                },
                keep: {
                    parent: true
                }
            },
            callback: {
                onClick: function (event, treeId, treeNode) {
                    orgTree.nodeSelected = treeNode;
                },
                onExpand: function (event, treeId, treeNode) {
                    //清空当前父节点的子节点
                    orgTree.obj.removeChildNodes(treeNode);
                    orgService.getChildList(treeNode.code, function (data) {
                        if (data.result) {
                            if (data.result) {
                                for (var i = 0; i < data.dataSize; i++) {
                                    data.data[i].isParent = true;
                                    data.data[i].icon = "../img/org.png";
                                }
                                var newNodes = data.data;
                                //添加节点
                                orgTree.obj.addNodes(treeNode, newNodes);
                            } else {
                                layer.msg('加载组织树失败');
                            }
                        }
                    })
                }
            }
        };
        orgTree.zNode = function () {
            var treeNode;
            orgService.getChildList('-1', function (data) {
                if (data.result) {
                    for (var i = 0; i < data.dataSize; i++) {
                        data.data[i].isParent = true;
                        data.data[i].icon = "../img/org.png";
                    }
                    treeNode = data.data;
                } else {
                    layer.msg('加载组织树失败');
                }
            })
            return treeNode;
        }
        orgTree.init = function () {
            orgTree.obj = $.fn.zTree.init($("#orgtree"), orgTree.setting, orgTree.zNode());
        }
        orgTree.init();
        /********************************* 设备列表 ***************************************/
        var cameraTable={};
        cameraTable.init=function () {
            var queryUrl = common.test141 +"/cameraInfoService"+"/getCameraInfoList";
            $('#camera_table').bootstrapTable({
                columns:[{
                        checkbox: true
                    }, {
                        field: 'cResName',
                        title: '摄像机',
                        align: 'center'
                    }, {
                        field: 'cIpAddr',
                        title: 'IP',
                        align: 'center'
                    }],
                url: queryUrl,
                method: 'GET',
                cache: false,
                pagination: true,
                sidePagination: 'server',
                pageNumber: 1,
                pageSize: 10,
                pageList: [10, 20, 30],
                queryParamsType: '',
                responseHandler: function (res) {
                    var rows = res.data;
                    var total = res.extra;
                    return {
                        "rows": rows,
                        "total": total
                    }
                },
                queryParams: function (params) {
                    var temp = {
                        page:JSON.stringify({
                            cOrgCode:'00000000000000000000',
                            pageNumber:params.pageNumber,
                            pageSize:params.pageSize,
                            includeChildOrg:true
                        })
                    }
                    return temp;
                }
            })
        }
        cameraTable.init();
        /********************************* 添加任务 ***************************************/
        var addTask={};
        //日历控件
        $('.form_datetime').datetimepicker({
            language: 'zh-CN',
            todayBtn: 1,
            format: 'yyyy-mm-dd hh:ii:ss',
            autoclose: 1,
            startView: 2,
            forceParse: 0,
            startDate:new Date(),
            initialDate: new Date(),
            pickerPosition: 'bottom-left'
        });
        addTask.taskInputCha=function(){
            $('#taskType').change(function () {
                switch ($(this).val()){
                    case '1':
                        $('#triTime').hide();
                        $('#cronText').hide();
                        break;
                    case '2':
                        $('#triTime').css('display','inline-block');
                        $('#cronText').hide();
                        break;
                    case '3':
                        $('#cronText').css('display','inline-block');
                        $('#triTime').hide();
                        break;
                }
            })
        }
        addTask.valia=function(){
            $('#taskForm').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    taskName: {
                        validators: {
                            notEmpty: {
                                message: '任务名称不能为空'
                            }
                        }
                    }
                }
            })
        }
        addTask.submit=function(){
            $('#taskForm').on('success.form.bv',function () {
                //判断是否选择设备
                var cameras=$('#camera_table').bootstrapTable('getSelections');
                if(cameras.length>0){
                    //TODO 重新修改接口
                    var deviceList=new Array();
                    for(var i=0;i<cameras.length;i++){
                        var device={};
                        device.deviceName=cameras[i].cResName;
                        device.deviceCode=cameras[i].cResCode;
                        device.port=cameras[i].iStreamPort;
                        device.strIp=cameras[i].cIpAddr;
                        device.nChannel=cameras[i].iChannelNo;
                        device.deviceTypeCode=cameras[i].cResourceTypeCode;
                        device.enVendor=cameras[i].cManufacturerName;
                        deviceList.push(device);
                    }
                    var task={};
                    task.taskName=$('input[name="taskName"]').val();
                    task.jobType=$('#taskType').val();
                    switch ($('#taskType').val()){
                        case '2':
                            task.triggerTime=new Date($('input[name="triggerTime"]').val()).valueOf();
                            break;
                        case '3':
                            task.cronTemplet=$('select[name=""]').val();
                            break;
                    }
                    task.taskType='录像文件巡检';
                    task.taskDevice=deviceList;
                    var date=new Date();
                    date.setDate(date.getDate()-2);
                    task.submitParam={
                        subStream:1,
                        fileType:'All',
                        startTime:date.getTime(),
                        endTime:new Date().getTime()
                    }
                    task.remarks=$('textarea[name="res"]').val();
                    taskService.addTask(task,function (data) {
                        if(data.result){
                            common.clearForm('taskForm');
                            layer.closeAll();
                            layer.msg('添加成功');
                            //刷新表格
                            $('#task_table').bootstrapTable('refresh', {silent: true});
                            addTask.isClick=false;
                        }else {
                            layer.msg(data.description)
                        }
                    })
                }else{
                    layer.msg('请选择需要配置任务的设备');
                }
                return false;
            })
        }
        //阻止表单重复提交
        addTask.isClick=false;
        addTask.init=function () {
            $('#addTask').click(function () {
                addTask.taskInputCha();
                layer.open({
                    type: 1,
                    title: '添加任务',
                    skin: 'layui-layer-lan',
                    offset: '100px',
                    area: '960px',
                    resize: false,
                    zIndex: 1000,//日期控件的zIndex为1001
                    content: $('#add_task'),
                    cancel: function (index, layero) {
                        common.clearForm('taskForm');
                        addTask.isClick=false;
                    }
                })
                if(!addTask.isClick){
                    //开启验证
                    addTask.valia();
                    addTask.submit();
                    addTask.isClick=true;
                }
            })

            //关闭弹窗
            $('.btn-cancel').click(function () {
                layer.closeAll();
                common.clearForm('taskForm');
                addTask.isClick=false;
            })
        }
        addTask.init();
        /********************************* 删除任务 ***************************************/
        var taskDel={};
        taskDel.init=function (row) {
            //点击删除按钮
            layer.confirm('确定删除 ' + row.taskName + ' ?', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                var canDelete=true;
                if(row.jobType > 1){
                    if(row.jobType==2){
                        if(new Date(row.triggerTime).getTime()>new Date().getTime()){
                            canDelete=false;
                        }
                    }
                    if(row.jobType==3){
                        canDelete=false;
                    }
                }
                if(canDelete){
                    taskService.deleteTask(row.taskId,function (data) {
                        if(data.result){
                            layer.msg('删除成功!');
                            $('#task_table').bootstrapTable('remove', {field: 'taskId', values: [row.taskId]});
                        }else{
                            layer.msg('删除失败!')
                        }
                    })
                }else{
                    layer.msg('任务还未执行 不能删除')
                }
            }, function () {
                layer.closeAll();
            });
        }
        /********************************* 重试任务 ***************************************/
        var retryTask={};
        retryTask.init=function (row) {
            taskService.retryTask(row.taskId,function (data) {
                if(data.result){
                    layer.msg('任务重试成功')
                }else{
                    layer.msg(data.description)
                }
            })
        }
    })