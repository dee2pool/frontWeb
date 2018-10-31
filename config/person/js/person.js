require.config({
    shim: {
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
        "jquery": '../../../common/lib/jquery/jquery-3.3.1.min',
        "bootstrap": "../../../common/lib/bootstrap/js/bootstrap.min",
        "common": "../../common/js/util",
        "layer": "../../../common/lib/layer/layer",
        "frame": "../../sidebar/js/wframe",
        "topBar": "../../../common/component/head/js/topbar",
        "bootstrap-table": "../../../common/lib/bootstrap/libs/BootstrapTable/bootstrap-table",
        "bootstrap-table-zh-CN": "../../../common/lib/bootstrap/libs/bootstrapTable/locale/bootstrap-table-zh-CN.min",
        "bootstrapValidator": "../../../common/lib/bootstrap/libs/bootstrap-validator/js/bootstrapValidator.min",
        "menu": "../../sidebar/js/menu",
        "MenuService": "../../../common/js/service/MenuController",
        "departMentService": "../../../common/js/service/DepartmentController",
        "bootstrap-datetimepicker": "../../../common/lib/bootstrap/libs/bootstrap-datetimepicker/js/bootstrap-datetimepicker",
        "bootstrap-datetimepicker.zh-CN": "../../../common/lib/bootstrap/libs/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN",
        "personService": "../../../common/js/service/PersonnelController"
    }
});
require(['jquery', 'common', 'frame', 'bootstrap-table', 'bootstrap-table-zh-CN', 'bootstrap', 'bootstrapValidator', 'bootstrap-datetimepicker', 'bootstrap-datetimepicker.zh-CN', 'topBar', 'departMentService', 'personService'],
    function (jquery, common, frame, bootstrapTable, bootstrapTableZhcN, bootstrap, bootstrapValidator, datetimepicker, datetimepickerzhCN, topBar, departMentService, personService) {
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
        /********************************* 添加人员 ***************************************/
        //向下拉框中添加部门
        departMentService.listAll(function (data) {
            if (data.result) {
                for (var i = 0; i < data.data.length; i++) {
                    $('select[name="pDept"]').append('<option value="' + data.data[i].id + '">' + data.data[i].name + '</option>');
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
            endDate: new Date(),
            pickerPosition: 'bottom-left'
        });
        var perAdd = {};
        perAdd.valia = function () {
            $('#personForm').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    pName: {
                        validators: {
                            notEmpty: {
                                message: '人员姓名不能为空'
                            }
                        }
                    }
                }
            })
        }
        perAdd.submit = function () {
            $('#personForm').on('success.form.bv', function () {
                var person = {};
                person.name = $('input[name="pName"]').val();
                person.depId = $('select[name="pDept"]').val();
                person.sex = $('select[name="sex"]').val();
                if ($('input[name="papersNumber"]').val() != '') {
                    person.cardType = $('select[name="cardType"]').val();
                    person.papersNumber = $('input[name="papersNumber"]').val();
                }
                if ($('input[name="dataBirth"]').val() != '') {
                    person.dataBirth = new Date($('input[name="dataBirth"]').val()).valueOf();
                }
                if ($('input[name="pinyinCode"]').val() != '') {
                    person.pinyinCode = $('input[name="pinyinCode"]').val();
                }
                if ($('input[name="phone"]').val() != '') {
                    person.phone = $('input[name="phone"]').val();
                }
                if ($('textarea[name="constactAddress"]').val() != '') {
                    person.constactAddress = $('textarea[name="constactAddress"]').val();
                }
                if ($('input[name="englishName"]').val() != '') {
                    person.englishName = $('input[name="englishName"]').val();
                }
                if ($('input[name="email"]').val() != '') {
                    person.email = $('input[name="email"]').val();
                }
                if ($('input[name="takeofficeDate"]').val() != '') {
                    person.takeofficeDate = $('input[name="takeofficeDate"]').val();
                }
                if ($('input[name="departureDate"]').val() != '') {
                    person.departureDate = $('input[name="departureDate"]').val();
                }
                person.diploma = $('select[name="diploma"]').val();
                if ($('input[name="nation"]').val() != '') {
                    person.nation = $('input[name="nation"]').val();
                }
                if ($('input[name="userName"]').val() != '') {
                    person.userName = $('input[name="userName"]').val();
                }
                if ($('input[name="usePwd"]').val() != '') {
                    person.usePwd = $('input[name="usePwd"]').val();
                }
                if ($('textarea[name="remark"]').val() != '') {
                    person.remark = $('textarea[name="remark"]').val();
                }
                if ($('input[name="picture"]').val() != '') {
                    person.picture = $('input[name="picture"]').val();
                }
                personService.addPersonnel(person, function (data) {
                    if (data.result) {
                        person.id = data.data;
                        $('#person_table').bootstrapTable('append', person);
                        layer.closeAll();
                        layer.msg('添加成功');
                        common.clearForm('personForm');
                    }
                })
                return false;
            })
        }
        perAdd.init = function () {
            $('#addPerson').click(function () {
                //清空表格
                $("input[name='res']").click();
                //启用验证
                perAdd.valia();
                layer.open({
                    type: 1,
                    title: '添加人员',
                    offset: '100px',
                    skin: 'layui-layer-lan',
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
        //TODO　需要修改
        var perEdit = {};
        perEdit.valia = function () {
            $('#personForm').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    pName: {
                        validators: {
                            notEmpty: {
                                message: '人员姓名不能为空'
                            }
                        }
                    }
                }
            })
        }
        perEdit.sub = function (row, index) {
            //表单验证
            perEdit.valia();
            var person = {};
            person.personnelNum = $('input[name="pNo"]').val();
            person.name = $('input[name="pName"]').val();
            person.depId = $('select[name="pDept"]').val();
            person.sex = $('select[name="sex"]').val();
            if ($('input[name="papersNumber"]').val() != '') {
                person.cardType = $('select[name="cardType"]').val();
                person.papersNumber = $('input[name="papersNumber"]').val();
            }
            if ($('input[name="dataBirth"]').val() != '') {
                person.dataBirth = new Date($('input[name="dataBirth"]').val()).valueOf();
            }
            if ($('input[name="pinyinCode"]').val() != '') {
                person.pinyinCode = $('input[name="pinyinCode"]').val();
            }
            if ($('input[name="phone"]').val() != '') {
                person.phone = $('input[name="phone"]').val();
            }
            if ($('textarea[name="constactAddress"]').val() != '') {
                person.constactAddress = $('textarea[name="constactAddress"]').val();
            }
            if ($('input[name="englishName"]').val() != '') {
                person.englishName = $('input[name="englishName"]').val();
            }
            if ($('input[name="email"]').val() != '') {
                person.email = $('input[name="email"]').val();
            }
            if ($('input[name="takeofficeDate"]').val() != '') {
                person.takeofficeDate = $('input[name="takeofficeDate"]').val();
            }
            if ($('input[name="departureDate"]').val() != '') {
                person.departureDate = $('input[name="departureDate"]').val();
            }
            person.diploma = $('select[name="diploma"]').val();
            if ($('input[name="nation"]').val() != '') {
                person.nation = $('input[name="nation"]').val();
            }
            if ($('input[name="userName"]').val() != '') {
                person.userName = $('input[name="userName"]').val();
            }
            if ($('input[name="usePwd"]').val() != '') {
                person.usePwd = $('input[name="usePwd"]').val();
            }
            if ($('textarea[name="remark"]').val() != '') {
                person.remark = $('textarea[name="remark"]').val();
            }
            if ($('input[name="picture"]').val() != '') {
                person.picture = $('input[name="picture"]').val();
            }
            personService.updatePersonnelById(row.id, person, function (data) {
                if (data.result) {

                }
            })
        }
        perEdit.init = function (row, index) {
            $('input[name="altPno"]').val(row.personnelNum)
            $('input[name="altPname"]').val(row.name)
            $('input[name="pDept"]').val(row.depId)
            $('input[name="altSex"]').val(row.sex)
            $('input[name="altCardType"]').val(row.cardType)
            $('input[name="altPapersNumber"]').val(row.papersNumber)
            $('input[name="altDataBirth"]').val(row.dataBirth)
            $('input[name="altPinyinCode"]').val(row.pinyinCode)
            $('input[name="altPhone"]').val(row.phone)
            $('input[name="altConstactAddress"]').val(row.constactAddress)
            $('input[name="altShowImg"]').val(row.picture)
            $('input[name="altEnglishName"]').val(row.englishName)
            $('input[name="altTakeofficeDate"]').val(row.takeofficeDate)
            $('input[name="altDepartureDate"]').val(row.departureDate)
            $('input[name="altDiploma"]').val(row.diploma)
            $('input[name="altNation"]').val(row.nation)
            $('input[name="altUserName"]').val(row.userName)
            $('input[name="altRemark"]').val(row.remark)
            layer.open({
                type: 1,
                title: '修改人员',
                offset: '100px',
                area: '650px',
                resize: false,
                zIndex: 1000,
                content: $('#alt_person')
            })

        }
        /********************************* 删除人员 ***************************************/
        var perDel = {};
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
        var personTable = {};
        personTable.init = function () {
            var queryUrl = common.host + "/base-data" + "/list";
            $('#person_table').bootstrapTable({
                columns: [{
                    checkbox: true
                }, {
                    field: 'id',
                    visible: false
                }, {
                    title: '序号',
                    align: "center",
                    formatter: function (value, row, index) {
                        return index + 1;
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
                    formatter: function (value) {
                        if (value == '0') {
                            return '男'
                        } else {
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
                    formatter: function (value) {
                        if (value == '0') {
                            return '身份证'
                        } else {
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
                        "click #edit": function (e, value, row, index) {
                            //点击编辑按钮
                            perEdit.init(row, index);
                        },
                        "click #del": function (e, value, row, index) {
                            //点击删除按钮
                            perDel.init(row);
                        }
                    },
                    formatter: function () {
                        var icons = "<div class='button-group'><button id='edit' type='button' class='button button-tiny button-highlight'>" +
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
                        name: params.searchText,
                        phone: null,
                        personnelNum: null,
                        depName: null
                    }
                    return temp
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
                var pIds = new Array();
                for (var i = 0; i < selecte.length; i++) {
                    pIds.push(selecte[i].id)
                }
                $('#per_move').click(function () {
                    var depId = $('select[name="pDept"]').val();
                    personService.updateDepIdByPersonnelId(depId, pIds, function (data) {
                        if (data.result) {
                            $('#person_table').bootstrapTable('updateCell', {
                                index: common.getTableIndex("person_table"),
                                field: 'depId',
                                value: depId
                            })
                        }
                    })
                })
            }
        })
    })