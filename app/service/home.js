const Service = require('egg').Service;

class HomeService extends Service {
  async user() {
    const { app } = this;
    const QUERY_STR = 'id, name';
    const sql = `select ${QUERY_STR} from list`; // 获取id的sql语句
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

  async addUser(name) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('list', { name }); // 给list表新增一条数据
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async editUser(id, name) {
    const { app } = this;
    try {
      const result = app.mysql.update('list', { name }, { where: { id } });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 删除
  async deleteUser(id) {
    const { app } = this;
    try {
      const result = await app.mysql.delete('list', { id });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
module.exports = HomeService;
