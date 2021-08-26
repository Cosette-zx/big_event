$(function() {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function(date) {
    const dt = new Date(date)
    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss 
  }
  // 时间补0函数
  function padZero(n) {
    return n > 9 ? n :  '0' + n
  }


  // 定义一个查询的参数对象，将来请求数据的时候
  //需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, //默认请求第一页的数据
    pagesize: 2, //默认每页显示多少条数据
    cate_id: '', //文章分类的 Id
    state: '' //文章的状态，可选值有：已发布、草稿
  }

  initTable()
  initCate()

  // （获取文章列表数据）请求接口数据
  function initTable() {
    $.ajax({
      method:'GET' ,
      url: '/my/article/list',
      data: q ,
      success: function(res) {
        if( res.status !== 0) {
        return layer.msg('获取文章列表失败！')
        }
        // layer.msg('获取文章列表成功！')
        console.log('获取文章列表成功！',res)

        // 使用模板引擎渲染页面数据
        var htmlStr = template('tpl-table',res) 
        $('tbody').html(htmlStr)
        // 调用渲染分页的方法
        renderPage(res.total)
        // console.log(res.total);

      }
    })
  }
  
  // 初始化文章类别的方法(获取文章类别的所有分类，到下拉按钮)
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success : function(res) {
        if(res.status !== 0 ) {
          return layer.msg('获取分类数据失败！')
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-cate',res)
        $('[name=cate_id]').html(htmlStr)
        // layui重新渲染表单所有分类列
        form.render()

      }
    })
  }

  // 为筛选表单绑定submit事件
  $('#form-search').on('submit',function(e) {
    e.preventDefault()
    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件，查询渲染表格数据
    initTable()
  })

  // 定义渲染底部分页的方法
  function renderPage(total) {
    // 调用laypage.render()方法来渲染分页的结构
    laypage.render({
      elem: 'pageBox' , //分页容器的id
      count: total , //总数据条数
      limit: q.pagesize , //每页显示几条数据
      curr: q.pagenum ,//设置默认被选中的分页
      layout: ['count','limit','prev','page','next','skip'] ,
      limits: [2, 3, 5, 10] ,
      // 分页切换是触发的jump回调,回调触发的方式有两种：
      // 1.点击页码的时候，会触发jump回调
      // 2.只要调用了laypage.render()方法，就会触发jump回调(产生死循环)
      // 通过first的值来判断是通过哪种方式触发的jump回调
      // first为true是通过方式1触发的，first是false是方式2触发的
      jump: function(obj,first) {
        // console.log(first)
        // console.log(obj.curr)
        // 最新的页码值方到查询参数q中
        q.pagenum = obj.curr
        // 把新的条目数，赋值到q这个查询参数对象的pagesize属性中
        q.pagesize = obj.limit
        // 根据最新的q获取对应的数据列表，渲染表格
        if(!first) {
        initTable()
        }
      }
    })

  }


  // 通过代理形式为“删除”定义事件
  $('tbody').on('click','.btn-del',function() {
    // 获取删除按钮的个数
    var len = $('.btn-del').length
    console.log(len);
    // 获取到文章的ID
      var id = $(this).attr('data-id')
    // 询问是否删除
    layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
      // 获取自定义属性的值
      //删除动作
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id ,
        success: function(res) {
          if(res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')
          // 当数据删除完成后，需要判断当前这一页中是否有剩余数据
          // 如果没有剩余数据，则让页码-1之后在重新调用intTable()
          // 如果len===1，证明删除完毕之后，页面上就没有任何数据了
          if(len === 1) {
            // 页码值最小必须为1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }

          initTable()
        }
      })
      // 关闭弹窗层
      layer.close(index)
    })
  })


  // 编辑文章事件
  $('tbody').on('click','.btn-edit',function() {

    // 获取文章列表ID
    var id = $(this).attr('data-id')
    // 获取文章详情信息
    $.ajax({
      method: 'GET' ,
      url: '/my/article/' + id ,
      success: function(res) {
        console.log(res)
      }
    })






    // 跳转到文章编辑页
    // location.href = '/article/art_edit.html'

  })

  


})