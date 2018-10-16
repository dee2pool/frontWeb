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
        }
    },
    paths: {
        "jquery": '../../common/libs/jquery/jquery-1.11.3.min',
        "bootstrap": "../../common/libs/bootstrap/js/bootstrap.min",
        "common": "../../common/js/util",
        "layer": "../../common/libs/layer/layer",
        "frame": "../../sidebar/js/wframe",
        "topBar": "../../../common/component/head/js/topbar",
        "bootstrap-table": "../../common/libs/bootstrap/js/bootstrap-table",
        "bootstrap-treeview": "../../common/libs/bootstrap-treeview/js/bootstrap-treeview",
        "bootstrapValidator": "../../common/libs/bootstrap-validator/js/bootstrapValidator.min",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../common/js/service/MenuController",
        "departMentService": "../../../common/js/service/DepartmentController",
        "bootstrap-datetimepicker": "../../common/libs/bootstrap-datetimepicker/js/bootstrap-datetimepicker",
        "bootstrap-datetimepicker.zh-CN": "../../common/libs/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN",
        "personService":"../../../common/js/service/PersonnelController"
    }
});
require(['jquery', 'common', 'frame', 'bootstrap-table', 'bootstrap', 'bootstrap-treeview', 'bootstrapValidator', 'bootstrap-datetimepicker', 'bootstrap-datetimepicker.zh-CN', 'topBar', 'departMentService','personService'],
    function (jquery, common, frame, bootstrapTable, bootstrap, treeview, bootstrapValidator, datetimepicker, datetimepickerzhCN, topBar, departMentService,personService) {
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
        /********************************* 添加人员 ***************************************/
        //向下拉框中添加部门
        departMentService.listAll(function (data) {
            if(data.result){
                for(var i=0;i<data.data.length;i++){
                    $('select[name="pDept"]').append('<option value="'+data.data[i].id+'">'+data.data[i].name+'</option>');
                }
            }
        })
        //选择文件
        $('#uploadImg').click(function () {
            $('input[type="file"]').click();
        })
        $('input[type="file"]').change(function (e) {
            console.log(e.target.files[0])
            common.convertImageToBase64(e.target.files[0])
        })
        //日历控件
        $('.form_datetime').datetimepicker({
            language: 'zh-CN',
            format: 'yyyy-mm-dd',
            minView: 'month',
            autoclose: 1,
            startView: 2,
            forceParse: 0,
            endDate:new Date(),
            pickerPosition: 'bottom-left'
        });
        var perAdd={};
        perAdd.valia=function(){
            $('#personForm').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    pNo: {
                        validators: {
                            notEmpty: {
                                message: '人员编号不能为空'
                            }
                        }
                    }, pName: {
                        validators: {
                            notEmpty: {
                                message: '人员姓名不能为空'
                            }
                        }
                    }
                }
            })
        }
        perAdd.submit=function(){
            $('#personForm').on('success.form.bv',function () {
                var person={};
                person.personnelNum=$('input[name="pNo"]').val();
                person.name=$('input[name="pName"]').val();
                person.depId=$('select[name="pDept"]').val();
                person.sex=$('select[name="sex"]').val();
                if($('input[name="papersNumber"]').val()!=''){
                    person.cardType=$('select[name="cardType"]').val();
                    person.papersNumber=$('input[name="papersNumber"]').val();
                }
                if($('input[name="dataBirth"]').val()!=''){
                    person.dataBirth=new Date($('input[name="dataBirth"]').val()).valueOf();
                }
                if($('input[name="pinyinCode"]').val()!=''){
                    person.pinyinCode=$('input[name="pinyinCode"]').val();
                }
                if($('input[name="phone"]').val()!=''){
                    person.phone=$('input[name="phone"]').val();
                }
                if($('textarea[name="constactAddress"]').val()!=''){
                    person.constactAddress=$('textarea[name="constactAddress"]').val();
                }
                if($('input[name="englishName"]').val()!=''){
                    person.englishName=$('input[name="englishName"]').val();
                }
                if($('input[name="email"]').val()!=''){
                    person.email=$('input[name="email"]').val();
                }
                if($('input[name="takeofficeDate"]').val()!=''){
                    person.takeofficeDate=$('input[name="takeofficeDate"]').val();
                }
                if($('input[name="departureDate"]').val()!=''){
                    person.departureDate=$('input[name="departureDate"]').val();
                }
                person.diploma=$('select[name="diploma"]').val();
                if($('input[name="nation"]').val()!=''){
                    person.nation=$('input[name="nation"]').val();
                }
                if($('input[name="userName"]').val()!=''){
                    person.userName=$('input[name="userName"]').val();
                }
                if($('input[name="usePwd"]').val()!=''){
                    person.usePwd=$('input[name="usePwd"]').val();
                }
                if($('textarea[name="remark"]').val()!=''){
                    person.remark=$('textarea[name="remark"]').val();
                }
                if($('input[name="picture"]').val()!=''){
                    person.picture=$('input[name="picture"]').val();
                }
                personService.addPersonnel(person,function (data) {
                    if(data.result){
                        person.id=data.data;
                        $('#person_table').bootstrapTable('append',person);
                        layer.closeAll();
                        layer.msg('添加成功');
                        common.clearForm('personForm');
                    }
                })
                return false;
            })
        }
        perAdd.init=function(){
            $('#addPerson').click(function () {
                //清空表格
                $("input[name='res']").click();
                //启用验证
                perAdd.valia();
                layer.open({
                    type: 1,
                    title: '添加人员',
                    offset: '100px',
                    area: '650px',
                    resize: false,
                    zIndex: 1000,
                    content: $('.add_person')
                })
                //表单提交
                perAdd.submit();
            })
        }
        perAdd.init();
        //点击下一步
        $('.btn-next').click(function () {
            $('#per_tab a:last').tab('show')
        })
        /********************************* 修改人员 ***************************************/
        var perEdit={};
        perEdit.sub=function (row,index) {
            //表单验证
            perAdd.valia();
            var person={};
            person.personnelNum=$('input[name="pNo"]').val();
            person.name=$('input[name="pName"]').val();
            person.depId=$('select[name="pDept"]').val();
            person.sex=$('select[name="sex"]').val();
            if($('input[name="papersNumber"]').val()!=''){
                person.cardType=$('select[name="cardType"]').val();
                person.papersNumber=$('input[name="papersNumber"]').val();
            }
            if($('input[name="dataBirth"]').val()!=''){
                person.dataBirth=new Date($('input[name="dataBirth"]').val()).valueOf();
            }
            if($('input[name="pinyinCode"]').val()!=''){
                person.pinyinCode=$('input[name="pinyinCode"]').val();
            }
            if($('input[name="phone"]').val()!=''){
                person.phone=$('input[name="phone"]').val();
            }
            if($('textarea[name="constactAddress"]').val()!=''){
                person.constactAddress=$('textarea[name="constactAddress"]').val();
            }
            if($('input[name="englishName"]').val()!=''){
                person.englishName=$('input[name="englishName"]').val();
            }
            if($('input[name="email"]').val()!=''){
                person.email=$('input[name="email"]').val();
            }
            if($('input[name="takeofficeDate"]').val()!=''){
                person.takeofficeDate=$('input[name="takeofficeDate"]').val();
            }
            if($('input[name="departureDate"]').val()!=''){
                person.departureDate=$('input[name="departureDate"]').val();
            }
            person.diploma=$('select[name="diploma"]').val();
            if($('input[name="nation"]').val()!=''){
                person.nation=$('input[name="nation"]').val();
            }
            if($('input[name="userName"]').val()!=''){
                person.userName=$('input[name="userName"]').val();
            }
            if($('input[name="usePwd"]').val()!=''){
                person.usePwd=$('input[name="usePwd"]').val();
            }
            if($('textarea[name="remark"]').val()!=''){
                person.remark=$('textarea[name="remark"]').val();
            }
            if($('input[name="picture"]').val()!=''){
                person.picture=$('input[name="picture"]').val();
            }
            personService.updatePersonnelById(row.id,person,function (data) {
                if(data.result){

                }
            })
        }
        perEdit.init=function (row,index) {
            $('input[name="pNo"]').val(row.personnelNum)
            $('input[name="pName"]').val(row.name)
            $('input[name="pDept"]').val(row.depId)
            $('input[name="sex"]').val(row.sex)
            $('input[name="cardType"]').val(row.cardType)
            $('input[name="papersNumber"]').val(row.papersNumber)
            $('input[name="dataBirth"]').val(row.dataBirth)
            $('input[name="pinyinCode"]').val(row.pinyinCode)
            $('input[name="phone"]').val(row.phone)
            $('input[name="constactAddress"]').val(row.constactAddress)
            $('input[name="picture"]').val(row.picture)
            $('input[name="englishName"]').val(row.englishName)
            $('input[name="takeofficeDate"]').val(row.takeofficeDate)
            $('input[name="departureDate"]').val(row.departureDate)
            $('input[name="diploma"]').val(row.diploma)
            $('input[name="nation"]').val(row.nation)
            $('input[name="userName"]').val(row.userName)
            $('input[name="remark"]').val(row.remark)
            layer.open({
                type: 1,
                title: '修改人员',
                offset: '100px',
                area: '650px',
                resize: false,
                zIndex: 1000,
                content: $('.add_person')
            })

        }
        /********************************* 删除人员 ***************************************/
        var perDel={};
        perDel.init = function (row) {
            layer.confirm('确定删除 ' + row.name + ' ?', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                personService.deletePersonnelByIds(row.id, function (data) {
                    if (data.result) {
                        $('#person_table').bootstrapTable('remove', {
                            field: 'id',
                            values: [row.id]
                        })
                        layer.closeAll();
                    } else {
                        layer.msg(data.description)
                    }
                })
                //删除操作
            }, function () {
                layer.closeAll();
            });
        }
        /********************************* 人员表格 ***************************************/
        var personTable={};
        personTable.pageNo=1;
        personTable.pageSize=10;
        /*personTable.name="";
        personTable.phone="";
        personTable.personnelNum="";
        personTable.depName="";*/
        personTable.init=function(){
            personService.getPersonnerlList(personTable.pageNo,personTable.pageSize,null,
                null,null,null,function (data) {
                    if(data.result){
                        $('#person_table').bootstrapTable({
                            columns: [{
                                checkbox: true
                            }, {
                                field: 'id',
                                visible:false
                            }, {
                                title: '序号',
                                align: "center",
                                formatter: function (value, row, index) {
                                    return index+1;
                                }
                            }, {
                                field: 'personnelNum',
                                title: '人员编号',
                                align: "center"
                            }, {
                                field: 'name',
                                title: '姓名',
                                align: "center"
                            }, {
                                field: 'sex',
                                title: '性别',
                                align: "center",
                                formatter:function (value) {
                                    if(value=='0'){
                                        return '男'
                                    }else {
                                        return '女'
                                    }
                                }
                            }, {
                                field: 'depName',
                                title: '所属部门',
                                align: "center"
                            }, {
                                field: 'cardType',
                                title: '证件类型',
                                align: "center",
                                formatter:function (value) {
                                    if(value=='0'){
                                        return '身份证'
                                    }else{
                                        return '员工证'
                                    }
                                }
                            }, {
                                field: 'papersNumber',
                                title: '证件号',
                                align: "center"
                            }/*, {
                                field: 'dataBirth',
                                title: '出生日期',
                                align: "center"
                            }*/, {
                                field: 'phone',
                                title: '联系电话',
                                align: "center"
                            }, {
                                field: 'constactAddress',
                                title: '联系地址',
                                align: "center"
                            }, {
                                field: 'email',
                                title: '邮箱',
                                align: "center"
                            }, {
                                field: 'takeofficeDate',
                                title: '到职日期',
                                align: "center"
                            }, {
                                field: 'departureDate',
                                title: '离职日期',
                                align: "center"
                            }, {
                                field: 'remark',
                                title: '备注',
                                align: "center"
                            }, {
                                title: '操作',
                                align: "center",
                                events: {
                                    "click #edit_role": function (e, value, row, index) {
                                        //点击编辑按钮
                                        perEdit.init(row,index);
                                    },
                                    "click #del_role": function (e, value, row, index) {
                                        //点击删除按钮
                                       perDel.init(row);
                                    }
                                },
                                formatter: function () {
                                    var icons = "<button type='button' id='edit_role' class='btn btn-default'><i class='fa fa-edit'></i></button>" +
                                        "<button type='button' id='del_role' class='btn btn-default'><i class='fa fa-remove'></i></button>"
                                    return icons;
                                }
                            }],
                            data:data.data
                        })
                        common.pageInit(personTable.pageNo,personTable.pageSize,data.extra)
                    }
                })
        }
        personTable.init();
        /********************************* 迁移人员 ***************************************/
        $('#movePerson').click(function () {
            var selecte = $('#person_table').bootstrapTable('getSelections');
            if (selecte.length == 0) {
                layer.msg("请选择要迁移的人员");
            } else {
                layer.open({
                    type: 1,
                    title: '迁移人员',
                    offset: '100px',
                    area: '600px',
                    resize: false,
                    content: $('.changeDept')
                })
                var pIds=new Array();
                for(var i=0;i<selecte.length;i++){
                    pIds.push(selecte[i].id)
                }
                $('#per_move').click(function () {
                    var depId=$('select[name="pDept"]').val();
                    personService.updateDepIdByPersonnelId(depId,pIds,function (data) {
                        if(data.result){
                            $('#person_table').bootstrapTable('updateCell',{index:common.getTableIndex("person_table"),field:'depId',value:depId})
                        }
                    })
                })
            }
        })
    })