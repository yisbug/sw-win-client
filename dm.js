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

  setBasePath(name) {
    const dir = path.join(__dirname, name);
    const result = dm.dll.SetPath(dir);
    return {
      dmid: this.dmid,
      retcode: 0,
      result: result,
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
        error: e.essage,
        stack: e.stack,
      };
    }
  }

  findPics(x1, y1, x2, y2, pic_name, delta_color, sim, dir) {
    return dm.dll.FindPicExS(
      Number(x1),
      Number(y1),
      Number(x2),
      Number(y2),
      pic_name,
      delta_color,
      Number(sim),
      Number(dir)
    );
  }

  // 执行 dll 的方法
  dll(name, args = []) {
    try {
      let result = '';
      if (this[name]) {
        result = this[name](...args);
      } else {
        const fn = dm.dll[name];
        let str = '';
        if (args && args.length) {
          str = `dm.dll.${name}("` + args.join('","') + `")`;
        } else {
          str = `dm.dll.${name}()`;
        }
        result = eval(str);
      }
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
        error: e.message,
        stack: e.stack,
      };
    }
  }
}

module.exports = DM;
