$(function () {
  // 调用获取用户信息
  getUserInfo()

  var layer = layui.layer
  // 退出
  $('#btnLogout').on('click',function(param) {
    //提示用户是否确认退出
    layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
      //do something
      // 1.清除本地存储中的token
      localStorage.removeItem('token')
      // 2.跳转到登录页面
      location.href = '/login.html'
      // 关闭confirm询问框
      layer.close(index);
    });   
  })
})

// 获取用户基本信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // 请求头配置对象
    // headers: {
    //   Authorization:localStorage.getItem('token') || ''
    // },
    success : function(res) {
      if(res.status !== 0 ) {
        return layui.layer.msg('获取用户信息失败！',{icon:5})
      }
      // 调用renderAvatar渲染用户头像
      renderAvatar(res.data)
    },
    // 无论请求失败还是成功都会调用complete 写到baseAPI里
    // complete: function (res) { 
    //   // console.log('执行了complete回调')
    //   // console.log(res)
    //   // 在complete 回调函数中，可以使用res.responseJSON 拿到服务器响应回来的数据
    //   if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //     // 1.强制清空token
    //     localStorage.removeItem('token')
    //     // 2.跳转到登录页面
    //     location.href = '/login.html'
    //   }
    //  }

  })
}

// 封装渲染用户头像的函数
function renderAvatar(user) {
  // 1.获取用户的昵称
  var name = user.nickname || user.username
  $('#welcome').html('欢迎&nbsp;' + name )
  // 2.按需渲染用户图像
  if(user.user_pic !== null) {
    // 3.1 渲染用户图片头像
    $('.layui-nav-img')
    .attr('src',user.user_pic)
    .show()
    $('.text-avatar').hide()

  }else {
    // 3.2渲染文本头像
    $('.layui-nav-img').hide()
    var first = name[0].toUpperCase()
    $('.text-avatar')
    .html(first)
    .show()
  }
}