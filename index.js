/**
 * 获取后缀名
 */
function extname(path) {
    return path.slice(path.lastIndexOf('.'));
}

/**
 * 过滤namespace
 */
function filterNamespace(path) {
    var arr = path.split(':');
    return arr.length === 1 ? arr[0] : arr[1];
}

/**
 * 格式化路径 去除多余的路径分隔符
 */
function formatPath(path) {
    var arr = path.split('/');
    var res = [''];
    for (var i = 1, l = arr.length; i < l; i ++) {
        var item = arr[i];
        if (item !== '') {
            res.push(arr[i]);
        }
    }
    return res.join('/');
}

/**
 * 转换targetPath为绝对路径（如果basePath是一个绝对路径的话）
 */
function relative(basePath, targetPath) {
    basePath   = basePath.split('/');
    targetPath = targetPath.split('/');
    // 去掉文件名
    basePath.pop();
    
    if (basePath[0] === '') {
        basePath.shift();
    }
    targetPath.forEach(function(item) {
        if (item === '.') {
            return;
        }
        if (item === '..') {
            basePath.pop();
        } else {
            basePath.push(item);
        }
    });
    return basePath.join('/');
}

/**
 * 对源码进行处理
 */
function parse(content, filePath, ret) {
    var map = ret.map;
    content = content.split('\r\n');
    // 这里先这么处理一下
    var pattens = [
        /^\s*link\(.*href="(.*)"\)$/,
        /^\s*script\(.*src="(.*)"\)$/
    ];
    var matchs = [];
    // 收集link 和 script标签
    content.forEach(function(line, index) {
        // 依次遍历patten
        pattens.forEach(function(patten) {
            var res = line.match(patten);
            if (res && res.length) {
                matchs.push({
                    index: index,
                    code : line,
                    relativePath: res[1],
                    realPath: relative(filePath, res[1])
                });
            }
        });
    });
    // 先不处理打包
    var res = map.res;
    
    for (var key in res) {
        if (!res.hasOwnProperty(key)) {
            continue;
        }
        var path = filterNamespace(key);
        matchs.forEach(function(match) {
            if (path === match.realPath) {
                var code  = match.code;
                var index = match.index;
                var to    = formatPath(res[key].uri);
                var relativePath = match.relativePath;

                content[index] = code.replace(relativePath, to);
            }
        });
    }
    // linux下可能会有区别
    return content.join('\r\n');
}

module.exports = function (ret, conf, settings, opt) {
    var src = ret.src;
    for (var key in src) {
        if (!src.hasOwnProperty(key)) {
            continue;
        }
        if (extname(key) === '.jade') {
            // 这里处理文件内容
            var file    = src[key];
            var content = file.getContent();
            
            file.setContent(
                parse(content, key, ret)
            );
        }
    }
}