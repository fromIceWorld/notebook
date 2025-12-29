#  基本类型

## 数值类型

### 整型

**类型定义**：`有无符号 + 类型大小(位数)`；

| 长度       | 有符号类型 | 无符号类型 |
| ---------- | ---------- | ---------- |
| 8 位       | `i8`       | `u8`       |
| 16 位      | `i16`      | `u16`      |
| 32 位      | `i32`      | `u32`      |
| 64 位      | `i64`      | `u64`      |
| 128 位     | `i128`     | `u128`     |
| 视架构而定 | `isize`    | `usize`    |

Rust整型默认使用`i32`

#### 整型溢出

假设有一个`u8`可以存储0-255的值，当你修改为范围外的值时，就会发生整型溢出。

Rust可以显式处理这些整型溢出。

1. `wrapping_*`在所有模式下按照补码循环溢出规则处理。
2. `checked_*发生溢出，返回`None。
3. `overflowing_*方法返回该值和一个指示是否存在溢出的布尔值。
4. `saturating_*可以限定计算后的结果不超过目标类型的最大值/低于最小值。

### 浮点类型

Rust中浮点类型也有基本两种类型`f32`和`f64`，默认浮点类型是`f64`。

浮点数根据 `IEEE-754` 标准实现。`f32` 类型是单精度浮点型，`f64` 为双精度。

### NaN

对于数学上未定义的结果，例如负数取平方根`-42.1.sqr()`,会产生一个特殊的结果。

Rust使用`NaN`来处理这种情况。

### 序列(Range)

Rust提供了简洁的方式来生成连续的数值

### 复数和有理数



## 字符类型｜布尔类型｜单元类型

### 字符类型(char)

英文中的字母，中文中的汉字。

```rust
fn main(){
	let c = 'z';
	let z = 'ℤ';
	let g = '国';
	let heart_eye_cat = '😻'；
}
```

### 布尔(bool)

```rust
fn main(){
  let t = true;
  let f:bool = false;
  if f{
    println!("这是毫无意义的代码段");
  }
}
```

### 单元类型

单元类型是: `()`, 唯一的值也是`()`。

1. 函数的默认返回值就是`()`，例如`fn main()`返回单元类型。毫无返回值的函数在`Rust`中有单独的定义：`发散函数（diverge function）`[无法收敛的函数]。
2. 例如`printin!()`的返回值也是单元类型`()`;
3. 可以 用`()`作为`map`的值，表示我们不关注具体的值，只关注`key`，用法和`struct{}`类似，可以作为一个值用来占位，但是完全不占用任何内存。

## 语句和表达式

`语句`：语句会执行一些操作但不会返回一个值。

`表达式`：表达式会在求值后返回一个值。如果不返回任何值，会隐式返回一个`()`;

`Rust`的函数体是由一系列语句组成，最后由一个表达式来返回值：

```rust
fn add_with_extra(x:i32,y:i32)->i32{
  	let x = x+1;   //语句
    let y = y+1;   //语句
    x+y      //表达式
}
```

### if语句块

```rust
fn ret_unit_type(){
  let x = 1;
  let y = if x % 2 == 1{
    "odd"
  }else{
    "even"
  };
  //if语句块也是一个表达式，可以用于赋值，类似三元运算符。
  let z = if x % 2 == 1{"odd"}else{"even"};
}
```

### 函数

函数就是表达式。

### retrun

`return`也是表达式。

## 函数

`Rust`是强类型语言，因此需要为一个函数参数标识出它的具体类型。

1. 函数名和函数变量使用蛇形命名法：`fn add_two()->{}`;
2. 函数的位置可以随便放，`Rust`不关心在哪里定义了函数，只要定义就可以
3. 每个参数都需要标注类型。

### 特殊返回类型

1. 函数没返回值，那么返回一个`()`

2. 通过`；`结尾的语句返回一个`()`

3. 永不返回的发散函数`!`

   ```rust
   fn dead_end()->!{
     panic!("已经崩溃了,并且不想返回任何东西");
   }
   fn forever()->!{
   	loop{
       //...
     };
   }
   ```

   

# 复合类型

## 字符串

字符串是由字符组成的连续集合，但是Rust中字符是`Unicode`类型，因此每个字符占据4个字节内存空间，但是在字符串中不一样，字符串是`UTF-8`编码，也就是字符串中的字符所占的字节数是变化的`（1-4）`，这样有助于大幅降低字符串所占用的内存空间。

Rust在语言级别，只有一种字符串类型`str`，但是它通常是以引用类型出现`&str`，也就是字符串切片。虽然在语言级别上只有上述的`str`类型，但是在标准库里，还有多种不同的字符串类型，其中最广的是`String`类型。

1. `str`是语言级别的字符串,【硬编码进可执行文件，无法被修改】
2. `String`是标准库中的字符串【一个可增长，可改变且具有所有权的UTF_8编码字符串】

**当Rust用户提到字符串时，指的就是`String`类型和`&str`字符串切片类型，这两个都属UTF-8**

### &str

- 由&[u8]表示，UTF-8的字符串的引用，字符串字面值，也称为字符串切片。
- &str用于查看字符串中的数据。
- 大小是固定的，不能调整它的大小

### String

- 来自标准库，可修改，长度可变，拥有所有权，使用UTF-8编码，不以空值(null)终止。
- 实际上是对Vec<u8>的包装，在堆内存上分配的一个字符串。

