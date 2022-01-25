/**
 * 假设有 n 台超级洗衣机放在同一排上。开始的时候，每台洗衣机内可能有一定量的衣服，也可能是空的。
 * 在每一步操作中，你可以选择任意 m (1 <= m <= n) 台洗衣机，与此同时将每台洗衣机的一件衣服送到相邻的一台洗衣机。
 * 给定一个整数数组 machines 代表从左至右每台洗衣机中的衣物数量，
 * 请给出能让所有洗衣机中剩下的衣物的数量相等的 最少的操作步数 。如果不能使每台洗衣机中衣物的数量相等，则返回 -1 。
 */
// 每一次移动，可选择任意台洗衣机，移动到相邻洗衣机
// 以某个洗衣机为界，左侧需要的衣服个数:left = target*(i+1) - sum,右侧需要的衣服个数:right = total = left；
// 移动的衣服数ans: Math.math(left, right)

function need(arr) {
    let total = 0,
        len = arr.length;
    for (let i = 0; i < len; i++) {
        total += arr[i];
    }
    if (total / len > 1 && total % len == 0) {
        let ans = 0,
            left = 0,
            target = total / len;
        for (let i = 0; i < len; i++) {
            left += arr[i];
            let a = Math.max(target * (i + 1) - left, 0);
            let b = Math.max(total - (target * (i + 1) - left), 0);
            ans = Math.max(ans, Math.max(a, b));
        }
        return ans;
    }
    return -1;
}
