// 给定一个升序数组，找到target在数组中第一次出现的位置，
// 和最后出现的位置返回[index1， inde2]，没有就返回[-1, -1]
let resource = [0, 1, 2, 3, 5, 5, 5, 5, 5, 6, 7, 8, 9],
    target = 5,
    result = [-1, -1];
function binarySearch(num, target, start, end) {
    if (start <= end) {
        let mid = Math.floor((end + start) / 2);
        if (num[mid] > target) {
            binarySearch(num, target, start, mid - 1);
        } else if (num[mid] < target) {
            binarySearch(num, target, mid + 1, end);
        } else {
            result[0] = result[0] == -1 ? mid : Math.min(result[0], mid);
            result[1] = result[1] == -1 ? mid : Math.max(result[1], mid);
            binarySearch(num, target, start, mid - 1);
            binarySearch(num, target, mid + 1, end);
        }
    }
}
