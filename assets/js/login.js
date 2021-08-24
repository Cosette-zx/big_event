$(function() {
    // 注册账号链接事件
    $('#link_reg').on('click',function() {
        $('.login-box').hide()
        $('.reg-box').show()

    })
    // 登录账号链接事件
    $('#link_login').on('click',function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    
    // 从layUI中获取form对象
    var form = layui.form
    var layer = layui.layer //提示框对象
    // 通过form.verify()函数自定义校验规则
    form.verify({
        pwd:[
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ] ,
        // 校验两次输入的密码是否一致
        repwd:function(value) {
           var pwd =  $('.reg-box [name=password]').val()
           if (pwd !== value) {
               return '两次密码不一致'
           }
        }
    })

    //监听注册表单的提交事件 
    $('#form_reg').on('submit',function(e) {
        // 阻止form的默认行为
        e.preventDefault()
        // ajax请求api
        var data = {
            username: $('#form_reg [name=username]').val() ,
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser',data,function(res) {
            if(res.status !== 0) {
                return layer.msg(res.message,{icon: 2})
            }
            return layer.msg('注册成功！',{icon: 1})
        })
        // 模拟点击跳转到登录表单
        $('#link_login').click()
    })

    // 监听登录表单提交事件
    $('#form_login').on('submit',function(e) {
        e.preventDefault()
        $.ajax({
            method:'post',
            url:'/api/login',
            // 快速获取表单中的数据
            data: $(this).serialize() ,
            success: function(res) {
                if(res.status !== 0 ) {
                    return layer.msg('登录失败',{icon:2})
                }
                layer.msg('登录成功',{icon:1})
                // 将登录成功的token值保存到localStorage中
                localStorage.setItem('token',res.token)
                //跳转到主页
                location.href = '/index.html'
            }
        })
    })

})

