$(function () {
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                var str = template("tpl-art-cate", res);
                $('tbody').html(str);
            }
        })
    }

    var layer = layui.layer;
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html(),
        })
    });

    // 提交文章
    var indexAdd = null;
    $("body").on("submit", '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                initArtCateList();
                layer.msg("恭喜你，文章添加成功！");
                layer.close(indexAdd);
            }
        })
    });

    // 修改
    var indexEdit = null;
    var form = layui.form;
    $("tbody").on("click", '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html(),
        });
        // 获取id
        var Id = $(this).attr("data-id");
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                form.val("form-edit", res.data)
            }
        })
    });

    // 修改
    $("body").on("submit", '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                initArtCateList();
                layer.msg("恭喜你，文章修改成功！");
                layer.close(indexEdit);
            }
        })
    });

    // 删除
    $("tbody").on("click", '.btn-delete', function () {
        var Id = $(this).attr("data-id");
        layer.confirm('是否删除?', { icon: 3, title: '提示' },
            function (index) {
                $.ajax({
                    method: 'GET',
                    url: '/my/article/deletecate/' + Id,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg(res.message);
                        }
                        initArtCateList();
                        layer.msg("恭喜你，文章删除成功！");
                        layer.close(index);
                    }
                })
            });

    });
})