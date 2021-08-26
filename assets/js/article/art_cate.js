$(function() {
  var form = layui.form
  var layer = layui.layer

  initArtCateList()
  // 获取文章分类列表数据
  function initArtCateList() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        // console.log(res)
        // 利用template模板将数据渲染到页面
        var htmlStr = template('tpl-table',res)
        $('.layui-table tbody').html(htmlStr)
      }
    })
  }

  // 添加文章类别
  var indexAdd = null
  $('#btnAddCate').on('click',function() {
    indexAdd = layer.open({
      type: 1 ,
      area: ['500px','300px'] ,
      title: '添加文章类别' ,
      content: $('#dialog-add').html()
    });
  })

  // 通过代理的形式，为动态生成的form-add表单添加submit事件
  // 添加文章类别
  $('body').on('submit','#form-add',function(e) {
    e.preventDefault()
    $.ajax({
      method: "POST",
      url: "/my/article/addcates",
      data: $(this).serialize() ,
      success: function (res) {
        if(res.status !== 0) {
          return layer.msg('新增文章分类失败！')
        }
        
        initArtCateList()
        layer.msg('新增文章分类成功！')
        // 根据索引关闭对应的弹出层
        layer.close(indexAdd)
      }
    })
  })


  // 修改文章类别信息(代理形式)
  var indexEdit = null
  $('tbody').on('click','.btn-edit',function() {
    indexEdit = layer.open({
      type:1 ,
      area: ['500px','250px'],
      title:'修改文章分类',
      content: $('#dialog-edit').html()
    })

    var id = $(this).attr('data-id')
    // 发请求获取对应分类的数据，编辑框弹出是将已有信息显示出来的功能
    $.ajax({
      method:'GET',
      url:'/my/article/cates/' + id ,
      success: function(res) {
        // lay-filter = "form-edit" 快速填充form数据
        form.val('form-edit',res.data)
      }
    })

  })


  // 通过代理的形式，为修改分类的表单绑定submit提交事件
  $('body').on('submit','#form-edit',function(e) {
    e.preventDefault()
    $.ajax({
      method: "POST",
      url: "/my/article/updatecate",
      data: $(this).serialize() ,
      success: function (res) {
        if(res.status !== 0) {
          return layer.msg('更新分类信息失败!')
        }
        layer.msg('更新分类信息成功!')
        layer.close(indexEdit)
        // 刷新表单数据
        initArtCateList()
        
      }
    })
  })


  // 删除,代理形式绑定事件
  $('tbody').on('click','.btn-del',function(){
    // 获取自定义属性data-id获取id
    var id = $(this).attr('data-id')
    // layer的confirm(询问框)提示是否删除
    layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
      //删除数据操作
      // url的id是参数项，就是我们获取的要删除的项的id值
      $.ajax({
        method:'GET',
        url:'/my/article/deletecate/' + id ,
        success: function(res) {
          if(res.status !== 0) {
            return layer.msg('删除文章分类失败!')
          }
          layer.msg('删除文章分类成功!')
          initArtCateList()
        }
      })
    })
  })
  
})