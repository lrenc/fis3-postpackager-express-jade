/**
 * @file 一些公用函数
 * 
 */

module.exports = {
    /**
     * 根据路径获取文件扩展名
     *
     * @param {string} path 文件路径
     * @return {string} 文件扩展名，包括'.'
     */
    extname: function(path) {
        if (typeof path !== 'string') {
            throw new Error('path should be a string');
        }
        if (path === '') {
            return path;
        }
        var index = path.lastIndexOf('.');
        if (!(index && ~index)) {
            // 只有一个点，并且以该点开头或者没有点
            return '';
        }
        return path.slice(index);
    },

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
        if (this.extname(last) !== '') {
            fromPath.pop();
        }
        toPath.forEach(function(dir) {
            if (dir === '.') {
                continue;
            }
            if (dir === '..') {
                fromPath.pop();
            } else {
                fromPath.push(dir);
            }
        });
        return fromPath.join('/');
    }
    
};
