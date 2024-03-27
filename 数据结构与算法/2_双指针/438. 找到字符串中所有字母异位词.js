// 给定两个字符串 s 和 p，找到 s 中所有 p 的 异位词 的子串，返回这些子串的起始索引。不考虑答案输出的顺序。
// 异位词 指由相同字母重排列形成的字符串（包括相同的字符串）。
/**
 * 示例 1:
        输入: s = "cbaebabacd", p = "abc"
        输出: [0,6]
        解释:
        起始索引等于 0 的子串是 "cba", 它是 "abc" 的异位词。
        起始索引等于 6 的子串是 "bac", 它是 "abc" 的异位词。
 * 
 * 
 * 
 */
// 解法1：

//  以from, end 为双指针，cache 存储 from->end的 字符，
//  以 from - end 的距离为标志位当 from -end 大小 与target.size 相等时判断
//  当 cache 小于 target 的size 时，end右移， 判断 end对应的 str 是否在target中，在 就cache存储，不在的话判断sise 大小
// 当 cache 和 target 的 size 相等时，  判断

// 误区**： 不能用set存储，因为在假如p有 相同的字符，无法判断；可使用数组记录每个字母对应的个数
/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function (s, p) {
    let sLength = s.length,
        pLength = p.length,
        result = [];
    if (sLength < pLength) {
        return [];
    }
    let sArray = new Array(26).fill(0),
        pArray = new Array(26).fill(0);
    let aAt = 'a'.charCodeAt();
    for (let i = 0; i < pLength; i++) {
        pArray[p[i].charCodeAt() - aAt]++;
        sArray[s[i].charCodeAt() - aAt]++;
    }
    if (sArray.join('') == pArray.join('')) {
        result.push(0);
    }
    for (let i = 0; i < sLength - pLength; i++) {
        sArray[s[i].charCodeAt() - aAt]--;
        sArray[s[i + pLength].charCodeAt() - aAt]++;
        if (sArray.join('') == pArray.join('')) {
            result.push(i + 1);
        }
    }
    return result;
};