#### 追加 push/push_str

```rust
fn main(){
  let mut s = String::from("Hello");
  s.push_str("rust");
  println!("追加字符串 push_str()->{}",s);
  s.push("!");
  println!("追加字符 push()->{}");
}
```

#### 插入 insert/insert_str

```rust
fn main(){
	let mut s = String::from("hello rust!");
  s.insert(5,',');
  prinitln!("插入字符串，insert()->{}",s);
  s.insert_str(6,"I like");
  println!("插入字符串 insert_str()->{}",s);
}
```

#### 替换 replace/replacen/replace_range

```rust
fn main(){
	let string = String::from("i like rust,learn rust is 👍");
  string.replace("rust","Rust"); //全局替换，返回新的字符串
  string.replacen("rust","Rust",1);//替换n个，返回新字符串
  string.replace_range(7..8,"R");//替换范围内的字符。操作原来字符串，不返回新的字符串
}
```

#### 删除 pop/remove/truncate/clear

```rust
fn main(){
  let s = String::from("rust 删除方法");
  let p1 = s.pop();//删除并返回最后一个字符
  let p2 = s.remove(0);//删除并返回字符串指定位置的字符（按照字节位置）
  let p3 = s.truncate(0);//删除字符串中从制定位置开始到结尾的全部字符（字节）
  let p4 = s.clear();//删除字符串中所有字符
}
```

#### 连接  +/+=

`+`是调用了`add`方法。

```rust
fn main(){
	let s1 = String::from("hello");
  let s2 = String::from(" world");
  let s3 = s1 + &s2;//s1所有权被转移
}
```

#### format!

```rust
fn masin(){
	let s1 = "hello";
  let s2 = String::from("rust");
  let s3 = format!("{}{}",s1,s2);
  println("{}",s3);
}
```

### `String`与`&str`的转换

```rust
fn main(){
  let s = String::from("hellow,world");
  say_hello(&s);
  say_hello(&s[..]);
  say_hello(s.as_str());
}
fn say_hello(s:&str){
  println("{}",s);
}
```

### 字符串转译

```rust
fn main(){
	let byte_escape = "i am writing\x52\x73\x74!";
  println!("{}",byte_escape);
}
```

### 操作UTF-8字符串

#### 字符

```rust
for c in "中国人".chars(){
  println!("{}",c);
}
```

#### 字节

```rust
for b in "中国人".bytes(){
	println!("{}",b);
}
```

#### 获取字串

```rust
// 想要从UTF-8中获取字串是比较复杂的。例如“holla中国人नमस्ते” 
// 可以使用库：utf8_slice
```

### String和&str区别

- String是一个可变引用，&str是对字符串的不可变引用，所以可以更改String的数据，但是不能操作&str的数据。
- String包含其数据的所有权，而&str没有所有权，它是一个不可变借用。

### 字符串深度剖析

#### 为什么`String`可变，而字符串字面值`str`不可以

因为功能不同，`str`作为不可变的数据会被硬编码到执行文件中，这样让字符串字面值快速而且高效。但是不能把大小未知的文本都放在内存中。

对于`String`类型，为了支持一个可变，可增长的文本片段，需要在堆上分配一块在编译时未知大小的内存来存放内容，这些都是程序运行时完成的：

1. 首先向操作系统请求内存来存放`String`对象
2. 使用完成后，将内存释放，归还给操作系统

## 元组

1. 元组是由多种类型组合到一起形成的
2. 元组的长度是固定的
3. 元组的元素顺序也是固定的

```rust
fn main(){
	let tup:(i32,f64,u8) = (500,6.4,1);
  println("输出{}",tup.0);
  let (x,y,z) = tup;
  println!("输出{x}{y}{z}");
}
```

```rust
fn main(){
  let s1 = String::from("hello");
  let (x,y) = get_s(s1);
  println!("{}{}",x,y);
}
fn get_s(s:String)->(String,usize){
  let len = s.len();
  return (s,len);
}
```

## 结构体

```rust
struct User{
  active:bool,
  username:String,
  email:String,
  sign_in_count:u64,
}
```

### 创建结构体实例

1. 初始化时，每个字段都要初始化
2. 初始化时字段顺序不需要和结构体定义顺序一样
3. 必须将结构体实例声明为可变的，才可以修改其中的字段，Rust不支持将结构体中某个字段标记为可变。

```rust
let mut user1 = User{
  active: true,
  username: "joy",
  email: "752856108@QQ.COM",
  sign_in_count: 64,
}
user1.active = false;
```

### 元组结构体

```rust
struct Color(i32,i32,i32);
let black = Color(0,0,0);
```

### 单元结构体

如果定义了一个类型，但是不关心该类型的内容，只关心它的行为时，就可以使用`单元结构体`。

```rust
struct AlwaysEqual;
let subject = AlwaysEqual;
imp SomeTrait for AlwaysEqual{
  
}
```

## 枚举

1. 通过列举可能的成员定义一个**枚举类型**
2. **枚举值**是其中一个成员

```rust
enum PokerSuit{
  Clubs,
  Spades,
  Diamonds,
  Hearts,
}
```

### 使用

