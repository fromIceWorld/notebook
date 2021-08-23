function pathResolve(path) {
    // ./ 相对路径
    if (path.indexOf('./') == 0) {
        return path.subString(1);
    }
    // / 绝对路径
    if (path.indexOf('/') == 0) {
        return path;
    } else {
        return '/' + path;
    }
}

export { pathResolve };
