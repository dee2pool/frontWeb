require.config({
    shim: {
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
        'bootstrap-treeview': {
            deps: ['jquery'],
            exports: "treeview"
        },
        'bootstrapValidator': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapValidator"
        },
        'bootstrap-switch': {
            deps: ['jquery'],
            exports: "bootstrapSwitch"
        },
        'bootstrap-datetimepicker': {
            deps: ['bootstrap', 'jquery'],
            exports: "datetimepicker"
        },
        'bootstrap-datetimepicker.zh-CN': {
            deps: ['bootstrap-datetimepicker', 'jquery']
        },
        'ztree':{
            deps:['jquery']
        }
    },
    paths: {
        "jquery": '../../common/libs/jquery/jquery-1.11.3.min',
        "bootstrap": "../../common/libs/bootstrap/js/bootstrap.min",
        "common": "../../common/js/util",
        "layer": "../../common/libs/layer/layer",
        "frame": "../../sidebar/js/wframe",
        "topBar": "../../../common/component/head/js/topbar",
        "bootstrap-treeview": "../../common/libs/bootstrap-treeview/js/bootstrap-treeview",
        "bootstrapValidator": "../../common/libs/bootstrap-validator/js/bootstrapValidator.min",
        "bootstrap-table": "../../common/libs/bootstrap/js/bootstrap-table",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",
        "orgService": "../../../common/js/service/OrgController",
        "ztree":"../../../common/lib/ztree/js/jquery.ztree.core",
    }
});
require(['jquery', 'common', 'layer', 'frame', 'bootstrapValidator','bootstrap-table','bootstrap', 'bootstrap-treeview', 'topBar', 'orgService','ztree'],
    function (jquery, common, layer, frame, bootstrapValidator,bootstrapTable,bootstrap, treeview, topBar, orgService,ztree) {
        //初始化frame
        $('#sidebar').html(frame.htm);
        frame.init();
        //初始化头部
        $('#head').html(topBar.htm);
        topBar.init();
        //解决layer不显示问题
        layer.config({
            path: '../../common/libs/layer/'
        });
        var orgTree = {};
        orgTree.getTree = function () {
            var tree = [];
            var temp = {};
            orgService.listAllOrg(function (data) {
                if (data.result) {
                    //将节点封装成树形结构
                    for (var i = 0; i < data.data.length; i++) {
                        temp[data.data[i].code] = {
                            code: data.data[i].code,
                            text: data.data[i].name,
                            parentCode: data.data[i].parentCode,
                            createTime: data.data[i].createTime,
                            creatorId: data.data[i].creatorId,
                            description: data.data[i].description,
                            orderNo: data.data[i].orderNo
                        };
                    }
                    for (i = 0; i < data.data.length; i++) {
                        var key = temp[data.data[i].parentCode];
                        if (key) {
                            if (key.nodes == null) {
                                key.nodes = [];
                                key.nodes.push(temp[data.data[i].code]);
                            } else {
                                key.nodes.push(temp[data.data[i].code]);
                            }
                        } else {
                            tree.push(temp[data.data[i].code]);
                        }
                    }
                }
            })
            return tree;
        }
        orgTree.isNodeSelected = false;
        orgTree.nodeSelected;
        orgTree.init = function () {
            //滚动条
            $('#orgtree').treeview({
                showBorder: false,
                nodeIcon: 'glyphicon glyphicon-cloud',
                data: orgTree.getTree(),
                onhoverColor: 'lightgrey',
                selectedBackColor: 'lightgrey',
                selectedColor: 'black',
                onNodeSelected: function (event, data) {
                    orgTree.isNodeSelected = true;
                    orgTree.nodeSelected = data;
                    //更新表格
                    orgService.getChildList(data.code,function (data) {
                        if(data.result){
                            $('#org_table').bootstrapTable('load',data.data);
                            //更新分页
                            common.pageInit(1,10,data.dataSize)
                        }else{
                            layer.msg(data.description);
                        }
                    })
                },
                onNodeUnselected: function (event, data) {
                    domainTree.isNodeSelected = false;
                    domainTree.nodeSelected = null;
                }
            })
        }
        orgTree.init();
        //表格
        var init_page={
            pageNumber: 1,
            pageSize: 10
        }
        orgService.getOrgList(init_page.pageNumber,init_page.pageSize,init_page.orgName,function (data) {
            if(data.result){
                $('#org_table').bootstrapTable({
                    columns:[{
                        checkbox: true
                    },{
                        field: 'name',
                        title: '组织名称',
                        align: 'center'
                    },{
                        field: 'code',
                        title: '组织ID',
                        align: 'center'
                    },{
                        field: 'orderNo',
                        visible:false
                    },{
                        field: 'parentCode',
                        visible:false
                    },{
                        field: 'createTime',
                        visible:false
                    },{
                        field: 'creatorId',
                        visible:false
                    },{
                        field: 'areaCode',
                        visible:false
                    },{
                        field: 'description',
                        title: '组织描述',
                        align: 'center'
                    },{
                        title: '操作',
                        align: 'center',
                        events: {
                            "click #edit_role": function (e, value, row, index) {
                                /*$('input[name="dName"]').val(row.name);
                                $('input[name="dNo"]').val(row.orderNo);
                                $('textarea[name="dRemark"]').val(row.description);
                                domain.editValidator();
                                layer.open({
                                    type: 1,
                                    title: '修改域',
                                    offset: '100px',
                                    area: '600px',
                                    resize: false,
                                    content: $('#alt_Domain')
                                })
                                //表单提交
                                $('#altDomainForm').on('success.form.bv', function () {
                                    var domain = {};
                                    domain.code = row.code
                                    domain.name = $('input[name="dName"]').val();
                                    domain.description = $('textarea[name="dRemark"]').val();
                                    domain.parentCode = row.parentCode
                                    domain.orderNo = $('input[name="dNo"]').val();
                                    domain.createTime = row.createTime
                                    domain.creatorId = row.creatorId
                                    domainService.updateDomain(domain.code,domain, function (data) {
                                        if (data.result) {
                                            layer.msg('更新成功')
                                            //清除校验
                                            $("#altDomainForm").data('bootstrapValidator').destroy();
                                            //更新树
                                            domainTree.getTree();
                                            domainTree.init();
                                            layer.closeAll();
                                            //更新表格
                                            $('#area_table').bootstrapTable('updateRow',{index:index,row:domain})
                                        } else {
                                            layer.msg(data.description)
                                            $("button[type='submit']").removeAttr('disabled');
                                        }
                                    })
                                    return false;
                                })*/
                            },
                            "click #del_role": function (e, value, row, index) {
                                //点击删除按钮
                                layer.confirm('确定删除 ' + row.name + ' ?', {
                                    btn: ['确定', '取消'] //按钮
                                }, function () {
                                    //删除操作
                                    domainService.deleteDomainByCode(row.code, function (data) {
                                        if (data.result) {
                                            layer.closeAll();
                                            //更新树
                                            domainTree.getTree();
                                            domainTree.init();
                                            //更新表格
                                            $('#area_table').bootstrapTable('remove', {field: 'code', values: [row.code]})
                                        } else {
                                            layer.msg(data.description);
                                        }
                                    })
                                }, function () {
                                    layer.closeAll();
                                });
                            }
                        },
                        formatter: function () {
                            var icons = "<div class='btn-group-sm'><button id='edit_role' class='btn btn-default'><i class='fa fa-edit'></i></button>" +
                                "<button id='del_role' class='btn btn-default'><i class='fa fa-remove'></i></button>" +
                                "</div>"
                            return icons;
                        }
                    }],
                    data:data.data
                })
                //初始化分页组件
                common.pageInit(init_page.pageNumber,init_page.pageSize,data.extra)
            }
        })
        var orgvalia = {};
        orgvalia.addValidator = function () {
            $('#orgForm').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    orgName: {
                        validators: {
                            notEmpty: {
                                message: '组织名称不能为空'
                            }
                        }
                    },
                    areaCode: {
                        validators: {
                            notEmpty: {
                                message: '区域编码不能为空'
                            }
                        }
                    },
                    orderNo: {
                        validators: {
                            notEmpty: {
                                message: '展示序号不能为空'
                            },
                            numeric: {
                                message: '展示序号只能为数字'
                            }
                        }
                    }
                }
            })
        }
        /*orgvalia.editValidator = function () {
            $('#altDomainForm').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    dName: {
                        validators: {
                            notEmpty: {
                                message: '域名称不能为空'
                            }
                        }
                    }, dNo: {
                        validators: {
                            notEmpty: {
                                message: '展示序号不能为空'
                            },
                            numeric: {
                                message: '展示序号只能为数字'
                            }
                        }

                    }
                }
            })
        }*/
        //添加组织
        $('#addOrg').click(function () {
            if(!orgTree.isNodeSelected){
                layer.msg('请选择上级组织')
            }else{
                //开启验证
                orgvalia.addValidator();
                $('input[name="orgOrderName"]').val(orgTree.nodeSelected.text);
                $('input[name="orgOrderNo"]').val(orgTree.nodeSelected.code);
                layer.open({
                    type: 1,
                    title: '添加组织',
                    offset: '100px',
                    area: '600px',
                    resize: false,
                    content: $('#add_org')
                })
                //表单提交
                $('#orgForm').on('success.form.bv', function () {
                    var org = {};
                    org.name = $('input[name="domainName"]').val();
                    org.parentCode = $('input[name="parentDoaminCode"]').val();
                    org.orderNo = $('input[name="orderNo"]').val();
                    org.description = $('textarea[name="domainRemark"]').val();
                    areaCode=$('input[name="areaCode"]').val();
                    orgService.addOrg(org,areaCode,function (data) {
                        if (data.result) {
                            layer.msg('添加组织成功');
                            orgTree.getTree();
                            orgTree.init();
                            //向表格中添加
                            org.code=data.data
                            $('#org_table').bootstrapTable('append',org);
                            layer.closeAll();
                            //清空表单
                            $('input[name="orgOrderName"]').val('无');
                            $('input[name="orgOrderNo"]').val('-1');
                            $("input[name='res']").click();
                            //清空验证
                            $("#orgForm").data('bootstrapValidator').destroy();
                        } else {
                            layer.msg(data.description)
                        }
                    })
                    return false;
                })
            }
        })
        var setting={
            data:{
                simpleData:{
                    enable:true,
                    idKey:"code",
                    pIdKey:"parentCode"
                },
                key:{
                    name:"name"
                },
                keep:{
                    parent:true
                }
            }
        }
        //初始化区域树
        var treeNode;
        orgService.getChildArea('000000',function (data) {
            if(data.result){
                for(var i=0;i<data.dataSize;i++){
                    data.data[i].isParent=true;
                }
                treeNode=data.data;
            }else{
                layer.msg(data.description);
            }
        })
        $.fn.zTree.init($("#areatree"),setting,treeNode);
        //选择区域
        $('#choseArea').click(function () {
            layer.open({
                type: 1,
                title: '区域编码树',
                skin: 'layui-layer-rim',
                offset: '100px',
                area: ['300px', '450px'],
                resize: false,
                content: $('#areatree')
            })
        })
    })