const http = require('http');
const fs = require('fs'); //引入文件读取模块
const { exec } = require('child_process');
const documentRoot = 'C:/Users/崔冰冰/Desktop';

http.createServer(function (req, res) {
    const file = documentRoot + req.url;
    fs.readFile(file, function (err, data) {
        console.log(file);
        if (err) {
            res.write('<h1>404</h1>');
            res.end();
        } else {
            if (file == 'C:/Users/崔冰冰/Desktop/module1.mjs') {
                res.writeHead(200, {
                    'Content-type': 'application/x-javascript',
                });
            } else {
                res.writeHead(200, {
                    'Content-type': 'text/html',
                });
            }

            res.end(data);
        }
    });
}).listen(8888);

const url = 'http://127.0.0.1:8888/css.html';
// win系统：win32   mac系统：darwin
const type = process.platform === 'win32' ? 'start' : 'open';
// 自动打开浏览器
exec(`${type} ${url}`);

console.log('服务器开启中...');
