##### 优化思路

```typescript
1.webpack是一个打包工具，从入口开始，解析文件，解析依赖，编译文件，打包文件；
----------------------------------------------------
-----------------------【开发体验】---------------------
----------------------------------------------------
`解析文件`：配置loader的查找范围 include，地址更具体，查找的文件后缀更具体，文件中引入时加上具体后缀，
          将频率出现高的的后缀放到前面
`减少重复的编译：`【splitChunkPlugin】提将基础包，公共脚本，页面公共文件分离；  `多入口文件打包，出现重复引入第三方库`      
`减少编译时间:`DLLPlugin【动态链接库】，将依赖的固定的模块写入DLLPlugin，这样在编译时直接使用，除非版本更新，例如【Angular，echarts】

`更多进程处理：`【HappyPack】webpack处理是链式处理，可能一个链需要多次转换处理文件，而node是单线程的，会阻塞其他的转换,使用HappyPack将任务分解到多个进程并行处理，减少构建时间`通过配置id将loder和happyPack进行关联`
【parallel UglifyPlugin】开启多个子进程，把对多个文件的压缩工作分配给多个子进程并行处理
----------------------------------------------------
-----------------------【输出质量】---------------------
----------------------------------------------------   
`减少文件大小`【压缩代码】
            【tree Shaking】
            【提取公共代码】
`网络体验`：【按需加载，预加载】        
`减少运行内存：`【scope hoisting】：将所有的模块的代码按照引用顺序放到一个函数作用域
```



##### 项目优化

1. 使用高版本 webpack 和 node.js
2. 多进程/多实例构建 thread-loader
3. 多进程并行压缩( terser-webpack-plugin 开启 parallel 参数 )，通过mini-css-extract-plugin提取chunk中的css代码到单独文件，通过css-loader的minimize选项开启cssnano压缩css
4. 配置 image-webpack-loader 进行图片压缩
5. 缩小打包作用域【1-exclude/include确认loader范围；2-resolve.modules告诉webpack要搜索的路径；3- resolve.extensions 尽可能减少后缀尝试的可能性；4- noParse  对于不用解析的库进行忽略；】
6. 提取页面公共资源【1- SplitChunksPlugin  进行(公共脚本，基础包，页面公共文件)分离，替代了commonschunkplugin插件】
7. DLL【1-使用DLLPlugin进行分包，使用DLLReferencePlugin(索引连接)对manifest.json引用，让一些基本不会动的代码打包成静态资源，避免反复编译】
8. 充分利用二次缓存【1-babel-loader开启缓存；2-terser-webpack-plugin开启缓存；】、
9. tree shaking【1-开发中尽可能用ES6Module；2-禁用babel-loader的模块依赖解析，否则webpack接收到的就是转换过的commonjs形式的模块，无法进行tree shaking；3-  去除无用的css代码，purgecss-webpack-plugin 和 mini-css-webpack-plugin配合使用】
10. 体积优化【1-构建后的代码存在大量闭包，造成体积增大，运行代码时的函数作用域变多，内存开销变大，scope hoisting将所有的模块的代码按照引用顺序放到一个函数作用域，然后进行适当的重命名；必须ES6语法，需要配置mainFields对第三方模块采用jsnext：main指向ES6模块化语法；2-动态的polyfill， 使用polyfill-service只给用户返回需要的polyfill 】
11. 清理目录 clean-webpack-plugin 

##### Loader 和Plugin的区别

1. loader 本质是一个函数对接收到的内容进行转换，返回转换的结果(webpack只认识js)

2. plugin是插件，基于时间流框架Tapable，可扩展webpack的功能，在webpack的运行周期广播出许多事件，plugin通过监听事件，在合适时期通过webpack的api改变文件

3. 


# 模块联邦



# css-loadedr 和 style-loader

webpack只处理js之间的依赖关系。.css文件不是一个js模块，需要loader处理。

## css-loader

```
只处理 import/require(),@import/url 引入的内容。
```

base.css

```css
.bg{
 backgroud:#000;
}
```

.js

```
const style = require('./base.css');
console.log(style,'css');
// ['./src/base.css', '.bg{ backgroud:#000;}']
```

## style-loader

```typescript
通过js创建一个style标签，里面包含一些样式。
style-loader不能单独使用，因为它不负责解析css之前的依赖关系。
`每个loader的功能都是单一的，各自独立拆分`
```

# postcss-loader

```
补充css样式各种浏览器内核前缀。
```

# url-loader 和 file-loader

1. 打包图片。
2. 在html页面中通过标签引入的图片和其他静态资源，即使配置了url-loader，webpack也不会去处理，需要使用`html-loader`

## url-loader

url-loader封装了file-loader。

1. 文件 < limit参数，url-loader将文件转为DataURL；
2. 文件>  limit参数，url-loader会调用file-loader进行处理，参数也会直接传给file-loader

`把字体文件转成 base64 是浏览器无法识别的，这是错误的操作.`

可以将大的图片单独打包，小的图片进行base64编码后在打包。[减少请求]

## file-loader

file-loader可以解析项目中的url引入(不局限于css)，根据配置将图片拷贝到相应的路径，修改打包后的文件引用路径，使之指向正确的文件。

可以指定要复制和放置资源文件的位，可以就近管理图片，使用相对路径而不用担心部署时的URL问题。

# babel-loader

将ES6语法转化成ES5

# ts-loader

编译.ts，配置项在tsconfig.json中

# html-loader

处理js中引入的html资源。处理html中引入的资源[url-loader无法处理]

```js
{
    test: /\.html$/,
    loader: 'html-loader',
    options: {
        // 除了img的src,还可以继续配置处理更多html引入的资源(不能在页面直接写路径,又需要webpack处理怎么办?先require再js写入).
        attrs: ['img:src', 'img:data-src', 'audio:src'],
        minimize: false,
        removeComments: true,
        collapseWhitespace: false
    }
}
```

# html-withimg-loader

我们在编译图片时，都是使用`file-loader`和`url-loader`，这两个`loader`都是查找`js`文件里的相关图片资源，但是`html`里面的文件不会查找所以我们`html`里的图片也想打包进去，这时使用`html-withimg-loader`

