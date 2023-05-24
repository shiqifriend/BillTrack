'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('index.html', {
      title: '我是张三',
    });
    // const { id } = ctx.query;
    // console.log('1212121212121212121212121', id);
    // ctx.body = id;
  }

  // 获取用户信息
  async user() {
    const { ctx } = this;
    const { name, slogen } = await ctx.service.home.user(); // 通过params 获取申明参数
    ctx.body = {
      name,
      slogen,
    };
  }

  // home post请求方法
  async add() {
    const { ctx } = this;
    const { title } = ctx.request.body;
    // Egg 框架内置了bodyParser 中间件来对 POST 模式body 解析成object挂载到ctx.request.body上
    ctx.body = {
      title,
    };
  }
}

module.exports = HomeController;
