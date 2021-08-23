const http = require('http'),
    path = require('path'),
    fs = require('fs'),
    htmlPath = path.resolve(__dirname, './browser_module_import.html');
const server = http
    .createServer(function (req, res) {
        console.log(req)
        const { url } = req,filePath = path.resolve(__dirname,'.' + url);

        if(url == '/index' || url == '/'){
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
        }else if(url.endsWith('.js')){
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(404, {
                        'content-type': 'text/javascript',
                    });
                    res.write('<h1>页面不存在</h1>');
                } else {
                    res.writeHead(200, {
                        'content-type': 'text/javascript',
                    });
                    let result = rewriteImports(data.toString());
                    res.write(result);
                    res.end();
                }
            });

        }else if(url.endsWith('.css')){}
        else if(url.endsWith('.ts')){
            // 对于 ts文件
            
        }
        else if(url.startsWith('/@modules/')){
            // 模块的文件，去 node_module中查询
            const prefix = path.resolve(__dirname,'node_modules',url.replace('/@modules/',''))
            // 获取 文件的 package.json中 的 module 属性。
            const module = require(prefix + '/package.json').module
            const filePath = path.resolve(prefix,module);
            const fileString = fs.readFileSync(filePath,'utf-8');
            res.writeHead(200,{
                'content-type': 'text/javascript',
            }) 
            const result = rewriteImports(fileString)
            res.write(result)
            res.end();
        }
        else{
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(404, {
                        'content-type': 'text/javascript',
                    });
                    res.write('<h1>页面不存在</h1>');
                } else {
                    res.writeHead(200, {
                        'content-type': 'text/javascript',
                    });
                    res.write(data);
                    res.end();
                }
            });
        }
        
    })
    .listen(8888);
console.log('服务启动成功，端口：8888');


// 重写 js文件中的 import，使指向 固定文件。
function rewriteImports(content){
    return content.replace(/from\s*['|"]([^'"]+)['|"]/g,function($0,$1){
        if($1[0] !=="." && $1[1]!=="/"){
            return `from '/@modules/${$1}'`
        }else{
            return $0
        }
    })
}