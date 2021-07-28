module.exports = {
    standardPath (path) {
        const charCodeOfDot = '.'.charCodeAt(0);
        const reEscapeChar = /\\(\\)?/g;
        const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
        const result = [];
        if (path.charCodeAt(0) === charCodeOfDot) {
            result.push('');
        }
        path.replace(rePropName, (match, expression, quote, subString) => {
            let key = match;
            if (quote) {
                key = subString.replace(reEscapeChar, '$1');
            }
            else if (expression) {
                key = expression.trim();
            }
            result.push(key);
            return '';
        });
        return result.join('.');
    },


    get (object, path, defaultValue) {
        if (typeof path === 'undefined') {
            throw new Error('请输入正确的 path 参数！');
        }
        const pathArray = !Array.isArray(path) ? this.standardPath(path).split('.') : path;
        // 如果是 [0].name 这种数组开头的，需要过滤掉第一位
        if (pathArray && pathArray[0] === '') {
            pathArray.splice(0, 1);
        }
        return pathArray.reduce((all, item) => (all || {})[item], object) || defaultValue;
    },
    paths (object, prefixes) {
        let paths = [];
        let value;
        let key;
        prefixes = prefixes || [];
        if (typeof object === 'object') {
            for (key in object) {
                value = object[key];
                if (Array.isArray(value) && value.length && typeof value[0] === 'object' || value && value.toString() === '[object Object]') {
                    paths = paths.concat(this.paths(value, prefixes.concat([key])));
                }
                else {
                    paths.push(prefixes.concat(key).join('.'));
                }
            }
        }
        else {
            throw new Error('model 属性必须是一个 Object');
        }
        return paths;
    }
};
