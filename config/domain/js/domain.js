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
        'bootstrapValidator': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapValidator"
        },
        'ztreeCheck': {
            deps: ['ztree', 'jquery']
        }
    },
    paths: {
        "jquery": '../../../common/lib/jquery/jquery-3.3.1.min',
        "bootstrap": "../../../common/lib/bootstrap/js/bootstrap.min",
        "common": "../../common/js/util",
        "layer": "../../../common/lib/layer/layer",
        "frame": "../../sidebar/js/wframe",
        "topBar": "../../../common/component/head/js/topbar",
        "bootstrapValidator": "../../../common/lib/bootstrap/libs/bootstrap-validator/js/bootstrapValidator.min",
        "bootstrap-table": "../../../common/lib/bootstrap/libs/BootstrapTable/bootstrap-table",
        "bootstrap-table-zh-CN": "../../../common/lib/bootstrap/libs/bootstrapTable/locale/bootstrap-table-zh-CN.min",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",
        "domainService": "../../../common/js/service/DomainController",
        "orgService": "../../../common/js/service/OrgController",
        "ztree": "../../../common/lib/ztree/js/jquery.ztree.core",
        "ztreeCheck": "../../../common/lib/ztree/js/jquery.ztree.excheck"
    }
});
require(['jquery', 'common', 'layer', 'frame', 'bootstrapValidator', 'bootstrap-table', 'bootstrap-table-zh-CN', 'bootstrap', 'topBar', 'domainService', 'orgService', 'ztree', 'ztreeCheck'],
    function (jquery, common, layer, frame, bootstrapValidator, bootstrapTable, bootstrapTableZhcN, bootstrap, topBar, domainService, orgService, ztree, ztreeCheck) {
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
        domainTree.setting = {
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
                    if (treeNode.type && treeNode.type === 'org') {
                        domainTree.selOrg = treeNode;
                        if (domainTree.selDomain) {
                            domainTree.selDomain = null;
                        }
                        $('#alertOrg').show();
                        $('#alertDomain').hide();
                        $('input[name="orgCode"]').val(treeNode.code);
                        $('input[name="orgpCode"]').val(treeNode.parentCode);
                        $('input[name="orgName"]').val(treeNode.name);
                        $('input[name="orgPersion"]').val(treeNode.creatorId);
                        $('input[name="orgTime"]').val(treeNode.createTime);
                        $('textarea[name="orgRemark"]').val(treeNode.description);
                    } else {
                        domainTree.selDomain = treeNode;
                        if (domainTree.selOrg) {
                            domainTree.selOrg = null;
                        }
                        $('#alertDomain').show();
                        $('#alertOrg').hide();
                        $('input[name="dCode"]').val(treeNode.code);
                        $('input[name="pCode"]').val(treeNode.parentCode);
                        $('input[name="dName"]').val(treeNode.name);
                        $('input[name="dPersion"]').val(treeNode.creatorId);
                        $('input[name="dTime"]').val(treeNode.createTime);
                        $('textarea[name="dRemark"]').val(treeNode.description);
                    }
                },
                onExpand: function (event, treeId, treeNode) {
                    //清空当前父节点的子节点
                    domainTree.obj.removeChildNodes(treeNode);
                    //如果节点是组织，获取组织下的子组织
                    if (treeNode.type && treeNode.type === 'org') {
                        //获得组织下的子组织
                        orgService.getChildList(treeNode.code, function (data) {
                            if (data.result) {
                                if (data.dataSize > 0) {
                                    for (var i = 0; i < data.dataSize; i++) {
                                        data.data[i].isParent = true;
                                        data.data[i].icon = "../img/org.png";
                                        data.data[i].type = 'org';
                                        data.data[i].domainCode = treeNode.domainCode;
                                    }
                                    var newNodes = data.data;
                                    console.log(newNodes);
                                    //添加节点
                                    domainTree.obj.addNodes(treeNode, newNodes);
                                }
                            }
                        })
                    } else {
                        //判断域下是否有组织
                        domainService.getDomainOrg(treeNode.code, function (data) {
                            if (data.result) {
                                if (data.dataSize > 0) {
                                    for (var i = 0; i < data.dataSize; i++) {
                                        //根据组织code查找组织名称 TODO:修改
                                        orgService.getOrgByCode(data.data[i].orgCode, function (orgData) {
                                            if (orgData.result) {
                                                data.data[i].isParent = true;
                                                data.data[i].icon = "../img/org.png";
                                                data.data[i].name = orgData.data.name;
                                                data.data[i].parentCode = orgData.data.parentCode;
                                                data.data[i].createTime = orgData.data.createTime;
                                                data.data[i].creatorId = orgData.data.creatorId;
                                                data.data[i].description = orgData.data.description;
                                                data.data[i].type = 'org';
                                                data.data[i].code = data.data[i].orgCode;
                                            } else {
                                                layer.msg('获取组织节点失败');
                                            }
                                        })
                                    }
                                    var newNodes = data.data;
                                    //添加节点
                                    domainTree.obj.addNodes(treeNode, newNodes);
                                }
                            } else {
                                layer.msg('获得组织节点失败')
                            }
                        })
                        domainService.getChildList(treeNode.code, function (data) {
                            if (data.result) {
                                if (data.dataSize > 0) {
                                    for (var i = 0; i < data.dataSize; i++) {
                                        data.data[i].isParent = true;
                                        data.data[i].icon = "../img/domain.png";
                                    }
                                    var newNodes = data.data;
                                    //添加节点
                                    domainTree.obj.addNodes(treeNode, newNodes);
                                }
                            } else {
                                layer.msg('获得子域节点失败')
                            }
                        })
                    }
                }
            }
        };
        domainTree.zNode = function () {
            var treeNode;
            domainService.getChildList('-1', function (data) {
                if (data.result) {
                    for (var i = 0; i < data.dataSize; i++) {
                        data.data[i].isParent = true;
                        data.data[i].icon = "../img/domain.png";
                    }
                    treeNode = data.data;
                }
            })
            return treeNode;
        }
        domainTree.init = function () {
            domainTree.obj = $.fn.zTree.init($("#domaintree"), domainTree.setting, domainTree.zNode());
        }
        domainTree.addNode=function(newNodes){
            if (domainTree.obj) {
                //获取当前选中的节点
                var selected = domainTree.obj.getSelectedNodes();
                if (selected.length > 0&&selected[0].open) {
                    //在节点下添加节点
                    domainTree.obj.addNodes(selected[0], newNodes);
                }
            }
        }
        //当修改域下组织时更新域下组织
        domainTree.updateNode = function (newNodes, row) {
            var domainObj = domainTree.obj.getNodesByParam("code", row.code, null);
            //查找这个节点下的组织
            var orgNodes = domainTree.obj.getNodesByParam("type", "org", domainObj[0]);
            if(domainObj.length>0&&domainObj[0].open){
                console.log(domainObj)
                //获得这个域下的组织并删除
                if (orgNodes.length > 0) {
                    for (var i = 0; i < orgNodes.length; i++) {
                        if (orgNodes[i].domainCode === row.code) {
                            //删除这个节点
                            domainTree.obj.removeNode(orgNodes[i]);
                        }
                    }
                }
                //更新这个域下的组织
                domainTree.obj.addNodes(domainObj[0], newNodes);
            }
        }
        //更新域节点
        domainTree.altNode = function (newNode) {
            if (domainTree.obj) {
                var node = domainTree.obj.getNodeByParam('code',newNode.code);
                if (node) {
                    node.name = newNode.name;
                    node.description = newNode.description;
                    domainTree.obj.updateNode(node);
                }
            }
        }
        //删除节点
        domainTree.deleteNode=function(code){
            var node=domainTree.obj.getNodeByParam('code',code,null);
            if(node){
                domainTree.obj.removeNode(node);
            }
        }
        domainTree.init();
        /********************************* 管理域表格 ***************************************/
        var domainTable = {};
        domainTable.init = function () {
            var queryUrl = common.host + "/auth" + "/domain" + "/list";
            $('#domain_table').bootstrapTable({
                columns: [{
                    checkbox: true
                }, {
                    field: 'name',
                    title: '管理域名称',
                    align: 'center'
                }, {
                    field: 'code',
                    visible: false

                }, {
                    field: 'parentCode',
                    visible: false
                }, {
                    field: 'createTime',
                    visible: false
                }, {
                    field: 'creatorId',
                    visible: false
                }, {
                    field: 'description',
                    title: '备注',
                    align: 'center'
                }, {
                    title: '分配组织',
                    align: 'center',
                    events: {
                        "click #assign": function (e, value, row, index) {
                            assignOrg.init(row);
                        }
                    },
                    formatter: function () {
                        var icons = "<div class='button-group'>" +
                            "<button id='assign' type='button' class='button button-tiny button-highlight'>" +
                            "<i class='fa fa-edit'></i>分配</button>"
                        return icons;
                    }
                }, {
                    title: '操作',
                    align: 'center',
                    events: {
                        "click #edit": function (e, value, row, index) {
                            domainEdit.init(row,index);
                        },
                        "click #del": function (e, value, row, index) {
                            del.init(row)
                        }
                    },
                    formatter: function () {
                        var icons = "<div class='button-group'>" +
                            "<button id='edit' type='button' class='button button-tiny button-highlight'>" +
                            "<i class='fa fa-edit'></i>修改</button>" +
                            "<button id='del' type='button' class='button button-tiny button-caution'><i class='fa fa-remove'></i>刪除</button>" +
                            "</div>"
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
                search: true,
                trimOnSearch: true,
                buttonsAlign: 'left',
                showRefresh: true,
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
                        pageSize: params.pageSize,
                        domainName: params.searchText
                    }
                    return temp
                }
            })
        }
        domainTable.init();
        //初始化表格高度
        $('#domain_table').bootstrapTable('resetView', {height: $(window).height() - 135});
        //自适应表格高度
        common.resizeTableH('#domain_table');
        /********************************* 修改管理域 ***************************************/
        var domainEdit = {};
        domainEdit.valia = function () {
            $('#altDomainForm').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    eDomainName: {
                        validators: {
                            notEmpty: {
                                message: '域名称不能为空'
                            }
                        }
                    }
                }
            })
        }
        domainEdit.submit = function (row,index) {
            $('#altDomainForm').on('success.form.bv',function () {
                var domain = {};
                domain.code=row.code;
                domain.name = $('input[name="eDomainName"]').val();
                domain.description = $('textarea[name="eDomainRemark"]').val();
                domainService.updateDomain(domain.code, domain, function (data) {
                    if (data.result) {
                        //清空表格和验证
                        common.clearForm('altDomainForm');
                        //更新表格
                        $('#domain_table').bootstrapTable('updateCell', {index: index, field:"name", value: domain.name});
                        $('#domain_table').bootstrapTable('updateCell', {
                            index: index,
                            field: 'description',
                            value: domain.description
                        });
                        //更新树节点
                        domainTree.altNode(domain);
                        //关闭弹窗
                        layer.closeAll();
                        layer.msg('修改管理域成功')
                    } else {
                        layer.msg('修改管理域失败');
                    }
                })
                return false;
            })
        }
        domainEdit.init=function(row,index){
            //表单验证
            domainEdit.valia();
            $('input[name="eDomainName"]').val(row.name);
            $('textarea[name="eDomainRemark"]').val(row.description);
            layer.open({
                type: 1,
                title: '修改管理域',
                offset: '100px',
                area: '600px',
                resize: false,
                content: $('#alt_Domain'),
                cancel: function (index, layero) {
                    common.clearForm('altDomainForm');
                }
            })
            //关闭弹窗
            $('.btn-cancel').click(function () {
                layer.closeAll();
                common.clearForm('altDomainForm');
            })
            //表单提交
            domainEdit.submit(row,index);
        }
        /********************************* 添加管理域 ***************************************/
        var domainAdd = {};
        domainAdd.valia = function () {
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
                    }
                }
            })
        }
        domainAdd.submit = function () {
            $('#domainForm').on('success.form.bv', function () {
                var domain = {};
                domain.name = $('input[name="domainName"]').val();
                domain.parentCode = $('input[name="parentDoaminCode"]').val();
                domain.remark = $('textarea[name="domainRemark"]').val();
                domainService.addDomain(domain, function (data) {
                    if (data.result) {
                        //清空表单和验证
                        common.clearForm('domainForm');
                        //在树节点中添加节点
                        domain.code = data.data;
                        domain.icon = "../img/domain.png";
                        domainTree.addNode(domain);
                        //刷新表格
                        $('#domain_table').bootstrapTable('refresh', {silent: true});
                        //关闭弹窗
                        layer.closeAll();
                        layer.msg('添加成功')
                    } else {
                        layer.msg(data.description);
                    }
                })
                return false;
            })
        }
        domainAdd.init = function () {
            $('#addDomain').click(function () {
                if (domainTree.selDomain) {
                    $('input[name="parentDoamin"]').val(domainTree.selDomain.name);
                    $('input[name="parentDoaminCode"]').val(domainTree.selDomain.code);
                    //表单验证
                    domainAdd.valia();
                    layer.open({
                        type: 1,
                        title: '添加管理域',
                        skin: 'layui-layer-lan',
                        offset: '100px',
                        area: '600px',
                        resize: false,
                        content: $('#add_Domain'),
                        cancel: function (index, layero) {
                            common.clearForm('domainForm');
                        }
                    })
                    //关闭弹窗
                    $('.btn-cancel').click(function () {
                        layer.closeAll();
                        common.clearForm('domainForm');
                    })
                    //表单提交
                    domainAdd.submit();
                } else {
                    layer.msg('请选择上级管理域')
                }
            })
        }
        domainAdd.init();
        /********************************* 初始化区域树 ***************************************/
        var areaTree = {};
        areaTree.setting = {
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
                    $('input[name="areaCode"]').val(treeNode.code);
                    layer.close(areaLayer)
                },
                onExpand: function (event, treeId, treeNode) {
                    orgService.getChildArea(treeNode.code, function (data) {
                        if (data.result) {
                            for (var i = 0; i < data.dataSize; i++) {
                                data.data[i].isParent = true;
                            }
                            var newNodes = data.data;
                            //添加节点
                            treeObj.addNodes(treeNode, newNodes);
                        }
                    })
                }
            }
        }
        orgService.getChildArea('000000', function (data) {
            if (data.result) {
                for (var i = 0; i < data.dataSize; i++) {
                    data.data[i].isParent = true;
                }
                areaTree.treeNode = data.data;
            } else {
                layer.msg(data.description);
            }
        })
        //选择区域
        var areaLayer;
        $('#choseArea').click(function () {
            areaLayer = layer.open({
                type: 1,
                title: '区域编码树',
                skin: 'layui-layer-rim',
                offset: '100px',
                area: ['300px', '450px'],
                resize: false,
                content: $('#areatree')
            })
        })
        var treeObj = $.fn.zTree.init($("#areatree"), areaTree.setting, areaTree.treeNode);
        /********************************* 刪除管理域 ***************************************/
        var del = {};
        del.init = function (row) {
            //删除管理域操作
            layer.confirm('确定删除 ' + row.name + ' ?', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                domainService.deleteDomainByCode(row.code, function (data) {
                    if (data.result) {
                        //更新表格
                        $('#domain_table').bootstrapTable('remove', {
                            field: 'code',
                            values: [row.code]
                        })
                        //更新树
                        domainTree.deleteNode(row.code);
                        layer.closeAll();
                        layer.msg('删除管理域成功');
                    } else {
                        layer.msg(data.description);
                    }
                })
            }, function () {
                layer.closeAll();
            });
        }
        /********************************* 为管理域分配组织 ***************************************/
        var assignOrg = {};
        assignOrg.submit = function (row) {
            //解決多次初始化弹窗
            $('#assignOrgSub').unbind('click');
            $('#assignOrgSub').click(function () {
                //获得选中节点
                var treeObj = $.fn.zTree.getZTreeObj("orgTree");
                var nodes = treeObj.getCheckedNodes(true);
                if (nodes.length > 0) {
                    var orgCodes = new Array();
                    for (var i = 0; i < nodes.length; i++) {
                        nodes[i].type = 'org';
                        orgCodes.push(nodes[i].code);
                    }
                    domainService.reassignOrgToDomain(row.code, orgCodes, function (data) {
                        if (data.result) {
                            //更新树
                            domainTree.updateNode(nodes, row);
                            layer.closeAll();
                            layer.msg('分配组织成功!')
                        } else {
                            layer.msg('分配组织失败!');
                        }

                    })
                }
            })
        }
        assignOrg.init = function (row) {
            //获得组织树
            assignOrg.orgTree(row);
            layer.open({
                type: 1,
                title: '分配组织',
                skin: 'layui-layer-lan',
                offset: '100px',
                area: '600px',
                resize: false,
                content: $('#assign_org')
            })
            assignOrg.submit(row);
        }
        assignOrg.orgTree = function (row) {
            var domainOrg;
            //查询管理域下拥有的组织
            domainService.getDomainOrg(row.code, function (data) {
                if (data.result) {
                    domainOrg = data.data;
                } else {
                    layer.msg('获取组织节点失败 请稍后重试');
                }
            })
            var setting = {
                treeId: 'orgTree',
                data: {
                    simpleData: {
                        enable: false,
                        idKey: "id",
                    },
                    key: {
                        name: "name"
                    }
                },
                check: {
                    enable: true,
                    chkStyle: "checkbox",
                    chkboxType: {"Y": "s", "N": "s"}
                },
                callback: {
                    onExpand: function (event, treeId, treeNode) {
                        var orgTree = $.fn.zTree.getZTreeObj("orgTree");
                        //清空当前父节点的子节点
                        orgTree.removeChildNodes(treeNode);
                        orgService.getChildList(treeNode.code, function (data) {
                            if (data.result) {
                                if (data.result) {
                                    for (var i = 0; i < data.dataSize; i++) {
                                        data.data[i].isParent = true;
                                        data.data[i].icon = "../img/org.png";
                                        //判断当前域是否拥有此组织
                                        if (domainOrg && domainOrg.length > 0) {
                                            for (var j = 0; j < domainOrg.length; j++) {
                                                if (domainOrg[j].orgCode === data.data[i].code) {
                                                    data.data[i].checked = true;
                                                } else {
                                                    data.data[i].checked = false;
                                                }
                                            }
                                        }
                                    }
                                    var newNodes = data.data;
                                    //添加节点
                                    orgTree.addNodes(treeNode, newNodes);
                                } else {
                                    layer.msg('加载组织树失败');
                                }
                            }
                        })
                    }
                }
            }
            var zNodes;
            //查询所有组织
            orgService.getChildList('-1', function (data) {
                if (data.result) {
                    if (data.dataSize > 0) {
                        for (var i = 0; i < data.dataSize; i++) {
                            data.data[i].isParent = true;
                            data.data[i].icon = "../img/org.png";
                            //判断当前域是否拥有此组织
                            if (domainOrg && domainOrg.length > 0) {
                                for (var j = 0; j < domainOrg.length; j++) {
                                    if (domainOrg[j].orgCode === data.data[i].code) {
                                        data.data[i].checked = true;
                                    } else {
                                        data.data[i].checked = false;
                                    }
                                }
                            }
                        }
                        zNodes = data.data;
                    } else {
                        layer.msg('您还没有添加组织');
                    }
                } else {
                    layer.msg('获取组织节点失败');
                }
            })
            $.fn.zTree.init($("#orgTree"), setting, zNodes);
        }
    })