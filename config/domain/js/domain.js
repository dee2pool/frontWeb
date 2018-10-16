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
        }
    },
    paths: {
        "jquery": '../../../common/lib/jquery/jquery-3.3.1.min',
        "bootstrap": "../../../common/lib/bootstrap/js/bootstrap.min",
        "common": "../../common/js/util",
        "layer": "../../../common/lib/layer/layer",
        "frame": "../../sidebar/js/wframe",
        "topBar": "../../../common/component/head/js/topbar",
        "bootstrap-treeview": "../../../common/lib/bootstrap/libs/bootstrap-treeview/js/bootstrap-treeview",
        "bootstrapValidator": "../../../common/lib/bootstrap/libs/bootstrap-validator/js/bootstrapValidator.min",
        "bootstrap-table": "../../../common/lib/bootstrap/libs/BootstrapTable/bootstrap-table",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",
        "domainService": "../../../common/js/service/DomainController",
        "orgService": "../../../common/js/service/OrgController"
    }
});
require(['jquery', 'common', 'layer', 'frame', 'bootstrapValidator','bootstrap-table','bootstrap', 'bootstrap-treeview', 'topBar', 'domainService', 'orgService'],
    function (jquery, common, layer, frame, bootstrapValidator,bootstrapTable,bootstrap, treeview, topBar, domainService, orgService) {
        //初始化frame
        $('#sidebar').html(frame.htm);
        frame.init();
        //初始化头部
        $('#head').html(topBar.htm);
        topBar.init();
        //解决layer不显示问题
        layer.config({
            path: '../../../common/lib/layer/'
        });
        /********************************* 管理域树 ***************************************/
        var domainTree = {};
        domainTree.getTree = function () {
            var tree = [];
            var temp = {};
            domainService.listAllDomain(function (data) {
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
        domainTree.isNodeSelected = false;
        domainTree.nodeSelected;
        domainTree.init = function () {
            //滚动条
            $('#domaintree').treeview({
                showBorder: false,
                nodeIcon: 'glyphicon glyphicon-cloud',
                data: domainTree.getTree(),
                onhoverColor: 'lightgrey',
                selectedBackColor: 'lightgrey',
                selectedColor: 'black',
                onNodeSelected: function (event, data) {
                    domainTree.isNodeSelected = true;
                    domainTree.nodeSelected = data;
                    //更新表格
                    domainService.getChildList(data.code,function (data) {
                        if(data.result){
                            $('#area_table').bootstrapTable('load',data.data);
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
        domainTree.init();
        /********************************* 组织树 ***************************************/
        var orgTree={};
        orgTree.getData=function () {
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
        orgTree.init=function () {
            $('#orgtree').treeview({
                showBorder: false,
                showCheckbox: true,
                data: orgTree.getData(),
                selectedBackColor: 'lightgrey',
                selectedColor: 'black',
                onNodeChecked: function (event,node) {
                    var nodeId = [];
                    //如果有子节点
                    if (node.nodes) {
                        for (var i = 0; i < node.nodes.length; i++) {
                            nodeId.push(node.nodes[i].nodeId);
                        }
                        $("#orgtree").treeview("checkNode", [nodeId, {silent: true}]);
                    } else {
                        var pId = node.parentId;
                        if (pId) {
                            var parentNode = $('#orgtree').treeview("getNode", pId);
                            var checkNum = 0;
                            for (var i = 0; i < parentNode.nodes.length; i++) {
                                if (parentNode.nodes[i].state.checked) {
                                    checkNum++;
                                }
                            }
                            if (checkNum == parentNode.nodes.length) {
                                $("#orgtree").treeview("checkNode", parentNode.nodeId);
                            }
                        }
                    }
                },
                onNodeUnchecked: function (event,node) {
                    var nodeId = [];
                    if (node.nodes) {
                        for (var i = 0; i < node.nodes.length; i++) {
                            nodeId.push(node.nodes[i].nodeId);
                        }
                        $("#orgtree").treeview("uncheckNode", [nodeId, {silent: true}]);
                    } else {
                        var pId = node.parentId;
                        if (pId) {
                            var parentNode = $('#orgtree').treeview("getNode", pId);
                            var checkNum = 0;
                            for (var i = 0; i < parentNode.nodes.length; i++) {
                                if (!parentNode.nodes[i].state.checked) {
                                    checkNum++;
                                }
                            }
                            if (checkNum == parentNode.nodes.length) {
                                $("#orgtree").treeview("uncheckNode", parentNode.nodeId);
                            }
                        }
                    }
                }
            })
        }
        //管理域表格
        var init_page={
            pageNumber: 1,
            pageSize: 10
        }
        domainService.getDomainList(init_page.pageNumber,init_page.pageSize,init_page.domainName,function (data) {
            if(data.result){
                $('#area_table').bootstrapTable({
                    columns:[{
                        checkbox: true
                    },{
                        title:'序号',
                        align:'center',
                        formatter: function (value, row, index) {
                            return index+1;
                        }
                    },{
                        field: 'name',
                        title: '管理域名称',
                        align: 'center'
                    },{
                        field: 'code',
                        title: '管理域ID',
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
                        field: 'description',
                        title: '管理域描述',
                        align: 'center'
                    },{
                        title: '操作',
                        align: 'center',
                        events: {
                            "click #edit_role": function (e, value, row, index) {
                                $('input[name="dName"]').val(row.name);
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
                                })
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
                            },
                            "click #cog_org":function (e,value,row,index) {
                                orgTree.init();
                                var orgTap=layer.open({
                                    type: 1,
                                    title: '分配组织',
                                    offset: '100px',
                                    area: '600px',
                                    resize: false,
                                    content: $('#add_org')
                                })
                                //为管理域分配组织
                                $('#assignOrg').click(function () {
                                    var orgIds=new Array();
                                    var nodeSel=$('#orgtree').treeview('getChecked');
                                    for (var i = 0; i < nodeSel.length; i++) {
                                        orgIds.push(nodeSel[i].code);
                                    }
                                    domainService.assignOrgToDomain(row.code,orgIds,function (data) {
                                        if(data.result){
                                            layer.msg('分配组织成功');
                                            layer.close(orgTap)
                                        }else{
                                            layer.msg(data.description)
                                        }
                                    })
                                })
                            }
                        },
                        formatter: function () {
                            var icons = "<div class='btn-group-sm'><button id='edit_role' class='btn btn-default'><i class='fa fa-edit'></i></button>" +
                                "<button id='del_role' class='btn btn-default'><i class='fa fa-remove'></i></button>" +
                                "<button id='cog_org' class='btn btn-default'><i class='fa fa-cog'></i></button>" +
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
        var domain = {};
        domain.addValidator = function () {
            $('#domainForm').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    domainName: {
                        validators: {
                            notEmpty: {
                                message: '域名称不能为空'
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
        domain.editValidator = function () {
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
        }
        //添加域
        $('#addDomain').click(function () {
            if(!domainTree.isNodeSelected){
                $('input[name="parentDoamin"]').val('默认管理域');
                $('input[name="parentDoaminCode"]').val('00000000000010000049');
            }else {
                $('input[name="parentDoamin"]').val(domainTree.nodeSelected.text);
                $('input[name="parentDoaminCode"]').val(domainTree.nodeSelected.code);
            }
            //开启验证
            domain.addValidator();
            layer.open({
                type: 1,
                title: '添加域',
                offset: '100px',
                area: '600px',
                resize: false,
                content: $('#add_Domain')
            })
            //表单提交
            $('#domainForm').on('success.form.bv', function () {
                var domain = {};
                domain.name = $('input[name="domainName"]').val();
                domain.parentCode = $('input[name="parentDoaminCode"]').val();
                domain.orderNo = $('input[name="orderNo"]').val();
                domain.description = $('textarea[name="domainRemark"]').val();
                domainService.addDomain(domain, function (data) {
                    if (data.result) {
                        layer.msg('添加域成功');
                        domainTree.getTree();
                        domainTree.init();
                        //向表格中添加
                        domain.code=data.data
                        $('#area_table').bootstrapTable('append',domain);
                        layer.closeAll();
                        //清空表单
                        $('input[name="parentDoamin"]').val('无');
                        $('input[name="parentDoaminCode"]').val('-1');
                        $("input[name='res']").click();
                        //清空验证
                        $("#domainForm").data('bootstrapValidator').destroy();
                    } else {
                        layer.msg(data.description)
                    }
                })
                return false;
            })
        })
        //添加组织
        var org = {};
        org.validator = function () {
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
                    }, orderNo: {
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
        $('#addOrg').click(function () {
            if (!domainTree.isNodeSelected) {
                layer.msg('请选择管理域')
            }else{
                org.validator();
                $('input[name="domainName"]').val(domainTree.nodeSelected.text);
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
                    var areaCode = domainTree.nodeSelected.code;
                    var org = {};
                    org.name = $('input[name="orgName"]').val();
                    org.description = $('textarea[name="orgRemark"]').val();
                    org.parentCode = "-1";
                    org.orderNo = $('input[name="orgOrderNo"]').val();
                    orgService.addOrg(org,areaCode, function (data) {
                        if (data.result) {
                            layer.msg('添加组织成功')
                        }
                    })
                    return false;
                })
            }
        })
    })