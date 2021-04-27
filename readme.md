## 简介

egg-router-plus 源码解读

### 核心点

使用 Proxy 模块代理原 router 方法，并且使用闭包传入局部变量，实现 namespace 定义 prefix 和 middleWares

Proxy 模块可以实现在调用目标方法之前进行一些处理，实现代理设计模式功能

## 核心代码解读

请查看 lib router.js
