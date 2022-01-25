// 根据传入的数字，数字中各个位可以换位置，判断，是否有一个值是2的幂次方
// 12 => 12, 21   false
// 46 => 46, 64   true

// 分解问题：
// 1: 处理数字中的重复字符
// 2: 判断数字是2的幂次方
// 3: 数字不能以0开头
// 4: 1也是2的0次方

// 2 的 n 次方 二进制规律：最高位是1，其余位是0
function combination(num) {
    let strArray = String(num).split(''),
        result = combination2(strArray);

    let has = false;
    for (let value of result) {
        if (is(Number(value))) {
            has = true;
            break;
        }
    }
    return has;
}

// 1期望得到 true 2^0 = 1
// 2的次方, 二进制的首位是1,剩余位是0   (n & (n-1)) == 0
function is(num) {
    return num > 0 && (num & (num - 1)) == 0;
}

// 全排列
function combination2(arr) {
    let result = [],
        used = [];
    arr.sort((a, b) => a - b);
    function next(str) {
        if (str[0] == 0) {
            return;
        }
        if (str.length == arr.length) {
            result.push(str);
        }
        for (let index in arr) {
            if (used[index]) {
                continue;
            }
            if (
                index - 1 >= 0 &&
                arr[index] == arr[index - 1] &&
                used[index - 1]
            ) {
                continue;
            }
            used[index] = true;
            next(str + arr[index]);
            used[index] = false;
        }
    }
    next('');
    return result;
}
