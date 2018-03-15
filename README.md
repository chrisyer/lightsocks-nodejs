# Lightsocks-Nodejs

一个轻量级网络混淆代理，基于 SOCKS5 协议，可用来代替 Shadowsocks。

- 只专注于混淆，用最简单高效的混淆算法达到目的；
- NodeJs 实现

>Lightsocks 的实现原理？请阅读文章：[你也能写个 Shadowsocks](https://github.com/gwuhaolin/blog/issues/12)

## 安装
NodeJS版本>=8

```
sudo npm install -g lightsocks-nodejs
```

## 使用

### lsserver
用于运行在代理服务器的客户端，会还原混淆数据
```
 Usage: lsserver [options]

  It's a simaple socks5 proxy tool which based on lightsocks

  Options:

    -V, --version           output the version number
    -P, --password [value]  the password for server
    -L, --listen [value]    the listen address for server
    -h, --help              output usage information

```
如果不加任何参数，默认在当前用户文件夹下生成配置文件。

### lslocal
用于运行在本地电脑的客户端，用于桥接本地浏览器和远程代理服务，传输前会混淆数据

```
 Usage: lslocal [options]

  It's a simaple socks5 proxy tool which based on lightsocks

  Options:

    -V, --version           output the version number
    -P, --password [value]  the password for server
    -L, --listen [value]    the listen address for server
    -R, --remote [value]    the remote server address
    -h, --help              output usage information

```

## TODOS

- [ ] 单元测试
- [ ] lsserver/lslocal重写
- [x] 优化日志输出
- [ ] 添加注释/代码格式化

## 相关
- [lightsocks](https://github.com/gwuhaolin/lightsocks)： Go 实现版本
- [lightsocks-python](https://github.com/linw1995/lightsocks-python)：Python 实现版本；
- [lightsocks-android](https://github.com/XanthusL/LightSocks-Android)：Android 实现版本；