```rust
#[derive(Debug)]
enum PokerSuit{
    Clubs(char),
    Spades(char),
    Diamonds(char),
    Hearts(char),
  }
  fn main(){
      let c1 = PokerSuit::Spades('2');
    let c2 = PokerSuit::Clubs('A');
    dbg!("{:?}{:?}",c1,c2);
  }
```

### Option枚举

Rust使用`Option`枚举来处理空值。 通过编译器帮我们解决null的问题【期望某值不为空但实际上为空的情况】。

1. Option<T>可以理解为一个容器，装有一个值，也可能为空

```rust
enum Option<T>{
	Some<T>,
  None,
}

```

#### 创建Option

```rust
let some_value:Option<i32> = Some(5);
let none_value:Option<i32> = None;
```

#### 结构Option

```rust
let some_value:Option<i32> = Some(5);
match some_value{
  Some(value) => println!("this value is {}",value);
  NOne => println!("no value");
}
```

#### 使用unwrap

如果确定Option中一定存在值，可以使用`unwrap`获取该值，如果不存在，触发`panic`

```rust
let some_value:Option<i32> = Some(5);
let value = some_value.unwrap();
println!("{}",value);
```

#### 判断是否有值

可以使用`is_some`和`is_none`判断Option是否有值。

#### map

可以使用`map`对值进行转换

```rust
let some_value:Option<i32> = Some(5);
let new_value = some_value.map(|value|value*2);
```

### Result枚举

```rust
enum Result<T,E>{
  Ok(T),
  Err(E),
}
```

```rust
use std::fs::File;

fn main(){
	let f = File::open("hello,txt");
  let f = match f{
    OK(file)=>file,
    Err(err)=>{
      panic!("读取文件失败！{}",err);
    }
  }
}
```

## 数组

1. 速度很快，但是长度固定的`array`【数组】
2. 可动态增长的但是有性能损耗的`Vector`【动态数组】

### array

`数组`：将多个类型相同的元素依次组合在一起，就是一个数组。

1. 长度固定
2. 元素必须有相同的类型
3. 依次线性排列

### Vector

动态数组

# 流程控制

## 分支 if

## 循环for

| 使用方法                      | 等价使用方式                                      | 所有权     |
| ----------------------------- | ------------------------------------------------- | ---------- |
| `for item in collection`      | `for item in IntoIterator::into_iter(collection)` | 转移所有权 |
| `for item in &collection`     | `for item in collection.iter()`                   | 不可变借用 |
| `for item in &mut collection` | `for item in collection.iter_mut()`               | 可变借用   |

```rust
fn main(){
	for i in 1..=5{
    if i == 2{
      continue;
    }
    println!("{}",i);
  }
}
```

### 循环中获取索引

```rust
fn main(){
  let a = [4,3,2,1];
  for(i,v) in a.iter().enumerate(){
    println!("第{}个元素是{}",i+1,v);
  }
}
```

## while循环

```rust
fn main(){
	let mut n = 0;
  while n<5{
    println!("{}!",n);
    n = n+1;
  }
  println!("跳出循环!");
}
```

## loop循环

```rust
fn main(){
	let mut n = 0;
  loop{
    if n>5{
			break;
    }
    println!("{}",n);
    n+=1;
  }
  println!("跳出循环");
}
```

# 模式匹配

## match和if let

```rust
if let PATS = EXPR {
    /* body */
} else {
    /*else */
}
👆表达式等价于👇match表达式。
match EXPR {
    PATS => { /* body */ },
    _ => { /* else */ },    // 如果没有 else块，这相当于 `()`
}
```

## while let

```rust
let mut stack = Vec::new();

stack.push(1);
stack.push(2);
stack.push(3);

while let Some(top) = stack.pop(){
  printLn!("{}",top);
}
// 模式匹配，直到数组为空，弹出None，结束
```

## for

```rust
let v = vec!['a','b','c'];
for (index,value) in v.iter().enumerate(){
  println!("{} is at {}",value,index);
}
```

## let

```rust
let PATTERN = EXPESION;
let (x,y,z) = (1,2,3);
```

## 函数参数

```rust
fn foo(x:i32){
  //
}
```

# 方法

Rust的方法往往和`结构体`，`枚举`，`特征`一起使用。

## 定义方法

```rust
struct Circle{
  x:f64,
  y:f64,
  radius:f64,
}
impl Circle{
  fn new(x:f64, y:f64, radius:f64)->Circle{
    return Circle{
        x,y,radius
      };
	}
  fn area(&self)->f64{
    return std::f64::consts::PI * (self.radius * self.radius);
  }
}
```

## self，&self 和 &mut self

1. `self`表示所有权转移
2. `&self` 表示 不可变借用
3. `mut &self` 表示可变借用

## 方法名和结构体字段相同

可用来设置属性私有。

```rust
pub struct Rectangle{
  width:i32,
  height:i32,
}
impl Rectangle{
  pub fn width(&self)-> u32{
    return self.width;
  }
}
```

## 关联函数

定义在`impl`中且没有`self`的函数被称之为关联函数。

因为它没有`self`，不能用`f.read()`的形式调用，因此它是一个函数而不是方法，它又在`impl`中，与结构体紧密关联，因此称为关联函数。

**因为是函数，所以不能用`.`的方式来调用，我们需要用`::`的方式来调用。**

例如`let sq = Rectangle::new(3,3)`

## 多个 impl定义

