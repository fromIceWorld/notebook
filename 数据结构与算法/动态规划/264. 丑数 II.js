/**
 *
 * 给你一个整数 n ，请你找出并返回第 n 个 丑数 。
 * 丑数 就是只包含质因数 2、3 和/或 5 的正整数。
 */

/**
 * @param {number} n
 * @return {number}
 */
var nthUglyNumber = function (n) {
    let box = [1],
        two = 0,
        three = 0,
        five = 0;
    while (box.length < n) {
        let next,
            nextTwo = box[two] * 2,
            nextThree = box[three] * 3,
            nextFive = box[five] * 5;
        if (nextTwo <= nextThree && nextTwo <= nextFive) {
            two++;
            next = nextTwo;
        } else if (nextThree <= nextTwo && nextThree <= nextFive) {
            three++;
            next = nextThree;
        } else {
            five++;
            next = nextFive;
        }
        if (next !== box[box.length - 1]) {
            box.push(next);
        }
    }
    return box[box.length - 1];
};
