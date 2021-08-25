$(function() {
  var form  = layui.form
  var layer = layui.layer
  form.verify({
    // nickname:function(value) {
    //   if(value.length > 6) {
    //     return '昵称必须在六个字符之间'
    //   }
    // },
    nickname: [
      /^[0-9a-zA-Z\u4e00-\u9fa5_]{3,16}$/
      ,'昵称是汉字、数字、字母、下划线3-16位字符'
    ] ,
    email: [
      /^([A-Za-z0-9_])+\@([A-Za-z0-9_])+\.([A-Za-z]{2,4})$/
      ,'邮箱必须是数字、字母、下划线开头，包含@符结尾以.连接的字符'
    ]
  })
  initUserInfo()
  // 初始化用户基本信息
  function initUserInfo() {
    $.ajax({
      method:'GET',
      url:'/my/userinfo',
      success: function(res) {
        if(res.status !== 0 ) {
          return layer.msg('获取用户信息失败', {icon : 1})
        }else {
          console.log(res)
          // 调用form.val()快速为表单赋值
          form.val('formUserInfo',res.data)
        }
      }
    })
  }

  // 重置用户基础信息表单数据
  $('#btnReset').on('click',function(e) {
    // 阻止表单默认提交行为
    e.preventDefault()
    initUserInfo()
  })
  // 监听表单提交事件
  $('.layui-form').on('submit',function(e) {
    e.preventDefault()
    // 发起ajax数据请求
    $.ajax({
      method: 'POST',
      url:'/my/userinfo',
      data: $(this).serialize() ,
      success: function(res) {
        if( res.status !== 0) {
          return layer.msg('更新用户信息失败',{icon: 2})
        } else {
          layer.msg('更新用户信息成功！',{icon: 1})
          // 调用父页面中的方法，重新渲染用户头像和信息
          window.parent.getUserInfo()
        }
      }
    })
  })

})