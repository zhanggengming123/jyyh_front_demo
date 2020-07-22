## 安装yarn

### 优点

1. `yarn`会缓存所有install的包到本地，加快下次install相同包的速度，同时也支持完全离线的状态下install已经缓存的包
1. `yarn`在第一次install包的时候，会启用多线程进行下载，加快第一次下载包的速度
1. `yarn`生成的lock文件与npm生成的lock文件相比，可读性更高
1. `yarn` 在install的时候，若发现没有指定的版本，则会让你选择install某个版本，而npm会直接install失败

### Windows

1. [点这里开始下载](https://classic.yarnpkg.com/latest.msi)
1. 安装
1. 配置`PATH`

### Mac或Linux

1. 安装`HomeBrew`
1. 执行命令
```
brew install yarn
```

### 各系统通用（不推荐）
1. 安装`Node.js`
1. 确认时候已安装`npm`
1. 执行命令
```
npm install yarn -g
```

### 常用命令对应

1. `npm install` => `yarn`
1. `npm install ***` => `yarn add ***`
1. `npm install *** -g` => `yarn global add ***`
