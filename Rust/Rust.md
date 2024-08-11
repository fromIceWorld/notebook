# 基本类型

# 复合类型

## 字符串

`&str`和 `String`

### &str

- 由&[u8]表示，UTF-8的字符串的引用，字符串字面值，也称为字符串切片。
- &str用于查看字符串中的数据。
- 大小是固定的，不能调整它的大小

### String

- 来自标准库，可修改，长度可变，拥有所有权，使用UTF-8编码，不以空值(null)终止。
- 实际上是对Vec<u8>的包装，在堆内存上分配的一个字符串。

### String和&str区别

- String是一个可变引用，&str是对字符串的不可变引用，所以可以更改String的数据，但是不能操作&str的数据。
- String包含其数据的所有权，而&str没有所有权，它是一个不可变借用。

## 切片slice

slice允许引用集合中一段连续的元素序列，而不用引用整个集合。

```rust
// slice range 的索引必须位于有效UTF-8字符边界内，如果尝试从一个多字节字符的中间位置创建字符串slice,则程序将会因错误而退出。

let s = String::from("hello");
let slice = &s[3..];
```

```rust
let a = [1, 2, 3, 4, 5];

let slice: &[i32] = &a[1..3];
//slice通过存储第一个集合元素的引用和一个集合总长度。
```

# 表达式

## if let

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
- 带有`Cargo.toml`文件的项目用来描述如何构建`crate`，一个项目可以**最多有一个库**类型的`crate`，任意多个二进制可行类型的`crate`。

## 包(crate)

`crate`是二进制/库项目。

- rust约定在`Cargo.toml`同级目录下包含`src`目录并且包含`main.rs`，就是与包同名的**二进制**`crate`。
- 如果包目录中包含`src/lib.rs`，就是与包同名的**库**`crate`。
- 多个`crate`就是一个模块的树形结构。如果一个包同时包含`src/main.rs`和`src/lib.rs`，那么它就有两个`crate`。
- 如果想要有**多个二进制**`crate`,rust约定需要将文件放在`src/bin`目录下，每个文件就是一个单独的`crate`。
- `crate根`用来描述如何构建`crate`的文件。比如`src/main.rs`或者`src/lib.rs`就是`crate根`。`crate根`文件将由`Cargo`传递给`rustc`来实际构建**库**/**二进制项目**

## 模块(mod)

`use`，`mod`，`pub`，`use`，`super`;

- 模块系统来控制作用域和私有性。

### 路径引用模块

- **绝对路径**：从包根开始，路径名以包名或者crate作为开头。
- **相对路径**：从当前模块开始，以`self`，`super`或当前模块的标识符开头。

### 结构体和枚举的可见性

- 结构体设为`pub`，它所有字段依然是私有的。
- 枚举设为`pub`，它所有字段对外可见。

因为结构体和枚举的使用方式不一样，枚举的成员对外不可见，枚举将毫无作用。结构体应用场景复杂，字段可能部分在A处被使用，部分在B处被使用，因此无法确定成员的可见性。



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