## fis3-postpackager-express-jade

只处理资源定位的fis3 jade插件

### 概述

在express项目中，有时会选择jade作为模板引擎。然而如何使用fis对前端项目进行管理成为了一个难题，fis的[jade插件](https://github.com/ssddi456/fis-parser-jade)会直接将jade编译成html，而express项目中，jade需交由node动态编译生成。因此，我们需要一个只替换、合并资源路径，不对源码进行编译操作的jade插件。


### 安装

```
npm install -g fis3-postpackager-express-jade
```

### 使用

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