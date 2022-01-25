/**
 *
 *
 * 给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。
 * 请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。
 */

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function (nums, k) {
    class MaxDeap {
        constructor(count) {
            this.cache = [];
            this.count = count;
        }
        insert(item) {
            this.cache.push(item);
            this.sort();
            if (this.cache.length > this.count) {
                this.cache.shift();
                this.sort();
            }
        }
        sort() {
            for (let i = 0; i < Math.floor(this.cache.length / 2); i++) {
                // 判定是否有右子节点
                if (2 * i + 2 < this.cache.length) {
                    if (
                        this.cache[i] > this.cache[2 * i + 1] ||
                        this.cache[i] > this.cache[2 * i + 2]
                    ) {
                        if (this.cache[2 * i + 1] > this.cache[2 * i + 2]) {
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
                    if (this.cache[i] > this.cache[2 * i + 1]) {
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
    let deap = new MaxDeap(k);
    for (let i = 0; i < nums.length; i++) {
        deap.insert(nums[i]);
    }
    return deap.cache[0];
};

// 快排解决
var findKthLargest = function (nums, k) {
    let from = 0,
        end = nums.length - 1,
        result;
    compare(from, end);
    return result;
    function compare(i, j) {
        let o = i,
            p = j,
            origin = 'i';
        while (o < p) {
            if (origin == 'i') {
                if (nums[o] < nums[p]) {
                    [nums[o], nums[p]] = [nums[p], nums[o]];
                    origin = 'j';
                    o++;
                } else {
                    p--;
                }
            } else {
                if (nums[o] < nums[p]) {
                    [nums[o], nums[p]] = [nums[p], nums[o]];
                    origin = 'i';
                    p--;
                } else {
                    o++;
                }
            }
        }
        if (o == k - 1) {
            result = nums[o];
            return;
        } else if (o < k - 1) {
            compare(o + 1, j);
        } else {
            compare(i, o - 1);
        }
    }
};