可以为一个结构体定义多个`impl`块，目的是提供更多的灵活性和代码组织性。例如当方法多了后，可以把相关的方法组织在同一个`impl`块中。

## 为枚举实现方法

```rust
#[allow(unused)]
enum Message{
	Quit,
  Move {x:i32, y:i32},
  Write {String},
  ChangeColor(i32, i32, i32),
}
impl Message{
  fn call(&self){
    
	}
}
fn main(){
	let m = Message::Write(String::from("hello"));
  m.call();
}
```

## 为特征【trait】实现方法

```rust

```

# 泛型和特征

## 范型 Generics

### const范型

## 特征 Trait

`特征定义了一组可以被共享的行为，只要实现了特征，就可以使用这组行为。`

### 定义特征

例如文章`Post`和微博`微博`两种内容载体，我们想对对应的内容进行总结，也就是无论文章还是微博，我们都可以进行总结这种行为。那么这个行为是共享的，可以用特征来定义：

```rust
pub trait Summary{
  fn summarize(&self)->String;
}
pub struct Post{
  pub title:String,
  pub author:String,
  pub content:String,
}
impl Summary for Post{
  fn summarize(&self)->String{
		format!("文章{},内容:{}",self.title,selt.author);
  }
}
pub struct Weibo{
  pub username:String,
  pub content:String,
}
impl Summary for Weibo{
  fn summarize(&self)->String{
    format!("文章：{},内容:{}",self,content,self.usename);
  }
}
```

### 默认实现

可以在声明特征时，默认实现对应方法，在为其他结构实现时可选择使用默认实现的，也可以选择重载该方法。

### 特征作为函数参数

```rust
//实现了Summary特征的item参数😊
pub fn notify(item: &impl Summary){
	println!("Breaking news!{}",item.summarize);
}
```

### 特征约束

```rust
pub fn notify<T:Summary>(item: &T){
  println!("Breaking news!{}",item.summarize);
}
```

#### 多重约束

```rust
pub fn notify<T:Summary + Display>(item:&T){}
```

#### Where约束

```rust
fn some_function<T: Display + Clone, U: Clone + Debug>(t: &T, u: &U) -> i32 {}
//⬇️ 
fn some_function<T, U>(t: &T, u: &U) -> i32
    where T: Display + Clone,
          U: Clone + Debug
{}
```

#### 使用特征约束有条件地实现方法或特征

```rust

```

### 通过derive派生特征

`#[derive(Debug)]`是一种特征派生语法。被`derive`标记的对象会自动实现对应的默认特征代码，继承相应的功能。

1. 例如`Debug`特征，它有一套自动实现的默认代码，当给一个结构体标记后，就可以使用`peintln!`
2. `Copy`特征，也有一套自动实现的默认代码，当标记这个类型时，可以让类型自动实现，进而可以调用`copy`方法，进行自我复制。

```rust

```

## 特征对象

# 模块系统

## 典型的Package结构

```css
.
├── Cargo.toml
├── Cargo.lock
├── src
│   ├── main.rs
│   ├── lib.rs
│   └── bin
│       └── main1.rs
│       └── main2.rs
├── tests
│   └── some_integration_tests.rs
├── benches
│   └── simple_bench.rs
└── examples
    └── simple_example.rs
```

- 唯一库包：`src/lib.rs`
- 默认二进制包：`src/main.rs`，编译后生成的可执行文件与 `Package` 同名
- 其余二进制包：`src/bin/main1.rs` 和 `src/bin/main2.rs`，它们会分别生成一个文件同名的二进制可执行文件
- 集成测试文件：`tests` 目录下
- 基准性能测试 `benchmark` 文件：`benches` 目录下
- 项目示例：`examples` 目录下

## 项目(package)

- 项目是cargo的一个功能，当执行`cargo new *`时就创建了一个项目。
- 带有`Cargo.toml`文件的项目用来描述如何构建`crate`，一个项目可以**最多有一个库**类型的`crate`，任意多个二进制类型的`crate`。

## 包(crate)

`crate`是二进制/库项目。

