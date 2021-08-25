$(function() {
  var form = layui.form
  var layer = layui.layer
  // 表单校验
  form.verify({
    pwd: [
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ],
    samePwd: function(value) {
      var pwd = $('[name = oldPwd]').val()
      if(value === pwd ) {
        return '新旧密码不能相同！'
      }
    },
    rePwd: function(value) {
      var pwd = $('[name = newPwd]').val()
      if(value !== pwd ) {
        return '两次密码不一致！'
      }
    }
  })
  // ajax请求获取表单数据
  $('.layui-form').on('submit',function(e) {
    e.preventDefault()
    $.ajax({
      method:'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function(res) {
        if(res.status !== 0) {
          return layui.layer.msg('更新密码失败！', { icon : 2 })
        }
          layui.layer.msg('更新密码成功！', { icon : 1 })
          // 转为原生对象调用form的重置方法
          // 重置表单
          $('.layui-form')[0].reset()
        
      }
    })
  })


})