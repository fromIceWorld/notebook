// 给定一个正整数 n ，你可以做如下操作：
// 如果 n 是偶数，则用 n / 2替换 n 。
// 如果 n 是奇数，则可以用 n + 1或n - 1替换 n 。 【当n是js可表达的最大值时,n+1 会超出限制，因此需要使用其他值替代】

// (n+1)/2   => Math.floor(n /2) +1 因为 n+1的偶数可能超出范围，因此可以直接（n/2）取整 +1 ，这样和（n+1）/2 需要的次数一样
// (n-)/2  => Math.floor(n/2)

// n 变为 1 所需的最小替换次数是多少？
/**
 * @param {number} n
 * @return {number}
 */
var integerReplacement = function (n) {
    if (n == 1) {
        return 0;
    }
    if (n & 1) {
        // 奇数
        return (
            //
            Math.min(
                integerReplacement(Math.floor(n / 2)),
                integerReplacement(Math.floor(n / 2) + 1)
            ) + 2
        );
    }
    return integerReplacement(n / 2) + 1;
};
