const dm = require('dm.dll');
const path = require('path');

class DM {
  constructor(dmid) {
    this.dmid = dmid;
  }

  // 获取相对于根目录的路径
  getDir(dir) {
    return {
      dmid: this.dmid,
      retcode: 0,
      result: path.join(__dirname, dir),
    };
  }

  // 执行 js 封装的方法
  exec(name, args = []) {
    try {
      const result = dm[name].apply(dm, args);
      return {
        dmid: this.dmid,
        retcode: 0,
        result: result,
      };
    } catch (e) {
      return {
        dmid: this.dmid,
        retcode: -1,
        error: e,
      };
    }
  }

  // 执行 dll 的方法
  dll(name, args = []) {
    try {
      const fn = dm.dll[name];
      let str = '';
      if (args && args.length) {
        str = `dm.dll.${name}("` + args.join('","') + `")`;
      } else {
        str = `dm.dll.${name}()`;
      }
      const result = eval(str);
      return {
        dmid: this.dmid,
        retcode: 0,
        result: result,
      };
    } catch (e) {
      console.log(e);
      return {
        dmid: this.dmid,
        retcode: -1,
        error: e,
      };
    }
  }
}

module.exports = DM;
