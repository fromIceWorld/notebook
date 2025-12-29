#### 排序

##### 冒泡🫧排序

```rust
fn sort(arr: &mut [i32]) {
    for i in 0..arr.len() - 1 {
        for j in 0..arr.len() - 1 - i {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
            }
        }
    }
}
```
优化
每次确认最后处理的位置，减少无效对比次数
```rust
fn sort(arr: &mut [i32]) {
  let mut n = arr.len();
  while n > 0 {
    let last = 0;
    for i in 1..n {
      if arr[i] < arr[i - 1] {
        arr.swap(i, i-1);
        last = i;
      }
    }
    n = last;
  }
}
```
##### 桶🪣排序
```rust
二维数据存储桶
fn bucket_sort(arr: &[u32]) -> Vec<u32> {
    let mut cache: Vec<Vec<u32>> = vec![vec![0; 10]; 10];
    // 存储到🪣
    for &num in arr {
        let x = num / 10;
        let y = num % 10;
        cache[x as usize][y as usize] += 1;
    }
    let mut result: Vec<u32> = Vec::with_capacity(arr.len());
    for x in 0..10 {
        for y in 0..10 {
            let count = cache[x][y];
            let value = (x * 10 + y) as u32;
            result.extend(std::iter::repeat(value).take(count as usize));
        }
    }
    result
}
```

