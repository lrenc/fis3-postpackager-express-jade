# fis3-postpackager-express-jade

只处理依赖管理的fis3 jade插件

## 概述

在express项目中，通常会选择jade作为模板引擎。然而fis的jade插件会直接将jade编译成html，这与express动态编译jade相矛盾。因此，我们需要一个只替换资源路径，不对源码进行其他编译操作的jade插件。


## 安装

npm install -g fis3-postpackager-express-jade

## 使用

```javascript
fis.match('::package', {
    postpackager: [
        fis.plugin('express-jade')
    ]
})
```

## to do

* 支持打包文件合并
* 支持img标签
* 其他bug

## 其他

代码还在完善中，如有bug欢迎提交issue