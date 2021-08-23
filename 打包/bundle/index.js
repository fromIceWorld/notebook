const path = require('path'),
    pathStack = ['./'],
    rootPath = __dirname,
    ts = require('typescript'), // typescript,
    transformImport = require('./ts-compiler-module/import'), // typescript,
    fs = require('fs');
// 读取 config 配置文件
// let config = require('./config.js');
// console.log(!!ts);
// const { entry, loaders } = config;
// // 获取loader 解析 文件,匹配后用 对应loader解析文本
// loaders.forEach((load) => {
//     if (load.test.test(entry)) {
//         loadPath = path.resolve(rootPath, 'node_modules');
//         const dirFiles = fs.readdirSync(loadPath, { encoding: 'utf-8' });
//         if (dirFiles.includes(load.loader)) {
//             const path = pathStack.join('') + 'node_modules/' + load.loader;
//             // let fn = require('ts-loader').load;
//             // let content = fs.readFileSync(entry, { encoding: 'utf-8' });
//             let result = fn(content);
//             console.log(fn);
//         }
//     }
// });
// let content = fs.readFileSync(entry, { encoding: 'utf-8' });
const importES = transformImport.replaceImport('./src/main.ts');
console.log(importES);
