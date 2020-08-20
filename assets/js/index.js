$(function () {
    // 获取用户信息
    getUserInof();

    // 退出
    var layer = layui.layer;
    $('#btnLogout').on('click', function () {
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            //do something
            localStorage.removeItem('token');
            // 页面跳转
            location.href = '/login.html';
            // 关闭询问框
            layer.close(index);
        });
    })
});

// 获取用户信息函数
function getUserInof() {
    // 发送ajax
    $.ajax({
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ""
        // },
        success: function (res) {
            console.log(res);
            // 判断状态码
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            // 请求成功
            renderAvatar(res.data);
        }
    })
}

// 封装用户头像
function renderAvatar(user) {
    // 用户名
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    if (user.user_pic !== null) {
        // 有头像
        $('.layui-nav-img').show().attr("src", user.user_pic);
        $('.user-avatar').hide();
    } else {
        // 没有头像
        $('.layui-nav-img').hide();
        var text = name[0].toUpperCase();
        $('.user-avatar').show().html(text);
    }
}