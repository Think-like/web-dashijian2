$(function () {
    // 自定义验证规则
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度为1~6为之间！";
            }
        }
    });

    // 用户渲染
    initUserInfo();
    // 导出layer
    var layer = layui.layer;
    // 封装函数
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 成功，后渲染
                form.val('formUserInfo', res.data);
            }
        })
    }

    // // 用户渲染
    // initUserInfo();
    // var layer = layui.layer;
    // function initUserInfo() {
    //     $.ajax({
    //         method: "GET",
    //         url: "/my/userinfo",
    //         success: function (res) {
    //             if (res.status !== 0) {
    //                 return layer.msg(res.message);
    //             }
    //             form.val('formUserInfo', res.data);
    //         }
    //     })
    // }


    // 表单重置
    $('#btnReset').on('click', function (e) {
        // 阻止重置
        e.preventDefault();
        // 新用户渲染
        initUserInfo();
    });

    // 修改用户信息
    $('.layui-form').on('submit', function (e) {
        // 阻止重置
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('成功');
                window.parent.getUserInof();
            }
        });
    });
})