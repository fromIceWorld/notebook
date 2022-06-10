# vue-loader

.vue文件是如何编译的

```typescript
`前置插件`：【VueLoaderPlugin 】
vue-loader对应的插件，会在初始化时，修改webpack的loader配置，将pitcher对象放到loader的第一个：
{
    loader:require.resolve('./loaders/pitcher'),
    resourceQuery:query=>{
        if(!query){return false};
        const parsed = qs.parse(query.slice(1));
        return parse.vue != null;
    }    
}

`vue-loader`：
1.通过@vue/component-compiler-utils 的 parse 将SFC文本解析为AST对象
2.遍历AST对象，转换为特殊的引用路径
3.返回转换结果
`插入的pitcher`：【会命中经过vue-loader改造的vue文件】
1.遍历用户定义的rule数组，拼接出完整的行内引用路径
`vue-loader`：【第二次调用vue-loader】
1.因为路径已经带参数type，因此，vue-loader，会根据不同的type返回不同的内容
```

## 第一步

```typescript
vue-loader
-------------------------------------------------------------
将 import xx from './index.vue';
转换为：
import { render, staticRenderFns } from "./index.vue?vue&type=template&id=2964abc9&scoped=true&"

import script from "./index.vue?vue&type=script&lang=js&"
export * from "./index.vue?vue&type=script&lang=js&"

import style0 from "./index.vue?vue&type=style&index=0&id=2964abc9&scoped=true&lang=css&"


```

## 第二步

```typescript
pitcher
-----------------------------------------------------
将上一步的 template，js，css命中到 vue-template-loader，js-loader,css-loader
转换：
【行内式templateloader ！ vue-loader ！template】
export * from "-!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./index.vue?vue&type=template&id=2964abc9&scoped=true&"

【行内式 babel-loader ！ vue-loader ！js】
import mod from "-!../../node_modules/babel-loader/lib/index.js??clonedRuleSet-2[0].rules[0].use!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./index.vue?vue&type=script&lang=js&";
export default mod; 

【行内式 babel-loader ！ vue-loader ！js】
export * from "-!../../node_modules/babel-loader/lib/index.js??clonedRuleSet-2[0].rules[0].use!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./index.vue?vue&type=script&lang=js&"

【行内式 style-loader ！ vue-loader ！css】
export * from "-!../../node_modules/mini-css-extract-plugin/dist/loader.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./index.vue?vue&type=style&index=0&id=2964abc9&scoped=true&lang=css&"
```

## 第三步

```typescript
`vue-loader`：改造过的路径，还会命中vue-loader，vue-loader根据路径中的参数不同，返回不同的数据，以复用其他配置
```

## loader

```typescript
1.可以在插件中动态修改webpack配置
2.loader不一定直接转换处理文件的内容，也可以返回一些更具体的，更有指向性的新路径，以复用webpack的其他模块
3.灵活运用resourceQuery，能够在loader中更精确地命中特定路径格式
```

