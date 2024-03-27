/**
 * 假设有 n 台超级洗衣机放在同一排上。开始的时候，每台洗衣机内可能有一定量的衣服，也可能是空的。
 * 在每一步操作中，你可以选择任意 m (1 <= m <= n) 台洗衣机，与此同时将每台洗衣机的一件衣服送到相邻的一台洗衣机。
 * 给定一个整数数组 machines 代表从左至右每台洗衣机中的衣物数量，
 * 请给出能让所有洗衣机中剩下的衣物的数量相等的 最少的操作步数 。如果不能使每台洗衣机中衣物的数量相等，则返回 -1 。
 */
// 每一次移动，可选择任意台洗衣机，移动到相邻洗衣机
// 以某个洗衣机为界，左侧需要的衣服个数:left = target*(i+1) - sum,右侧需要的衣服个数:right = total - left；
// 移动的衣服数ans: Math.max(left, right)

/**
 * @param {number[]} machines
 * @return {number}
 */
var findMinMoves = function (arr) {
    let total = arr.reduce((pre, cur) => pre + cur, 0),
        len = arr.length;
    // 不可均分
    if (total % len !== 0) {
        return -1;
    }
    let ans = 0,
        left = 0,
        right = total,
        target = total / len;
    for (let i = 0; i < len; i++) {
        right -= arr[i];
        let a = Math.max(target * i - left, 0);
        let b = Math.max(target * (len - i - 1) - right, 0);
        ans = Math.max(ans, a + b);
        left += arr[i];
    }
    return ans;
};
