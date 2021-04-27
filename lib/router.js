const assert = require('assert');

const methodList = ['get', 'post'];

class RouterPlus {
  constructor(app) {
    // egg application 对象
    this.app = app;
  }

  /**
   * @description 设定命名空间
   * @param {string} prefix
   * @param  {...any} middlewares
   */
  namespace(prefix, ...middlewares) {
    assert(typeof prefix !== 'string', 'prefix 必须是字符串类型');

    // 对 app.router 进行代理，在使用方法前进行方法封装
    const routerProxy = new Proxy(this.app.router, {
      get(target, property) {
        if (methodList.includes(property)) {
          // 对router.get等具体方法进行代理，进行参数处理
          return _proxyFn(target, prefix, property, middlewares);
        }
      },
    });

    return routerProxy;
  }

  _proxyFn(target, prefix, property, middlewares) {
    assert(typeof prefix !== 'string', 'prefix 必须是字符串类型');
    const fn = target[property];

    const fnProxy = new Proxy(fn, {
      apply(targetFn, ctx, ...args) {
        if (args.length >= 3 && typeof args[1] === 'string') {
          args[1] = prefix + args[1];
          args = args.splice(1, 0, ...middlewares);
        } else {
          args[0] = prefix + args[0];
          args = args.splice(1, 0, ...middlewares);
        }
        Reflect.apply(targetFn, ctx, args);
      },
    });

    return fnProxy;
  }
}

module.exports = RouterPlus;
