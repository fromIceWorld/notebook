function nextGreaterElement(nums1, nums2) {
    let nextMap = new Map(),
        stack = [];
    for (let right = nums2.length - 1, left = 0; right >= left; right--) {
        if (stack.length == 0) {
            stack.push(nums2[right]);
            nextMap.set(nums2[right], -1);
        } else {
            nextMap.set(nums2[right], getByStack(nums2[right], stack));
        }
    }
    for (let i = 0, end = nums1.length - 1; i <= end; i++) {
        nums1[i] = nextMap.get(nums1[i]);
    }
    return nums1;
}
function getByStack(target, stack) {
    if (stack.length == 0) {
        stack.push(target);
        return -1;
    } else {
        if (stack[stack.length - 1] > target) {
            stack.push(target);
            return stack[stack.length - 2];
        } else {
            stack.pop();
            return getByStack(target, stack);
        }
    }
}
