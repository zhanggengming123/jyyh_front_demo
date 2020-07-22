## 框架升级配置到@vue/cli4 后的配置等变更

1. `vue.config.js`：这个文件是`@vue/cli`的总体配置文件，尽量不要做修改

1. webpack配置：现在有两种方式进行修改，都会在启动的时候自动注入到`@vue/cli4`的内部webpack配置中，推荐使用第二种配置方式

    1. 跟升级前的配置方式相同，通过传入json格式的配置。现在这个配置需要写到`webpack.base.conf.js`、`webpack.dev.conf.js`、`webpack.prod.conf.js`文件`export`的`base`、`dev`、`prod`配置中，示例参考`webpack.base.conf.js`的`base`配置
    
    1. 使用新的`webpackChain`的方式，示例参考`webpack.prod.conf.js`的`prod`
    
    文档链接：
    
    `webpackChain`：[参考文档](https://github.com/Yatoo2018/webpack-chain/tree/zh-cmn-Hans)
    
    `@vue/cli`：[webpack配置参考文档](https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F)
    
1. `static`目录更名为`public`

1. `.env.development`和`.env.production`两个文件分别是用于dev和prod模式启动时，注入到process.env的变量

## 检查修改的配置/导出当前`webpack`配置

1. 首先需要通过全局`install`一个`@vue/cli`工具

```
yarn global add @vue/cli
```
或
```
npm install @vue/cli -g
```

1. 通过`@vue/cli`提供的`vue inspect >> out.js`命令可检查`development`模式下的所有配置
1. 通过`@vue/cli`提供的`vue inspect --mode production >> out.js`命令可检查`production`的模式下的所有配置