- rust约定在`Cargo.toml`同级目录下包含`src`目录并且包含`main.rs`，就是与包同名的**二进制**`crate`。
- 如果包目录中包含`src/lib.rs`，就是与包同名的**库**`crate`。
- 多个`crate`就是一个模块的树形结构。如果一个包同时包含`src/main.rs`和`src/lib.rs`，那么它就有两个`crate`。
- 如果想要有**多个二进制**`crate`,rust约定需要将文件放在`src/bin`目录下，每个文件就是一个单独的`crate`。
- `crate根`用来描述如何构建`crate`的文件。比如`src/main.rs`或者`src/lib.rs`就是`crate根`。`crate根`文件将由`Cargo`传递给`rustc`来实际构建**库**/**二进制项目**

## 模块(mod)

`use`，`mod`，`pub`，`super`;

- 模块系统来控制作用域和私有性。

### 路径引用模块

- **绝对路径**：从包根开始，路径名以包名或者crate作为开头。
- **相对路径**：从当前模块开始，以`self`，`super`或当前模块的标识符开头。

### 结构体和枚举的可见性

- 结构体设为`pub`，它所有字段依然是私有的。
- 枚举设为`pub`，它所有字段对外可见。

因为结构体和枚举的使用方式不一样，枚举的成员对外不可见，枚举将毫无作用。结构体应用场景复杂，字段可能部分在A处被使用，部分在B处被使用，因此无法确定成员的可见性。

## 工作空间

一个工作空间是由多个`package`组成的集合，它们共享一个`Cargo.lock`文件

# 智能指针

## Box堆对象分配

### Box使用场景

#### 使用Box<T>将数据存储到堆上

数字变量默认存储在栈上，如果想要让值存储到堆上就需要使用Box<T>.

```rust
fn main() {
    let a = Box::new(3);
    println!("a = {}", a); // a = 3

    // 下面一行代码将报错
    // let b = a + 1; // cannot add `{integer}` to `Box<{integer}>`
}
```

这样创建了一个智能指针指向了存储在堆上的3，，并且a持有了该指针。

#### 避免栈上数据的拷贝

当栈上数据转移所有权时，实际上是把数据拷贝了一份，最终新旧变量各自拥有不同的数据，因此所有权并未转移。

而堆上，底层数据并不会被拷贝，转移所有权仅仅是复制一份栈中的指针，再将新的指针赋予新的变量，然后让旧指针的变量失效，最终完成所有权的转移。

```rust
fn main() {
    // 在栈上创建一个长度为1000的数组
    let arr = [0;1000];
    // 将arr所有权转移arr1，由于 `arr` 分配在栈上，因此这里实际上是直接重新深拷贝了一份数据
    let arr1 = arr;

    // arr 和 arr1 都拥有各自的栈上数组，因此不会报错
    println!("{:?}", arr.len());
    println!("{:?}", arr1.len());

    // 在堆上创建一个长度为1000的数组，然后使用一个智能指针指向它
    let arr = Box::new([0;1000]);
    // 将堆上数组的所有权转移给 arr1，由于数据在堆上，因此仅仅拷贝了智能指针的结构体，底层数据并没有被拷贝
    // 所有权顺利转移给 arr1，arr 不再拥有所有权
    let arr1 = arr;
    println!("{:?}", arr1.len());
    // 由于 arr 不再拥有底层数组的所有权，因此下面代码将报错
    // println!("{:?}", arr.len());
}
```

#### 将动态大小类型变为Sized固定大小类型

Rust需要在编译时知道类型占用多少空间，如果一种类型在编译时无法知道具体的大小，被称为动态大小类型DST。

例如**递归类型**

```rust
enum List {
    Cons(i32, List),
    Nil,
}
```

👆就是`Cons List`，每个节点包含一个`i32`值，还包含了一个新的List，这种嵌套可以无限进行下去，Rust认为该类型是一个DST类型，并给予报错。

```rust
enum List {
    Cons(i32, Box<List>),
    Nil,
}
```

只需要将`List`存储到堆上，然后使用一个智能指针指向它，即可完成从DST到Sized类型(固定大小类型)的转变。

#### 特征对象

在Rust中，想实现不同类型组成的数组只有两个办法：

- 枚举
- 特征对象

```rust
trait Draw {
    fn draw(&self);
}
struct Button {
    id: u32,
}
impl Draw for Button {
    fn draw(&self) {
        println!("这是屏幕上第{}号按钮", self.id)
    }
}
struct Select {
    id: u32,
}
impl Draw for Select {
    fn draw(&self) {
        println!("这个选择框贼难用{}", self.id)
    }
}
fn main() {
    let elems: Vec<Box<dyn Draw>> = vec![Box::new(Button { id: 1 }), Box::new(Select { id: 2 })];

    for e in elems {
        e.draw()
    }
}
```

👆将不同类型的Button和Select包装成Draw特征的特征对象，放入一个数组中，Box<dyn Draw>就是特征对象。

**特征也是DST类型，特征对象在做的就是将DST类型转换为固定大小的类型。**

## Deref

`*`：解引用。

### 引用

常规引用是一个指针类型，包含了目标数据存储的内存地址。

对常规引用使用`*`操作符，就可以通过解引用的方式获取到内存地址对应的数据值。

```rust
fn main() {
    let x = 5;
    let y = &x;
    assert_eq!(5, x);
    assert_eq!(5, *y);
    assert_eq!(5, y);//报错，无法将一个引用与一个值比较。
}
```

👆y就是一个常规引用，包含了5所在的内存地址，然后通过解引用`*y`，获取了值5.

### 智能指针解引用

当对一个结构体类型直接进行解引用，编译器不知道该怎末办，因此我们可以为智能指针结构体实现`Deref` trail。

例如Box<T>:

```rust
fn main() {
    let x = Box::new(1);
    let sum = *x + 1;
}
//Box实现了Deref，就可以像普通引用一样，通过*解引用。
```

#### 实现自己的智能指针

```rust
struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}
```

👇为MyBox实现Deref trait，以支持解引用。

```rust
use std::ops::Deref;
impl<T> Deref for MyBox<T> {
    type Target = T;
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}
```

👆解引用`MyBox`智能指针时，返回元组结构体中的元素`&self.0`

##### 原理

当对智能指针`Box`进行解引用时，实际上Rust，运行了以下方法：

```rust
*(y.deref())
```

### 连续的隐式Deref转换

```rust
fn main() {
    let s = MyBox::new(String::from("hello world"));
    display(&s)
}

fn display(s: &str) {
    println!("{}",s);
}
```

1. MyBox被Deref成String，不满足display函数参数的要求。
2. 编译器发现String还可以继续Deref成&str。
3. 最终成功的匹配了函数参数。

### Deref规则



# 返回值Result和错误处理?

程序读取一个文件，分为几类：

- 成功读取
- 失败(未找到文件)
- 失败(无访问权限)
- 其他

对返回的错误进行处理：

```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let f = File::open("hello.txt");

    let f = match f {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(e) => panic!("Problem creating the file: {:?}", e),
            },
            other_error => panic!("Problem opening the file: {:?}", other_error),
        },
    };
}
```

👆打开文件，如果正确打开，就直接返回，打开失败，判断失败的类型是NotFound,就创建文件，其他的错误就直接panic。**代码较啰嗦**。

## panic

### unwrap

```rust
use std::fs::File;

fn main() {
    let f = File::open("hello.txt").unwrap();
}
//如果返回成功就将OK(T)中的值取出来，如果失败直接panic。
```

### expect

```rust
use std::fs::File;

fn main() {
    let f = File::open("hello.txt").expect("Failed to open hello.txt");
}
//如果返回成功就将OK(T)中的值取出来，如果失败直接panic，但是会携带自定义的错误提示信息。
```

## 传播错误

在程序中，一个功能可能涉及十几层的函数调用，错误处理也不会是哪里出错，在哪里处理，实际应用中，可能会把错误层层上传交给调用链的上游函数进行统一处理。

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    // 打开文件，f是`Result<文件句柄,io::Error>`
    let f = File::open("hello.txt");
    let mut f = match f {
        // 打开文件成功，将file句柄赋值给f
        Ok(file) => file,
        // 打开文件失败，将错误返回(向上传播)
        Err(e) => return Err(e),
    };
    // 创建动态字符串s
    let mut s = String::new();
    // 从f文件句柄读取数据并写入s中
    match f.read_to_string(&mut s) {
        // 读取成功，返回Ok封装的字符串
        Ok(_) => Ok(s),
        // 将错误向上传播
        Err(e) => Err(e),
    }
}
```

👆进行了错误的传播，但是太长。

### 错误传播的宏: ?

`?`:就是一个宏，和上边的match作用几乎一样。

```rust
use std::fs::File;
use std::io;
use std::io::Read;

fn read_username_from_file() -> Result<String, io::Error> {
    let mut f = File::open("hello.txt")?;
    let mut s = String::new();
    f.read_to_string(&mut s)?;
    Ok(s)
}
```

#### ?优于match

因为一个系统中，会有自定义的错误特征，错误之间会存在上下级关系，例如标准库中的

`std::io:Error`和`std::error::Error`,前者是IO相关的错误结构体，后者是最通用的标准错误特征，同时前者实现了后者，因此`std::error::Error`可以转换为`std::error::Error`。

**？优于match的原因是，它可以自动进行类型提升(转换)：**

```rust
fn open_file() -> Result<File, Box<dyn std::error::Error>> {
    let mut f = File::open("hello.txt")?;
    Ok(f)
}
```

#### 类型转换From

错误类型通过？转换成另一个错误类型，是在于标准库中定义的`From` trait，该特征有一个方法`from`，用于把一个类型转换成另一个类型，`?`可以自动调用该方法，然后进行隐式类型转换。因此只要函数返回的错误`ReturnError`实现了`From<OtherError>`trait,`?`会自动把`OtherError`转换为`ReturnError`。

```rust
use std::fs::File;
use std::io;
use std::io::Read;

fn read_username_from_file() -> Result<String, io::Error> {
    let mut s = String::new();
    File::open("hello.txt")?.read_to_string(&mut s)?;
    Ok(s)
}
```



# 注解

## 属性注解

### `#[should_panic]`

注解当前函数必定panic。

### `#[test]`

注解当前函数是test函数。

### `#[ignore]`

## 条件注解cfg

`#[cfg(some_condition)]`;

```cmd
$ rustc --cfg some_condition // 在参数中传递cfg 条件。
```

只有满足条件才会执行。例如test注解：`#[cfg(test)]`。只有在执行时传入`test`才会执行。👇：

```cmd
cargo test
```

test条件是由`rustc`隐式提供的，但是自定义条件必须使用 `--cfg`标记来传给`rustc`。

### 测试注解

`#[cfg(test)]`：注解测试模块，只有在运行`cargo test`时才会运行测试模块 。

`#[text]`：测试函数。

# 自动化测试

测试可以有效的发现程序存在的缺陷，但是无法证明程序不存在缺陷。

1. 设置所需的数据或状态。
2. 运行想要测试的代码。
3. 判断(assert)返回的结果是否符合预期。

## 单元测试

- 针对具体的代码单元，例如函数。

单元测试的模块和待测试代码在同一个文件中，可以很方便的对私有函数进行测试。

## 集成测试

- 集成测试往往针对一个功能/接口API。

集成测试文件放在项目根目录下的`tests`目录中，由于该目录下每一个文件都是一个包，我们必须要引入待测试的代码到当前包的作用域中，才能进行测试，正因如此，集成测试只能对声明为`pub`的API进行测试。

## 文档测试

## 断言assertion

断言决定了测试是通过还是失败。

### `assert_eq!`

判断两个表达式返回的值是否相等:

```rust
fn main() {
    let a = 3;
    let b = 1 + 3;
    assert_eq!(a, b, "我们在测试两个数之和{} + {}，这是额外的错误信息", a, b);
}
//不相等直接panic。
```

### `assert_ne!`

判断两个表达式是否不相等。

```rust
fn main() {
    let a = 3;
    let b = 1 + 3;
    assert_ne!(a, b, "我们在测试两个数之和{} + {}，这是额外的错误信息", a, b);
}
```

### `assert!`

判断传入的boolean表达式是否为true。

## 压力测试

针对接口API，模拟大量用户去访问接口然后生成接口级别的性能数据；

## 基准测试

测试某一段代码的运行速度，例如一个排序算法。

## Github Actions

## 测试驱动开发(TDD)

- 编写一个注定失败的测试，并且失败的原因和你指定的一样。
- 编写一个成功的测试。
- 编写你的逻辑代码，直到通过测试。

# 语言特性

## 所有权

- 一个值只能有一个对应的变量来**拥有**它，这个变量被称为所有者。
- 一个值同一时刻只能有一个所有者。
- 当所有者离开作用域，这个值将被释放。

### Copy语义与Move语义

#### Move

```rust
fn main() {
    let s = String::from("hello");
    let s1 = s; // s的所有权转移给了s1, s不再有效
    // println!("{}", s); // 此处会报错，因为s已经不再有效
    println!("{}", s1);
    // s1释放
}
```

当把s赋值给s1时，s的所有权转移到了s1，s不再有效，这就是`Move`语义,当s1离开作用域时，s1的所有权释放,字符串“hello”也就随之释放。

#### Copy

但是如果是存储在栈上的简单数据,比如`整型`,`浮点型`，`布尔型`，转移所有权，就太复杂了。所以Rust语言对于这些简单数据类型,采用了 `Copy trait`来实现。

这样就是复制，而不是转移所有权。

```rust
fn main() {
    let x = 5;
    let y = x; // 此时x和y都是有效的，因为x是简单数据类型，采用了Copy trait
    println!("x = {}, y = {}", x, y);
    // y释放
    // x释放
}
```

## 借用(Borrow)

创建一个引用(&)的行为称为借用

```rust
fn main() {
    let s = String::from("hello");
    print(s);
    // println!("{}", s); // 此处会报错，因为s已经在函数传参时转移了所有权，不再有效
}
fn print(s: String) {
    println!("{}", s);
}
```

👆传参后，还需要使用字符串,没有实现Copy trait，但是又不想转移所有权，就需要借用。

### 可变/不可变借用

- 可变借用：`&mut`
- 不可变借用：`&`

```rust
fn main() {
    let mut s = String::from("hello");
    print(&s);
    add(&mut s);
    println!("{}", s); // 输出：hello world
}
// 这里不对字符串进行修改，所以用不可变借用
fn print(s: &String) {
    println!("{}", s);
}
// 这里对字符串进行修改，所以用可变借用
fn add(s: &mut String) {
    s.push_str(" world");
}
```

Rust中的`借用`是临时借用使用权，并不破坏单一所有权原则，所以Rust的借用默认是不可变的，如果想要修改引用的值，需要使用可变借用。

### 限制

为了保证内存安全，Rust语言中的借用有一些限制：

- 同一个作用域中，同一数据只能有一个可变借用。
- 同一个作用域中，同一数据可以有多个不可变借用。
- 同一个作用域中，可变借用与不可变借用不能同时存在。
- 所有借用的生命周期不能超过值的生命周期。

核心原则:  ***共享不可变，可变不共享***

## 引用

&就是引用。

Rust中的`引用`是指向某个值的指针。允许使用值但不获取其所有权。

## 解引用

* 用来解引用



## 生命周期

程序中每个变量都有一个固定的作用域，当超出变量的作用域后，变量就会被销毁。

变量从初始化到销毁的整个过程称之为生命周期。

- 生命周期是用来解决借用的限制问题，避免悬垂引用的。
- 生命周期是指在程序运行时，某个值的有效范围。
- 生命周期的作用是保证借用的值在借用结束之前有效。

### 函数中的生命周期参数

- 函数的生命周期参数并不会改变生命周期的长短，只是用于编译来判断是否满足借用规则。
- 如果函数的参数与函数的返回值不建立生命周期关联的话，生命周期参数毫无用处。

对于一个参数和返回值都包含借用的函数而言，函数的参数是出借方，函数的返回值是所绑定的那个变量就是借用方。所以这种函数也要满足借用规则(借用方的生命周期不能比出借方的生命周期长)。

因此需要对函数返回值的生命周期进行标注，告知编译器函数返回值的生命周期信息。

```rust
fn max_num(x: &i32, y: &i32) -> &i32 {
  if x > y {
    &x
  } else {
    &y
  }
}

fn main() {
  let x = 1;                // -------------+-- x start
  let max;                  // -------------+-- max start
  {                         //              |
    let y = 8;              // -------------+-- y start
    max = max_num(&x, &y);  //              |
  }                         // -------------+-- y over
  println!("max: {}", max); //              |
}                           // -------------+-- max, x over
```

👆由于缺少生命周期参数，编译器不知道`max_num`函数返回的借用生命周期是什么，所以报错。

```rust
fn max_num<'a>(x: &'a i32, y: &'a i32) -> &'a i32 {
  if x > y {
    &x
  } else {
    &y
  }
}
fn main() {
  let x = 1;                // -------------+-- x start
  let max;                  // -------------+-- max start
  {                         //              |
    let y = 8;              // -------------+-- y start
    max = max_num(&x, &y);  //              |
  }                         // -------------+-- y over
  println!("max: {}", max); //              |
}                           // -------------+-- max, x over
```

上面代码对`max_num`的参数和返回值的生命周期进行标注，告诉编译器函数参数和函数返回值的生命周期一样长。

`max_num`调用时，编译器会把变量x的生命周期和变量y的生命周期与`max_num`函数的生命周期参数`'a`建立关联。但是x和y的生命周期长短不一样，关联到`max_num`函数的生命周期`'a`的长度，由编译器取x的生命周期和y的生命周期`重叠`的部分,也就是取最短的那个变量的生命周期与`’a`建立关联。这里取的是y的生命周期。所以还是会报错。

```rust
fn max_num<'a>(x: &'a i32, y: &'a i32) -> &'a i32 {
  if x > y {
    &x
  } else {
    &y
  }
}
fn main() {
  let x = 1;                  // -------------+-- x start
  let y = 8;                  // -------------+-- y start
  let max = max_num(&x, &y);  // -------------+-- max start
  println!("max: {}", max);   //              |
}                             // -------------+-- max, y, x over
```

👆，调整max，y位置，使max的生命周期小于y的生命周期。

#### 多生命周期参数

`'b:'a`：标注了 `'a`和`'b`之间的生命周期关系，表示`'a`的生命周期不能超过`'b`。

```rust
fn max_num<'a, 'b: 'a>(x: &'a i32, y: &'b i32) -> &'a i32 {
  if x > y {
    &x
  } else {
    &y
  }
}
fn main() {
  let x = 1;                  // -------------+-- x start
  let y = 8;                  // -------------+-- y start
  let max = max_num(&x, &y);  // -------------+-- max start
  println!("max: {}", max);   //              |
}                             // -------------+-- max, y, x over
```

### 结构体中的生命周期参数

一个包含`引用成员`的结构体，必须保证结构体本身的生命周期不能超过任何一个`引用成员`的生命周期。否则就会出现成员已经销毁后，结构体还保持对那个成员的引用就会出现悬垂引用。所以依旧是Rust的借用规则【借出方(结构体本身)的生命周期不能比出借方(结构体中的引用成员)的生命周期长】。

因此需要在声明结构体的同时也声明生命周期参数，同时对结构体的引用成员进行生命周期参数标注。

```rust
struct Foo<'a> {
  v: &'a i32
}

fn main() {
  let foo;                    // -------------+-- foo start
  {                           //              |
    let v = 123;              // -------------+-- v start
    foo = Foo {               //              |
      v: &v                   //              |
    }                         //              |
  }                           // -------------+-- v over
  println!("foo: {:?}", foo); //              |
}                             // -------------+-- foo over
```

👆出现悬垂引用。

### 静态生命周期参数

有一个特殊的生命周期叫`static`，它的生命周期是整个应用程序。跟其他生命周期参数不同的是，它表示一个具体的生命周期长度，而不是泛指。`static`生命周期的变量存储在静态段中。

1. 所有字符串字面值都是`'static`生命周期

   ```rust
   let s: &'static str = "codercat is a static lifetime.";
   ```

   👆代码中的生命周期可以省略

   ```rust
   let s: &str = "codercat is a static lifetime.";
   ```

2. `static`变量的生命周期也是`'static`

   ```rust
   static V: i32 = 123;
   ```

3. 特殊实例

   ```rust
   fn max_num<'a>(x: &'a i32, y: &'a i32) -> &'a i32 {
     if x > y {
       &x
     } else {
       &y
     }
   }
   fn main() {
     let x = 1;                // -------------+-- x start
     let max;                  // -------------+-- max start
     {                         //              |
       static Y: i32 = 8;      // -------------+-- Y start
       max = max_num(&x, &Y);  //              |
     }                         //              |
     println!("max: {}", max); //              |
   }                           // -------------+-- max, Y, x over
   ```

# 二进制

## 原码的定义

想要表示有符号整数，就将最前面的一个2进制位作为符号位，即0代表正数，1代表负数，后面是数值位也叫做**真值**。这就是原码定义。

## 反码

1. 正数的反码是其本身
2. 负数的反码是符号位不变，其余各个位置取反

## 补码

为了解决计算机中数的表示和数的运算问题。

1. 正数的补码是其本身
2. 负数的补码是在反码的基础上+1。

## 移码

不管正负，将其补码的符号位取反

## 8位2进制表示的范围

### 有符号数

0000 0000 ~ 1111 1111

可以表示2^8 = 256个数。无符号数是0-255。

### 有符号数

将第一个2进制位作为符号位。0是正数，1是负数。后面的7位是数值区。

1. 会出现 +0 (0000 0000) 和 -0(1000 0000),产生编码映射的不唯一，计算机上就要区分+0和-0,这在计算机上没有意义。
2. 为了解决👆问题，强制将1000 0000 认定为 -128。但是出现了新的问题:数的运算。数学上1+ (-1) = 0,在二进制中0000001 + 10000001 = 10000010，换算成十进制是-2。所以原码的符号位不能直接运算，必须与其他位分开，这增加了硬件的开销的复杂性。
3. 引入补码,