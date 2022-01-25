/**
 * 
 * 
 * 以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。
 * 请你合并所有重叠的区间，并返回一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间。


 */

/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function (intervals) {
    intervals.sort((a, b) => a[0] - b[0]);
    let from = intervals[0][0],
        end = intervals[0][1],
        result = [];
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] > end) {
            result.push([from, end]);
            from = intervals[i][0];
            end = intervals[i][1];
        } else if (
            intervals[i][0] >= from &&
            intervals[i][0] <= end &&
            intervals[i][1] >= end
        ) {
            end = intervals[i][1];
        }
    }
    result.push([from, end]);
    return result;
};
