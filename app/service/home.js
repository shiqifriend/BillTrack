const Service = require('egg').Service;

class HomeService extends Service {
  async user() {
    const { app } = this;
    const QUERY_STR = 'id, name';
    const sql = `select ${QUERY_STR} from list`;// 获取id的sql语句
    try {
      // mysql示例已经挂载到app对象下，可以通过app.mysql获取实例
      console.log(app.mysql);
      const result = await app.mysql.query(sql);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
    // return {
    //   name: '嘎子',
    //   slogen: '网络的世界太虚拟，你把握不住',
    // };
  }
}
module.exports = HomeService;
