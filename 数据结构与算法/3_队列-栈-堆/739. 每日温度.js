/**
 * 请根据每日 气温 列表 temperatures ，请计算在每一天需要等几天才会有更高的温度。
 * 如果气温在这之后都不会升高，请在该位置用 0 来代替。
 */
/**
 * 示例 1:
    输入: temperatures = [73,74,75,71,69,72,76,73]
    输出: [1,1,4,2,1,1,0,0]

示例 2:
    输入: temperatures = [30,40,50,60]
    输出: [1,1,1,0]

示例 3:
    输入: temperatures = [30,60,90]
    输出: [1,1,0]


 */

/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
var dailyTemperatures = function (temperatures) {
    let result = [];
    for (let i = temperatures.length - 1; i >= 0; i--) {
        let index = i + 1,
            count = 0;
        while (index < temperatures.length) {
            if (temperatures[index] > temperatures[i]) {
                count++;
                break;
            } else {
                index++;
                if (index < temperatures.length) {
                    count++;
                }
            }
        }
        result[i] = count;
    }
    return result;
};
