const http = require('http'),
    path = require('path'),
    fs = require('fs'),
    htmlPath = path.resolve(__dirname, './index.html');
const server = http
    .createServer(function (req, res) {
        const { url } = req;
        fs.readFile(htmlPath, (err, data) => {
            if (err) {
                res.writeHead(404, {
                    'content-type': 'text/html;charset="utf-8"',
                });
                res.write('<h1>页面不存在</h1>');
            } else {
                res.writeHead(200, {
                    'content-type': 'text/html;charset="utf-8"',
                });
                res.write(data);
                res.end();
            }
        });
    })
    .listen(8888);
console.log('服务启动成功，端口：8888');
