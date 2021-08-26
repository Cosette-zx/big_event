$(function() {
  var layer = layui.layer
  var form = layui.form
  // 通过URLSearchParams对象，后期URL传递的参数
  // location.search查询字符串部分，从问号?开始。
  var params = new URLSearchParams(location.search)
  // 拿到文章列表的“编辑”点击事件获取的文章Id,赋值artId,拿到id就可获取文章详细
  var artId = params.get('id')
  // 文章发布的状态
  // var art_state = ''
  var $image = $('#image')
  
  // 定义加载文章分类的方法
  initCate()
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        if(res.status !== 0 ) {
          return layer.msg('初始化文章分类失败！')
        }
        // 调用模板引擎，渲染分类的下拉框
        var htmlStr = template('tpl-cate',res)
        $('[name=cate_id]').html(htmlStr)
        // 由于layui不知道动态生成了分类，一定要记得去调用form.render()方法
        // layui重新渲染表单所有分类列
        form.render()
        getArticleById()
      }
    })
  }

   // 编辑实现

  // 定义获取文章详细信息的方法
  function getArticleById() {
    $.ajax({
      method: 'GET' ,
      url: '/my/article/' + artId,
      success : function(res) {
        console.log(res)
        if(res.status !== 0 ) {
          return layer.msg('获取文章失败！')
        }
        
        // 获取文章成功
        var art = res.data
        form.val('form-edit',{
          Id: art.Id,
          title: art.title,
          cate_id: art.cate_id,
          content: art.content,
          state: art.state
          // cover_img: art.cover_img
        })

        // 手动初始化富文本编辑器cropper插件自带方法
        initEditor() 
        // 1. 初始化图片裁剪器
        var $image = $('#image')
        // 设置图片路径
        $image.attr('src', 'http://ajax.frontend.itheima.net' + art.cover_img)
        
        // 2. 裁剪选项
        var options = {
          aspectRatio: 400 / 280,
          preview: '.img-preview'
          
        }
        
        // 3. 初始化裁剪区域
        $image.cropper(options)
      }
    })

  }

  // 为选择封面的按钮，绑定点击事件的处理函数
  $('#btnChooseImage').on('click',function(e) {
    e.preventDefault()
    $('#coverFile').click()
  })

  // 监听coverFile的change事件，来获取用户选择的文件列表
  $('#coverFile').on('change',function(e) {
    // 获取到文件的列表数组
     var files = e.target.files
    //  判断是否选择文件
    if(files.length === 0){
      return 
    }
    // 根据选择的文件，创建一个对应的 URL 地址
    var newImgURL = URL.createObjectURL(files[0])
    // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
    $image
    .cropper('destroy')      // 销毁旧的裁剪区域
    .attr('src', newImgURL)  // 重新设置图片路径
    .cropper({               // 重新初始化裁剪区域
      aspectRatio: 400 / 280,
      preview: '.img-preview'
    })        
  })

  // 定义文章的发布状态
  
    var art_state = '已发布'
  

  // 为存为草稿按钮绑定点击事件
  $('#btnSave2').on('click',function() {
    art_state = '草稿'
  })

  // 为表单绑定submit提交事件 
  $('#form-edit').on('submit',function(e) {
    e.preventDefault()
    // 2.基于form表单，快速创建一个FormData对象
    var fd = new FormData($(this)[0])
    // 3.将文章的发布状态存到fd中
    fd.append('state',art_state)
    // 4.将封面裁剪过后的图片，输出为一个文件对象
    $image
  .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
    width: 400,
    height: 280
  })
  .toBlob(function(blob) {      
    // 将 Canvas 画布上的内容，转化为文件对象
    // 得到文件对象后，进行后续的操作
    // 5.将文件对象存储到fd 中
    fd.append('cover_img',blob)
    fd.append('state',art_state)
    // 6.发起ajax数据请求
    publishArtical(fd) 
  })

  })

  // 定义一个编辑文章的方法
  function publishArtical(fd) {
    $.ajax({
      method:'POST' ,
      url: '/my/article/edit',
      data: fd ,
      //注意:如果向服务器提交的是FormData 格式的数据，
      //必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function(res) {
        if( res.status !== 0) {
        return layer.msg('编辑文章失败！')
        }
        layer.msg('编辑文章成功！')
        // 发布文章成功！到文章列表页面
        location.href = '/article/art_list.html'
      }
    })
  }

})