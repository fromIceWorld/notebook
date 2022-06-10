module.exports = function (source) {
    return source.replace(/NAME/g, 'tt');
};
module.exports.pitch = function (res) {
    console.log('pitch', res);
};
