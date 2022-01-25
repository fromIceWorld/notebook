// 双指针，指向start，end，当想要取得更大值时，只能 较低的柱子移动
function max(height) {
    let start = 0,
        end = height.length - 1;
    let max = 0;
    while (start < end) {
        max = Math.max(
            Math.min(height[start], height[end]) * (end - start),
            max
        );
        if (height[start] > height[end]) {
            end--;
        } else {
            start++;
        }
    }
    return max;
}

/**
 * 
 * 
 * 
 * let resource = [4, 2, 7, 9, 2, 6, 12, 5, 1],
    L = 0,
    R = resource.length - 1,
    cache = 0;
while (L < R) {
    cache = Math.max(cache, Math.min(resource[L], resource[R]) * (R - L));
    if (resource[L] > resource[R]) {
        R--;
    } else {
        L++;
    }
}
 */
