$(function () {

    var form = layui.form;
    var layer = layui.layer;
    initCate();
    // 封装
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',

            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 赋值渲染
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })

    }

    // 初始化富文本编辑器
    initEditor();

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 点击按钮，选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 设置图片
    $('#coverFile').change(function (e) {
        // 拿到用户选择的文件
        var file = e.target.files[0];

        if (file == undefined) {
            return;
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    // 设置状态
    var state = "已发布";
    $("#btnSave2").on('click', function () {
        state = "草稿";
    })


    // 添加文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(this);
        fd.append('state', state);
        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        })
            .toBlob(function (blob) {
                fd.append('cover_img', blob);
                publishArticle(fd);
            })
    })

    // 封装
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }

                layer.msg("恭喜你，文章发布成功！");

                // location.href = "/article/art_list.html"
                window.parent.document.getElementById("art_list").click();
            }
        })
    }

})