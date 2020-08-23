$(function () {

    // 为 art-template 定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 在个位数的左侧填充 0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: "",
        state: "",
    };

    initTable();
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                var str = template('tpl-table', res);
                $('tbody').html(str);
                // 分页
                renderPage(res.total);
            }
        })
    }


    // 初始化分类
    var form = layui.form;//导入form
    // 调用函数
    initCate();
    // 封装函数
    function initCate() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 赋值
                var htmlStr = template('tpl-cate', res);
                $("[name=cate_id]").html(htmlStr);
                form.render();
            }
        })
    }

    // 筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefaulf();
        // 获取
        var state = $("[name=state]").val();
        var cate_id = $("[name=cate_id]").val();
        // 赋值
        q.state = state;
        q.cate_id = cate_id;
        // 初始化文章列表
        initTable();
    })

    // 分页
    var laypage = layui.laypage;
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            // 分页模块设置
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(first, obj.curr, obj.limit); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    //do something
                    initTable();
                }
            }
        })
    }

    // 删除
    var layer = layui.layer;
    $('tbody').on('click', '.btn-delete', function () {
        // 先获取id
        var Id = $(this).attr('data-id');
        // 显示对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }

                    layer.msg("恭喜你，删除成功！");
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})