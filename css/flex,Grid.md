#### flex

##### 简介

```
Flexible Box:弹性布局
特性：轴线布局
分为两个部分：容器和容器成员（子元素）
特点：容器设置flex后子元素的float，clear，vertical-align属性失效
---------------------------------------------------------
|                                     |                  |
|                                     |                  |
|--------------------主轴---------------------------------|                   |           |                                     |                  |
|                                     交叉轴              |
|                                     |                  |
|                                     |                  |
---------------------------------------------------------


```

##### 容器属性

```typescript
`display`：flex;开启flex布局

`flex-direction`:row[默认] | row-reverse | column | column-reverse;决定主轴的方向
`flex-wrap`:nowrap | wrap | wrap-reverse;默认项目是一条线，如果排不下决定换行样式
	nowrap:默认，不换行
	wrap:换行；
	wrap-reverse:换行，行的位置也反转
`felx-flow`:是flex-direction和flex-wrap和简写
	flex-flow:<flex-direction> <flex-wrap>
	
`justify-content`:定义子元素在主轴的对齐方式；
	flex-start（默认值）：左对齐
    flex-end：右对齐
    center： 居中
    space-between：两端对齐，项目之间的间隔都相等。
    space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。
`align-items`：定义子元素在交叉轴轴的对齐方式；
    flex-start：交叉轴的起点对齐。
    flex-end：交叉轴的终点对齐。
    center：交叉轴的中点对齐。
    baseline: 项目的第一行文字的基线对齐。
    stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。
`align-content`：多根轴线的对齐方式。【如果项目只有一根轴线，该属性不起作用？】
    flex-start：与交叉轴的起点对齐。
    flex-end：与交叉轴的终点对齐。
    center：与交叉轴的中点对齐。
    space-between：与交叉轴两端对齐，轴线之间的间隔平均分布。
    space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
    stretch（默认值）：轴线占满整个交叉轴。

****注
`align-content是定义主轴上的多行子元素在交叉轴上的排列方式`。    
```

##### 子元素属性

```
order:定义子元素的排列顺序，数值越小，排列越靠前，默认为0；
flex-grow：定义元素的放大比例，默认为0，即如果存在剩余空间，也不放大。
flex-shrink：定义元素的缩小比例，默认为1，即如果空间不足，该项目将缩小。
flex-basis：在分配多余空间之前，项目占据的主轴空间(可以设置width)，默认auto
flex：<flex-grow> <flex-shrink> <flex-basis>的简写，默认 1 0 auto
align-self：允许单个项目有与其他项目不一样的对齐方式，覆盖align-items属性，默认auto，继承父属性
```

##### 注

```
1-如果子项目不设置flex-basis,直接设置flex-grow，会按照比例平分空间
```

#### Grid

##### 简介

```
Grid：网格布局
特性：将容器拆分为行，列，产生【单元格】，然后指定项目所在单元格


```

##### 容器属性

```typescript
`display`:grid[默认块级元素],inline-grid[行内元素]；指定容器是grid布局，容器是行内/块级
`grid-template-columns`：column1,column2,....|repeat(3, 33.33%);  //指定列宽度【px，%】
`grid-template-rows`：row1,row2,row3,.... |repeat(3, 33.33%);   //指定行高度【px，%】
                   'auto-fill':repeat(auto-fill,100px) //自动填充
                   'fr':（fraction 的缩写，意为"片段"）150px 1fr 2fr【比例】
				   'minmax()'长度范围 1fr 1fr minmax(100px, 1fr)
                   'auto'：浏览器自己决定宽度
                   '[c1] 100px [c2] 100px'  指定线的名称，后续使用
`grid-row-gap`: 行间距   
`grid-column-gap`：列间距
`grid-gap`: <grid-row-gap> <grid-column-gap>;
`grid-template-areas`: 'a b c'    //定义区域
                       'd e f'
                       'g h i';  
                   合并区域：下面布局会合并为三行
                     'a a a'
                     'b b b'
                     'c c c';
`grid-auto-flow`：默认值是row，即"先行后列"  // 单元格的填充顺序
`justify-items`： start | end | center | stretch;//置单元格内容的水平位置
`align-items`：start | end | center | stretch; //单元格内容的垂直位置
`justify-content`:start|end|center|stretch|space-around|space-between|space-evenly
                 //整个内容区域在容器里面的水平位置
`align-content` 相似👆
`place-content`: <align-content> <justify-content>



 现有网格的外部。比如网格只有3列，但是某一个项目指定在第5行。这时，浏览器会自动生成多余的网格，以便放置项目。
`grid-auto-columns`: 指定多余网格的宽
`grid-auto-rows`：   指定多余网格的高
 
`grid-template`: grid-template-columns、grid-template-rows和grid-template-areas
`grid`：grid-template-rows、grid-template-columns、grid-template-areas、 grid-auto-rows、grid-auto-columns、grid-auto-flow
    
    
`注意`：设为网格布局以后，容器子元素（项目）的float、display: inline-block、display: table-cell、vertical-align和column-*等设置都将失效。
```

##### 元素属性

```typescript
`项目的位置`：
    grid-column-start属性：左边框所在的垂直网格线  // header-start【线的名称】
    grid-column-end属性：右边框所在的垂直网格线
    grid-row-start属性：上边框所在的水平网格线
    grid-row-end属性：下边框所在的水平网格线
`grid-column`：grid-column-start / grid-column-end;
`grid-row`: grid-row-start / grid-row-end
`grid-area`：e   //指定项目放在哪个区域
`justify-self`： 单元格内容的水平位置，
`align-self` ：单元格内容的垂直位置，
`place-self` ：<align-self> <justify-self>;
```

