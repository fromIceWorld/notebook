// 最长回文子串
function maxString(str) {
    let result = '',
        len = 0;
    for (let i = 0, end = str.length - 1; i <= end; i++) {
        max(i, i);
        max(i, i + 1);
    }
    function max(index, next) {
        let max = 0;
        if (index == next) {
            max = 1;
            let left = index - 1,
                right = next + 1;
            while (left >= 0 && right < str.length && str[left] == str[right]) {
                max = Math.max(right - left + 1, max);
                left--;
                right++;
            }
            if (max > len) {
                result = str.slice(left + 1, right);
                len = max;
            }
        } else {
            if (str[index] == str[next]) {
                max = 2;
                let left = index - 1,
                    right = next + 1;
                while (left >= 0 && right < str.length && str[left] == str[right]) {
                    max = Math.max(right - left + 1, max);
                    left--;
                    right++;
                }
                if (max > len) {
                    result = str.slice(left + 1, right);
                    len = max;
                }
            }
        }
    }
    return result;
}
