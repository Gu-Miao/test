$(function () {

    // 下拉框
    $('#search-item .dropdown-item').click(dropdownSelect);

    // 查询
    $('#search').click(search);

    // 重置
    $('#reset').click(function () {
        $('#search-input').val('');
        $('#user-type button span').html('考试类型');
        $('#search-content button span').html('查询内容');
        $('#user-college button span').html('所属学院');
    });

    // 初始化表格
    initTable();
});

var table = new Table();

// 初始化表格
function initTable() {

    loadingy();

    $.ajax({
        type: "post",
        url: window.location.href,
        data: {},
        dataType: "json",
        success: function (data) {
            setTimeout(function () {
                layer.closeAll();
                table.init('#body', {
                    "head": [
                        {
                            "field": "cname",
                            "title": "考试名"
                        },
                        {
                            "field": "eid",
                            "title": "ID号"
                        },
                        {
                            "field": "date",
                            "title": "考试日期"
                        },
                        {
                            "field": "time",
                            "title": "考试时间"
                        }
                    ],
                    "body": data,
                    newClick: openNewLayer,
                    previewClick: openPreviewLayer,
                    changeClick: openChangeLayer,
                    deleteClick: openDeleteLayer
                });
            }, 1000);
        },
        error: function (err) {
            setTimeout(function () {
                layer.closeAll();
                layer.msg('加载失败', { icon: 5 });
                throw err;
            }, 1000);
        }
    });
}

// 查询
function search() {
    var type = $('#user-type button span').html();
    var content = $('#search-content button span').html();
    var college = $('#user-college button span').html();
    var input = $('#search-input').val();

    var data = {};
    if (input != '') {
        if (content == "查询内容") {
            data.$or = [{ cname: input }, { eid: input }];
        } else if (content == "姓名") {
            data.cname = input;
        } else {
            data.eid = input;
        }
    }

    $.ajax({
        type: "post",
        url: window.location.href,
        data: { search: JSON.stringify(data) },
        dataType: "json",
        success: function (data) {
            setTimeout(function () {
                layer.closeAll();
                table.update(data);
            }, 1000);
        },
        error: function (err) {
            setTimeout(function () {
                layer.closeAll();
                layer.msg('加载失败', { icon: 5 });
                throw err;
            }, 1000);
        }
    });
}


// 打开新增考试信息确认对话框
function openNewLayer() {
    formy('新增', '/examManagementNew', ['700px', '510px']);
}

// 打开预览对话框
function openPreviewLayer() {
    formy('预览', `/examManagementPreview?eid=${$(this).parent().parent().children().eq(1).html()}`, ['700px', '420px']);
}

// 打开修改考试信息确认对话框
function openChangeLayer() {
    formy('修改', `/examManagementChange?eid=${$(this).parent().parent().children().eq(1).html()}`, ['700px', '510px']);
}


// 打开删除考试确认对话框
function openDeleteLayer() {
    var $delBtn = $(this);
    cony('确定删除此考试吗？', deleteUser, $delBtn);
}

// 删除考试
function deleteUser($delBtn) {

    loadingy();

    var eid = $delBtn.parent().parent().find('td:eq(1)').html();
    $.ajax({
        type: "delete",
        url: window.location.href,
        data: { eid: eid },
        dataType: "json",
        success: function (data) {
            layer.closeAll();
            oky('删除成功', 2000);

            $.ajax({
                type: "post",
                url: window.location.href,
                data: {},
                dataType: "json",
                success: function (data) {
                    setTimeout(function () {
                        layer.closeAll();
                        table.update(data);
                    }, 1000);
                },
                error: function (err) {
                    setTimeout(function () {
                        layer.closeAll();
                        layer.msg('加载失败', { icon: 5 });
                        throw err;
                    }, 1000);
                }
            });
        },
        error: function (err) {
            layer.closeAll();
            erry('删除失败，请稍后再试', 2000);
            throw err;
        }
    });
}