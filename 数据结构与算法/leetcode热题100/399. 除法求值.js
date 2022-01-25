/**
 * 
 * 给你一个变量对数组 equations 和一个实数值数组 values 作为已知条件，其中 equations[i] = [Ai, Bi] 和 values[i] 共同表示等式 Ai / Bi = values[i] 。
 * 每个 Ai 或 Bi 是一个表示单个变量的字符串。另有一些以数组 queries 表示的问题，其中 queries[j] = [Cj, Dj] 表示第 j 个问题，
 * 请你根据已知条件找出 Cj / Dj = ? 的结果作为答案。
 * 返回 所有问题的答案 。如果存在某个无法确定的答案，则用 -1.0 替代这个答案。如果问题中出现了给定的已知条件中没有出现的字符串，也需要用 -1.0 替代这个答案。
 * 
 * 注意：输入总是有效的。你可以假设除法运算中不会出现除数为 0 的情况，且不存在任何矛盾的结果。

 */
/**
 * @param {string[][]} equations
 * @param {number[]} values
 * @param {string[][]} queries
 * @return {number[]}
 */
var calcEquation = function (equations, values, queries) {
    let map = new Map();
    for (let i = 0; i < equations.length; i++) {
        // a / b
        let val = map.get(equations[i][0]);
        if (val) {
            val[equations[i][1]] = values[i];
        } else {
            let obj = {};
            obj[equations[i][1]] = values[i];
            map.set(equations[i][0], obj);
        }
        // b/a
        let va2 = map.get(equations[i][1]);
        if (va2) {
            va2[equations[i][0]] = 1 / values[i];
        } else {
            let obj = {};
            obj[equations[i][0]] = 1 / values[i];
            map.set(equations[i][1], obj);
        }
    }
    let result = [];
    for (let i = 0; i < queries.length; i++) {
        let cache = {};
        cache[queries[i][0]] = true;
        let target = deep(queries[i][0], queries[i][1], cache);
        if (target !== -1) {
            result.push(target);
        } else {
            cache = {};
            cache[queries[i][1]] = true;
            result.push(1 / deep(queries[i][1], queries[i][0], cache));
        }
    }
    return result;
    function deep(key, key2, cache) {
        // 相等
        if (map.get(key) && key == key2) {
            return 1;
        }
        let next = map.get(key);
        if (next) {
            if (next[key2]) {
                return next[key2];
            } else {
                let keys = Object.keys(next);
                for (let i = 0; i < keys.length; i++) {
                    if (!cache[keys[i]]) {
                        cache[keys[i]] = true;
                        let nextVal = deep(keys[i], key2, cache);
                        if (nextVal !== -1) {
                            return nextVal * next[keys[i]];
                        } else {
                            return -1;
                        }
                    }
                }
                return -1;
            }
        } else {
            return -1;
        }
    }
};
