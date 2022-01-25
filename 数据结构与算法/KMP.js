// KMP 算法

// next数组
// next[i]:p[0]p[i] 中匹配的前缀，后缀串的最大长度
/**
 *
 * @param {*} p 模式串
 */
function createNext(p) {
    let next = [-1],
        i = 0,
        j = -1;
    while (i < p.length) {
        if (j == -1 || p[i] == p[j]) {
            j++;
            i++;
            next[i] = j;
        } else {
            j = next[j];
        }
    }
    return next;
}

// 686.重复叠加字符串匹配
/**
 *
 * @param {主串} s
 * @param {模式串} p
 */
function getMatch(s, p) {
    let next = createNext(p),
        box = [];
    let from = 0,
        end = s.length - p.length;
    while (from <= end) {
        let { result, f } = match(from, from + p.length);
        if (result) {
            box.push(from);
            from++;
        } else {
            from += next[f];
        }
    }
    return box;
    function match(f, e) {
        let result = true,
            i = 0;
        while (f < e) {
            if (s[f] == p[i]) {
                f++;
                i++;
            } else {
                break;
            }
        }
        return {
            result,
            f,
        };
    }
}
