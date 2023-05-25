'use srtict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async register() {
    const { ctx } = this;
    const { username, password } = ctx.request.body; // 获取注册需要的参数
    console.log(username, password);
    if (!username || !password) {
      ctx.body = {
        code: 500,
        msg: '账号密码不能为空',
        data: null,
      };
      return;
    }
    // 验证数据库内是否已经有该账户名
    const userInfo = await ctx.service.user.getUSerByName(username);
    if (userInfo && userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '账户名已被注册，请重新输入',
        data: null,
      };
      return;
    }

    // 经过两层判断后，可以将用户信息存入数据库
    // 默认头像，放在user.js 的最外部，避免重复声明
    const defaultAvatar =
      'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png';
    // 调用service方法，将数据存入数据库
    const result = await ctx.service.user.register({
      username,
      password,
      signature: '世界和平',
      avatar: defaultAvatar,
    });
    if (result) {
      ctx.body = {
        code: 200,
        msg: '注册成功',
        data: null,
      };
    } else {
      ctx.body = {
        code: 500,
        msg: '注册失败',
        data: null,
      };
    }
    return;
  }
  // 登录
  async login() {
    // app为全局属性，相当于所有的插件方法都植入到了app对象
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    // 根据用户名，在数据库查找对应的id操作
    const userInfo = await ctx.service.user.getUSerByName(username);
    // 没找到说明没有该用户
    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '账号不存在',
        data: null,
      };
      return;
    }
    // 找到用户，并且判断输入密码与数据库中用户密码是否一致
    if (userInfo && password !== userInfo.password) {
      ctx.body = {
        code: 500,
        msg: '账号密码错误',
        data: null,
      };
      return;
    }

    // 以上判断都通过后，
    // app.jwt.sign 方法接受两个参数，第一个为对象，对象内是需要加密的内容，第二个是加密字符串
    const token = app.jwt.sign(
      {
        id: userInfo.id,
        username: userInfo.username,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // token有效期为24小时
      },
      app.config.jwt.secret
    );

    ctx.body = {
      code: 200,
      msg: '登录成功',
      data: {
        token,
      },
    };
  }
  // 验证方法
  async test() {
    const { ctx, app } = this;
    // 通过token解析拿到user_id
    const token = ctx.request.header.authorization; // 请求头获取authorization属性，值为token
    // 通过 app.jwt.verify+加密字符串解析出token的值
    const decode = app.jwt.verify(token, app.config.jwt.secret);
    ctx.body = {
      code: 200,
      msg: '获取成功',
      data: {
        ...decode,
      },
    };
  }
}

module.exports = UserController;
