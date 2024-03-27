/**
 * 给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。
 */

/**
 * 示例 1:

    输入: s = "abcabcbb"
    输出: 3 
    解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。

示例 2:
    输入: s = "bbbbb"
    输出: 1
    解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。

示例 3:
    输入: s = "pwwkew"
    输出: 3
    解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
      请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。

示例 4:
    输入: s = ""
    输出: 0

 */

/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
    let cache = new Set(),
        left = 0,
        right = 1,
        result = 0;
    if (s.length == 0) {
        return 0;
    }
    if (s.length == 1) {
        return 1;
    }
    if (s.length < 2) {
        cache.add(s[0]);
        cache.add(s[1]);
        return cache.size;
    }
    cache.add(s[0]);
    cache.add(s[1]);
    if (cache.size == 1) {
        left++;
    }
    right++;
    result = Math.max(result, cache.size);
    while (left < s.length && right < s.length) {
        if (cache.has(s[right])) {
            let out = s[left];
            while (out !== s[right]) {
                cache.delete(s[left]);
                left++;
                out = s[left];
            }
            left++;
        } else {
            cache.add(s[right]);
        }
        right++;
        result = Math.max(result, cache.size);
    }
    return result;
};
