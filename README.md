## 校园论坛

### 前言

校园论坛小程序 主要分区:

娱乐八卦 二手市场 表白墙 失物招领 学习交流

### 项目功能

- [x] 登录
- [x] 获取用户信息
- [x] 更新用户信息
- [x] 发布帖子
- [x] 帖子图片/视频
- [x] 帖子分区
- [x] 搜索
- [x] 资讯/轮播图
- [x] 我的帖子
- [x] 关于我们
- [x] 点赞收藏
- [x] 评论(父评/子评/回复)
- [x] 转发

### 项目构建

```sh
npm install

```

### 拉取项目后需要修改的东西

```js
// app.js
12 - 云函数环境
  env: 'cloud1-6gevmdvpd7d00aa4'

// pages/aboutUs/aboutUs.js
11 - 作者介绍
  authorInt: '小苏同学',

// cloud/msgSecCheck/index.js
[6, 7] - AppId、appSecret
  const appid = 'wx188726951a6b10b2' // AppId
  const appsecret = '2b8f007972abdsad1a520a532cas9b62' // 小程序唯一凭证密钥
```

`appsecret` 不知道怎么拿可以 [点击这里](https://jingyan.baidu.com/article/9f7e7ec0a038d32e2915540a.html)

### 数据表

| 表名          | 备注           |
| ------------- | -------------- |
| User          | 用户表         |
| Post          | 帖子表         |
| PostMedia     | 帖子视频图片表 |
| FatherComment | 父评论表       |
| SonComment    | 子评论表       |
| AgreeCollect  | 点赞收藏表     |
| Information   | 资讯表         |
| Reward        | 打赏表         |

### 项目地址

[https://github.com/Cicada-S/Forum](https://github.com/Cicada-S/Forum)

### 说明

> 如果对您有帮助，您可以点右上角 "Star" 支持一下 谢谢！ ^_^

> 或者您可以 "follow" 一下，我会不断开源更多的有趣的项目

> 如有问题请直接在 Issues 中提，或者您发现问题并有非常好的解决方案，欢迎 PR 👍
