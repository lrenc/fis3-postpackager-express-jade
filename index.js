/**
 * 基于jade的解决方案
 */
var path = require('path');
var util = require('./lib/util');

var eol  = require('os').EOL;

/**
 * 过滤namespace
 */
function trimNamespace(p) {
    var index = p.indexOf(':');
    if (!~index) {
        return p;
    }
    return '/' + p.slice(index + 1);
}
/**
 * 获取namespace
 */
function getNamespace(p) {
    var index = p.indexOf(':');
    if (!~index) {
        return '';
    }
    return p.slice(0, index + 1);
}

function parseQuote(current, content) {
    // 目前只支持单行分析
    var pattens = {
        link  : /^\s*link\(.*href="(.*)"\)\s*$/,
        script: /^\s*script\(.*src="(.*)"\)\s*$/,
        // img不允许换号
        img   : /^\s*img\(.*src="(.*)"\)\s*/
    };
    var quotes = [];
    var length = pattens.length;

    content.forEach(function(code, line) {
        for (var type in pattens) {
            if (!pattens.hasOwnProperty(type)) {
                continue;
            }
            var patten = pattens[type];
            var result = code.match(patten);
            // 当前行命中了规则
            if (result && result.length) {
                quotes.push({
                    line: line,
                    code: code,
                    relative: result[1],
                    path: util.resolve(current, result[1]),
                    type: type,
                });
                break;
            }
        }
    });
    // 返回所有待替换行
    return quotes;
}


/**
 * 分析依赖 后根遍历
 */
function analyseDeps(root, res, deps, depList) {
    if (res[root].deps) {
        res[root].deps.forEach(function(dep) {
            if (~depList.indexOf(dep)) {
                return;
            }
            // 对子目录进行递归
            analyseDeps(dep, res, deps, depList);
            deps.push(res[dep].uri);
            depList.push(dep);
        });
    }
}

module.exports = function (ret, conf, settings, opt) {
    var src = ret.src;
    var map = ret.map;
    var res = map.res;
    // namespace
    var ns  = getNamespace(Object.keys(res)[0]);
    // 首先找出所有文件列表
    var files = [];

    Object.keys(src).forEach(function(file) {
        // 选择jade文件
        if (src[file].rExt === '.jade' ||
            src[file].rExt === '.pug') {
            files.push(file);
        }
    });

    files.forEach(function(file) {
        // 获取文件内容，并按行拆分成数组
        var content = src[file].getContent().split(eol);
        // 对每一行进行分析，拿到静态资源的引用列表
        var quotes  = parseQuote(file, content);
        // 依赖列表
        var depList = [];
        // console.log(quotes);
        quotes.forEach(function(quote) {
            var line     = quote.line;
            var code     = quote.code;
            var relative = quote.relative;
            // 取出quote的path并加上namespace
            var key = ns + quote.path.slice(1);
            // 通过key查找res
            var deps = [];

            analyseDeps(key, res, deps, depList);

            deps.forEach(function(dep) {
                // console.log(dep);
                content.splice(line++, 0, code.replace(relative, dep));
            });

            content[line] = code.replace(relative, res[key].uri);
        });
        // 重新赋值
        src[file].setContent(content.join(eol));
    });
}
