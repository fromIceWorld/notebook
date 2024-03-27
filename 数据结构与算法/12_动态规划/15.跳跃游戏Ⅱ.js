var jump = function (nums) {
    let result = 0,
        currentMax = 0,
        max = 0;
    for (let i = 0; i < nums.length - 1; i++) {
        max = Math.max(i + nums[i], max);
        if (currentMax == i) {
            currentMax = max;
            result++;
        }
    }
    return result;
};
