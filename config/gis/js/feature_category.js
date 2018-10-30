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
        'layx': {
            exports: 'layx'
        },
        'colorpicker':{
            deps: ['jquery'],
            exports: "colorpicker"
        }
    },
    paths: {
        "jquery": '../../../common/lib/jquery/jquery-3.3.1.min',
        "bootstrap": "../../common/libs/bootstrap/js/bootstrap.min",
        "common": "../../common/js/util",
        "layer": "../../common/libs/layer/layer",
        "frame": "../../sidebar/js/wframe",
        "topBar":"../../../common/component/head/js/topbar",
        "bootstrap-table": "../../common/libs/bootstrap/js/bootstrap-table",
        "bootstrap-treeview": "../../common/libs/bootstrap-treeview/js/bootstrap-treeview",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",
        "bootstrap-switch": "../../common/libs/bootstrap-switch/js/bootstrap-switch",
        "bootstrapValidator": "../../common/libs/bootstrap-validator/js/bootstrapValidator.min",

        //本页使用的js
        "leaflet":"../../../common/lib/leaflet/leaflet-src",
        "ztree": "../../../common/lib/ztree/js/jquery.ztree.all",
        "layx": "../../../common/lib/layx/layx",
        "colorpicker":"../lib/colorpicker/jquery.colorpicker"

    }
});
require(['jquery', 'common','frame', 'bootstrap-table','bootstrapValidator','bootstrap', 'bootstrap-switch','bootstrap-treeview','topBar','leaflet','ztree','layx','colorpicker','layer'],
    function (jquery,common, frame, bootstrapTable,bootstrapValidator,bootstrap, bootstrapSwitch,treeview,topBar,leaflet,ztree,layx,colorpicker,layer) {
        //初始化frame
        $('#sidebar').html(frame.htm);
        frame.init();
        //初始化头部
        $('#head').html(topBar.htm);
        topBar.init();

        var end = common.end;


        /**
         * start 分类树
         */
        var setting_featureCate = {
            async: {
                enable: true,
                url: end + "/featureCategory/findByPid",
                //提交的参数
                autoParam: ["id=pid"],//异步加载时需要自动提交父节点属性的参数，提交parentTypeCode为当前节点的code值
                type: "get",
                dataFilter: ajaxchoosefeatureCateFilter //用来将ajax异步返回的json数据处理成为ztree能用的json数据
            },
            data: {},
            callback: {
                //点击查询事件
                onClick: onClick
            }
        };

        //处理返回的数据格式
        function ajaxchoosefeatureCateFilter(treeId, parentNode, responseData) {
            var d = []; //构造数组，用于存在改造后的数据，并且返回
            for (var i = 0; i < responseData.length; i++) {
                var temp = responseData[i];
                var t = {};
                t.id = temp.fcId;
                t.pid = temp.fcPid;
                t.name = temp.fcName;
                t.img = temp.fcIcon;
                t.isParent = true;
                d[i] = t;
            }
            return d;
        };

        /**
         * 删除节点
         * @param e
         */
        function remove(e) {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            if (treeNode && (treeNode.pId != '0' && treeNode.pid != 'fc')) {
                var id = treeNode.id;
                layer.confirm('确认删除选中分类？', {
                    btn: ['确定','取消'] //按钮
                }, function(){
                    featureCategory.delete(id,function () {
                        layer.msg('删除成功！');
                    });
                    var callbackFlag = $("#callbackTrigger").attr("checked");
                    zTree.removeNode(treeNode, callbackFlag);
                }, function(){
                    layer.closeAll();
                });
            }else{
                layer.msg('未选择点或当前点不可删除！');
            }
        };

        /**
         * 节点增加事件
         * @param e
         */
        var newCount = 1;
        function add(e) {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                isParent = e.data.isParent,
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            //既要保证选择了节点，也要保证选择的节点是点线面要素下的
            if(treeNode && (treeNode.pid != '0' && treeNode.id != 'fc')) {
                treeNode = zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, isParent:isParent, name:"新加要素分类"});
            }else{
                layer.msg('元素分类必须属于点线面要素中，请重新选择！');
                return;
            }
        };

        /**
         * 点击测试事件
         * @param e
         */
        function onClick(e){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            if (nodes.length == 0) {
                layer.msg("请先选择一个节点");
                return;
            };
            //显示状态的重置
            console.log(treeNode);
            featureCategory.clearAllInput();
            if(treeNode.img != undefined){
                var url = "../../../main/common/asset/img/upload/"+treeNode.img;
                $("#icon-preview").attr("src",url);
            };
            $("#name").css("display","block");
            $("#icon-preview").css("display","block");
            $("#category-name").val(treeNode.name);
            $("#e-category-name").val(treeNode.name);

        };

        /**
         * 编辑信息
         */
        function edit(){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            if (nodes.length == 0) {
                alert("请先选择一个节点");
                return;
            };

            if (treeNode && (treeNode.pId != '0' && treeNode.pid != 'fc')) {
                $("#name").css("display","none");
                $("#e-name").css("display","none");
                $("#e-icon").css("display","none");
                $("#icon-preview").css("display","none");
                $("#style").css("display","none");
                $("#feature-edit").css("display","none");

                $("#e-name").css("display","block");
                $("#e-icon").css("display","block");
                $("#icon-preview").css("display","block");
                //$("#style").css("display","block");
                $("#feature-edit").css("display","block");
                var id = treeNode.id;
                //如果id存在，执行更新方法，否则执行的是add方法
                featureCategory.exist(id,function (repo){
                    //大于0说明存在要素，那么执行更新方法，否则执行添加方法
                    if(repo.length>0){
                        var data = repo[0];
                        console.log(data);
                        $("#e-name").val(data.fcName);
                        $("#fcId").val(data.fcId);
                        var url = "../../../main/common/asset/img/upload/"+data.fcIcon;
                        $("#img-preview").attr("src",url);
                        $("#img-url").val(data.fcIcon);
                    }else{
                        $("#fcId").val("none");
                    }
                });
            } else {
                layer.msg('当前节点不可编辑，请重新选择！');
                return;
            }
        }
        /**
         * 要素点更新，更新和增加实质上应该是同一种方法
         */
        function update() {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            if (nodes.length == 0) {
                layer.msg("请先选择一个节点");
                return;
            };
            treeNode.name = $("#e-category-name").val();
            zTree.updateNode(treeNode);
        };
        function uploadImg(imgid) {
            var type = "file";          //后台接收时需要的参数名称，自定义即可
            var id = imgid;            //即input的id，用来寻找值
            var formData = new FormData();
            formData.append(type, $("#" + id)[0].files[0]);    //生成一对表单属性
            $.ajax({
                type: "POST",           //因为是传输文件，所以必须是post
                url: end + '/feature/upload',         //对应的后台处理类的地址
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    alert("上传成功");
                    var url = "../../../main/common/asset/img/upload/"+data;
                    $("#img-preview").attr("src",url);
                    $("#img-url").val(data);
                    console.log(data);
                }
            })
        };
        var featureCategory = {};
        featureCategory.add = function (data,onSuccess) {
            $.ajax({
                url: end + '/featureCategory/add',
                type: 'GET',
                contentType: "application/json",
                data: data,
                cache: false,
                success: onSuccess,
                error: function () {
                    alert("添加失败");
                }
            });
        };
        featureCategory.update = function (data,onSuccess) {
            $.ajax({
                url: end + '/featureCategory/update',
                type: 'GET',
                contentType: "application/json",
                data: data,
                cache: false,
                success: onSuccess,
                error: function () {
                    alert("添加失败");
                }
            });
        };
        featureCategory.exist = function (id,onSuccess) {
            var data={
                fcId:id
            };
            $.ajax({
                url: end + '/featureCategory/exist',
                type: 'GET',
                contentType: "application/json",
                data: data,
                cache: false,
                success: onSuccess,
                error: function () {
                    alert("添加失败");
                }
            });
        };
        featureCategory.delete = function (id,onSuccess) {
            $.ajax({
                url: end + '/featureCategory/delete',
                type: 'GET',
                contentType: "application/json",
                data: {
                    id:id,
                },
                cache: false,
                success: onSuccess,
                error: function () {
                    alert("添加失败");
                }
            });
        };

        featureCategory.clearAllInput = function () {
            $("#name").css("display","none");
            $("#e-name").css("display","none");
            $("#e-icon").css("display","none");
            $("#icon-preview").css("display","none");
            $("#style").css("display","none");
            $("#feature-edit").css("display","none");
            $("#feature-content input").val("");
            $("#img-preview").attr("src","");
        };


        $(document).ready(function(){
            var zNodes_chooseCategory = [
                {id: 'fc', pId: 0, name: "要素分类", open: true,isParent:true},
            ];
            $.fn.zTree.init($("#treeDemo"), setting_featureCate, zNodes_chooseCategory);

            //$.fn.zTree.init($("#treeDemo"), setting, zNodes);            //移除节点
            $("#remove").bind("click", remove);
            //编辑
            $("#edit").bind("click",edit);
            //增加
            $("#add").bind("click", {isParent:true}, add);
            initHeight();

            //添加和修改的方法
            $("#confirmUpdate").on("click",function () {
                var fcId = $("#fcId").val();
                var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                    nodes = zTree.getSelectedNodes(),
                    treeNode = nodes[0];
                if (nodes.length == 0) {
                    layer.msg("请先选择一个节点");
                    return;
                }else{};
                var type= null;
                if(treeNode.getPath()[1].name === '点要素'){
                    type = 'point';
                }else if(treeNode.getPath()[1].name === '线要素'){
                    type = 'polyline';
                }else{
                    type = 'polygon';
                }
                var pid = treeNode.getPath()[ treeNode.getPath().length-2].id;
                //none调用add，否则调用update
                if(fcId === 'none'){
                    var data = {
                        type:type,
                        name:$("#e-category-name").val(),
                        pid:pid,
                        icon:$("#img-url").val(),
                        style:""
                    };
                    featureCategory.add(data,function (repo) {
                        if(repo === 'success'){
                            layer.confirm('添加成功！', {
                                btn: ['确定'] //按钮
                            }, function(){
                                location.reload();
                            });
                        }
                    });
                }
                else{
                    var data = {
                        id:fcId,
                        type:type,
                        name:$("#e-category-name").val(),
                        pid:pid,
                        icon:$("#img-url").val(),
                        style:""
                    };
                    console.log(data);
                    featureCategory.update(data,function (repo) {
                        if(repo === 'success'){
                            layer.msg("修改成功");
                            location.reload();
                        }
                    });
                }


            });

            //图片上传
            $("#uploadImg").on("click",function () {
                var id = 'img'
                uploadImg(id);
            });
        });

        //通过获取class=content的高度，从而对class=tab中的内容进行高度赋值
        function initHeight() {
            var height = 'height:'+$(".content").height()+'px !important';
            $(".left").css('cssText',height);
            $(".right").css('cssText',height);
        }

    });