/**
 * 给你一个整数数组 nums 和一个整数 k ，请你返回其中出现频率前 k 高的元素。你可以按 任意顺序 返回答案。
 *
 */
/**
 * 
示例 1:
    输入: nums = [1,1,1,2,2,3], k = 2
    输出: [1,2]

示例 2:
    输入: nums = [1], k = 1
    输出: [1]
 */

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function (nums, k) {
    class minDeap {
        constructor(n, arr) {
            this.n = n;
            this.cache = [];
            this.map = new Map();
            this.insert(arr);
        }
        insert(arr) {
            for (let i = 0; i < arr.length; i++) {
                let count = this.map.get(arr[i]);
                if (count) {
                    this.map.set(arr[i], count + 1);
                } else {
                    this.map.set(arr[i], 1);
                    this.cache.push(arr[i]);
                }
            }
        }
        sort() {
            for (let i = 0; i < Math.floor(this.cache.length / 2); i++) {
                let mid = this.map.get(this.cache[i]),
                    left = this.map.get(this.cache[2 * i + 1]),
                    right = this.map.get(this.cache[2 * i + 2]);
                if (right) {
                    if (mid > left || mid > right) {
                        if (left > right) {
                            [this.cache[i], this.cache[2 * i + 2]] = [
                                this.cache[2 * i + 2],
                                this.cache[i],
                            ];
                        } else {
                            [this.cache[i], this.cache[2 * i + 1]] = [
                                this.cache[2 * i + 1],
                                this.cache[i],
                            ];
                        }
                        this.sort();
                    }
                } else {
                    if (mid > left) {
                        [this.cache[i], this.cache[2 * i + 1]] = [
                            this.cache[2 * i + 1],
                            this.cache[i],
                        ];
                        this.sort();
                    }
                }
            }
        }
    }
    let deap = new minDeap(k, nums);
    while (deap.cache.length > k) {
        deap.sort();
        deap.cache.shift();
    }
    return deap.cache;
};
