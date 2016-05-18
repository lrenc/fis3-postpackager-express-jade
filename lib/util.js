/**
 * @file 一些公用函数
 * 
 */
var path = require('path');

module.exports = {
    /**
     * 获取从fromPath到toPath的绝对路径（如果from是一个绝对路径的话）
     *
     * @param {string} fromPath base路径
     * @param {string} toPath 需要解析的路径
     * @return {string} 解析后得到的绝对路径
     */
    resolve: function(fromPath, toPath) {
        if (toPath === '') {
            return fromPath;
        }
        // toPath已经是一个绝对路径了
        if (toPath.indexOf('/') === 0) {
            return toPath;
        }
        // fis已经将分隔符统一成了 /
        fromPath = fromPath.split('/');
        toPath   = toPath.split('/');

        var last = fromPath[fromPath.length - 1];
        // 是一个文件
        if (path.extname(last) !== '') {
            fromPath.pop();
        }
        toPath.forEach(function(dir) {
            if (dir === '.') {
                return;
            }
            if (dir === '..') {
                fromPath.pop();
            } else {
                fromPath.push(dir);
            }
        });
        return fromPath.join('/');
    },
    /**
     * 格式化路径
     */
    normalize: function(p) {
        var arr = p.split('/');
        var res = [];
        arr.forEach(function(item) {
            if (item !== '') {
                res.push(item);
            }
        });
        res.unshift('');
        return res.join('/');
    }
};
