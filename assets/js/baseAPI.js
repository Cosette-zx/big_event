// 每次调用$.get (),$.post(),$.ajax()的时候会先调用这个函数
// 在这个函数中，可以拿到我们给ajax提高的配置对象
$.ajaxPrefilter(function(options) {
  //在发起真正的Ajax请求之前，统一拼接请求的根路径
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url
  console.log(options.url)

})