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
        'bootstrap-switch': {
            deps: ['jquery'],
            exports: "bootstrapSwitch"
        },
        'bootstrap-treeview': {
            deps: ['jquery'],
            exports: "treeview"
        },
        'bootstrapValidator': {
            deps: ['bootstrap', 'jquery'],
            exports: "bootstrapValidator"
        },
        'ztree':{
            deps: ['jquery'],
            exports: "ztree"
        },
        'draw':{
            deps: ['leaflet'],
            exports: "draw"
        },
        'layx': {
            exports: 'layx'
        },
    },
    paths: {
        "jquery": '../../../common/lib/jquery/jquery-3.3.1.min',
        "bootstrap": "../../../common/lib/bootstrap/js/bootstrap",
        "common": "../../common/js/util",
        "layer": "../../../common/lib/layer/layer",
        "frame": "../../sidebar/js/wframe",
        "topBar":"../../../common/component/head/js/topbar",
        "bootstrap-treeview": "../../../common/lib/bootstrap/libs/bootstrap-treeview/js/bootstrap-treeview",
        "bootstrapValidator": "../../../common/lib/bootstrap/libs/bootstrap-validator/js/bootstrapValidator.min",
        "bootstrap-table": "../../../common/lib/bootstrap/libs/BootstrapTable/bootstrap-table",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",


        //本页使用
        "leaflet":"../../../common/lib/leaflet/leaflet-src",
        "ztree": "../../../common/lib/ztree/js/jquery.ztree.all",
        "draw": "../../../common/lib/leaflet/lib/draw/Leaflet.Draw",
        "layx": "../../../common/lib/layx/layx",
        "table":"table"

    }
});
require(['jquery','common','bootstrap','bootstrap-table', 'frame','bootstrapValidator','bootstrap-treeview','topBar','leaflet','ztree', 'draw', 'layx'],
function ($,common,bootstrap,bootstrapTable,  frame, bootstrapValidator,treeview,topBar,leaflet,ztree,draw,layx) {
    //初始化frame
    $('#sidebar').html(frame.htm);
    frame.init();
    //初始化头部
    $('#head').html(topBar.htm);
    topBar.init();
    //后台地址
    var end = common.end;
    var host = common.host;
    /**
     * start 4.弹出层
     */
    //4.1普通弹出层
    $("#layer-form").on("click",function () {
        layer.open({
            type: 1,
            title: '弹出层带表单',
            offset: '100px',
            skin: 'layui-layer-lan',
            area: '600px',
            resize: false,
            content: $('#layer-win')
        });
    });

    //4.2.1询问弹出层1
    $("#layer-msg").on("click",function () {
        layer.msg('是否确定删除？', {
            time: 20000, //20s后自动关闭
            btn: ['确定', '取消'],
            btn1: function(index, layero){
                console.log('成功！');
                layer.closeAll();
            },
            btn2: function(index, layero){
                console.log('失败！');
                layer.closeAll();
            },
        });
    });

    //4.2.2询问弹出层2
    $("#layer-confirm").on("click",function () {
        layer.confirm('是否确定删除？', {
            btn: ['确定','取消'] //按钮
        }, function(){
            layer.msg('确定删除！');
        }, function(){
            layer.msg('取消删除！');
        });
    });

    //4.3提示弹出层
    $("#layer-info").on("click",function () {
        layer.msg("添加成功！")
    });

    $("#layx-win").on("click",function () {
        var name = '设备';
        var id = '112';
        layx.group('group-nomerge',[
            {
                id:'group1',
                title:'文本窗口',
                content:'Layx 下一代Web弹窗组件.'
            },
            {
                id:'group2',
                title:'网页窗口',
                content: '<div class="layx-div"><h3>设备信息</h3>\n' +
                '        <div class="input-group">\n' +
                '            <span class="input-group-addon">设备名称</span>\n' +
                '            <input id="device-info-name" type="text" class="form-control t2" value=" ' +name+ ' " name="device-name" readonly>\n' +
                '            <input id="device-info-name" type="text" class="hidden deviceId" value=" ' +id+ ' " name="device-id" readonly>\n' +
                '        </div>\n' +
                '        <br>\n' +
                '        <div class="input-group">\n' +
                '            <span class="input-group-addon">按钮</span>\n' +
                '            <button id="showVideo" class="form-control" type="button">按钮</button>\n' +
                '        </div> ' +
                '</div>',
            },
            {
                id:'taobao',
                title:'百度官网',
                type:'url',
                url:'https://www.baidu.com'
            }
        ],1,{
            mergeTitle:false,
            title:'标题'
        });
    });

    /**
     * end 4.弹出层
     */

    /**
     * start 5.a标签
     */
    $("#a-button").on("click",function () {
       layer.msg('添加成功！');
    });
    /**
     * end 5.a标签
     */


    /**
     * start 8.表格
     */
    //8.表格相关
    $('#bt-table').bootstrapTable({
        method: 'GET',
        dataField: "data",
        url: host+"/event-linkage/resource/list",
        contentType: "application/x-www-form-urlencoded",
        pageNumber: 1, //初始化加载第一页，默认第一页
        pagination: true,//是否分页
        queryParams: queryParams,//请求服务器时所传的参数
        sidePagination: 'server',//指定服务器端分页
        pageSize: 3,//单页记录数
        pageList: [1,3,5],//分页步进值
        responseHandler: responseHandler,//请求数据成功后，渲染表格前的方法
        columns: [{
            field: 'name',
            title: '要素名称',
            align: 'center'
        }, {
            title:"code",
            field: 'code',
            //visible: false
        }, {
            title:"类型名称",
            field: 'typeName',
            //visible: false
        }, {
            title:"类型代码",
            field: 'typeCode',
            //visible: false
        }, {
            title:"id",
            field: 'id',
            //visible: false
        },{
            field: 'flag',
            title: '关联情况',
            visible: false
        },{
            title: '操作',
            align: 'center',
            events: {
                "click #relation_role": function (e, value, row, index) {
                    console.log(row);
                }
            },
            formatter: function () {
                var icons = "" +
                    "<div class='btn-group-sm'>" +
                    "<button id='show_role' class='btn btn-danger btn-sm'>查看</button>" +
                    "<button id='relation_role' class='btn btn-primary btn-sm'>关联</button>" +
                    "</div>"
                return icons;
            }
        }],
    });

    //请求服务数据时所传参数
    function queryParams(params) {
        var p = {
            pageSize: params.limit, //每一页的数据行数，默认是上面设置的10(pageSize)
            pageNo: params.offset / params.limit + 1, //当前页面,默认是上面设置的1(pageNumber)
            //resTypeCode:resTypeCode
        };
        return p;
    }

    //请求成功方法，请求成功后将异步回调的数据进行处理，设置成bootstrap table能用的数据
    function responseHandler(result) {
        return {
            total: result.extra, //总页数,前面的key必须为"total"
            data: result.data //行数据，前面的key要与之前设置的dataField的值一致.
        };
    };
    /**
     * end 8.表格
     */


    /**
     * start 10.树
     */
    //10.树结构的加载
    var setting = {
        view: {
            showIcon: showIconForTree
        },
        async: {
            enable: true,
            url: host + "/event-linkage/resource/type/list",
            autoParam: ["code=parentTypeCode"],//异步加载时需要自动提交父节点属性的参数，提交parentTypeCode为当前节点的code值
            type: "get",
            dataFilter: filter //用来将ajax异步返回的json数据处理成为ztree能用的json数据
        },
        data: {},
        callback: {
            onClick: onClick
        }
    };

    //icon图标设置
    function showIconForTree(treeId, treeNode) {
        return !treeNode.isParent;
    };

    //过滤器函数
    function filter(treeId, parentNode, responseData) {
        var d = []; //构造数组，用于存在改造后的数据，并且返回
        for (var i = 0; i < responseData.dataSize; i++) {
            var temp = responseData.data[i];
            //加isParent主要是为了使得数组可以下拉打开查询
            //如果此节点下有节点，那么会加载相应的节点，如果没有，则不会添加相应的节点
            temp.isParent = 'true';
            d[i] = temp
        }
        return d;
    };

    function onClick(event, treeId, treeNode) {
        console.log(event,treeId,treeNode);
    };

    //默认初始加载，把第一个加点先加载出来
    $.ajax({
        url: host + '/event-linkage/resource/type/list',
        type: 'get',
        data: {
            parentTypeCode: 'resType'
        },
        dataType: 'json',
        success: function (data) {
            var d = data.data[0];
            d.isParent = 'true';
            $.fn.zTree.init($("#treeDemo"), setting, data.data[0]);
        }
    });
    /**
     * end 10.树
     */








});