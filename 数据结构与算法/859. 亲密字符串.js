// 给你两个字符串 s 和 goal ，只要我们可以通过交换 s 中的两个字母得到与 goal 相等的结果，就返回 true ；否则返回 false 。

// 交换字母的定义是：取两个下标 i 和 j （下标从 0 开始）且满足 i != j ，接着交换 s[i] 和 s[j] 处的字符。

// 例如，在 "abcd" 中交换下标 0 和下标 2 的元素可以生成 "cbad" 。

// 遍历字符串,第一次不同,存储下来,第二次不同,与存储值进行比较,一直遍历到最后,[有两次不同,且可交换]
// 需考虑 'aa'和 'aa'
/**
 * @param {string} s
 * @param {string} goal
 *
 * @return {boolean}
 */
var buddyStrings = function (s, goal) {
    // 长度不等,或者 <=一个元素
    if (s.length !== goal.length || s.length <= 1) {
        return false;
    }
    let diffA = '',
        diffB = '',
        count = 0,
        set = new Set(),
        same = false;
    for (let i = 0, end = s.length - 1; i <= end; i++) {
        // 不同
        if (s[i] !== goal[i]) {
            if (count == 0) {
                count++;
                diffA = s[i];
                diffB = goal[i];
            } else if (count == 1) {
                if (diffA == goal[i] && diffB == s[i]) {
                    count++;
                } else {
                    count = 3;
                    break;
                }
            } else if (count == 2) {
                count = 3;
                break;
            }
        } else {
            if (set.has(s[i])) {
                same = true;
            } else {
                set.add(s[i]);
            }
        }
    }
    return count == 2 || (count == 0 && same);
};
