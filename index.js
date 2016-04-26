/**
 * 获取后缀名
 */
function extname(path) {
    return path.slice(path.lastIndexOf('.'));
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
        matchs.forEach(function(match) {
            if (key === match.realPath) {
                var index = match.index;
                var code  = match.code;
                var relativePath = match.relativePath;
                content[index] = code.replace(relativePath, res[key].uri);
            }
        });
    }
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