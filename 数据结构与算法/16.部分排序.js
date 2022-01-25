function find(array) {
    let end = array.length - 1,
        result = [-1, -1],
        max = array[0],
        min = array[end];
    for (let i = 0; i <= end; i++) {
        if (array[i] < max) {
            result[1] = i;
        }
        max = Math.max(array[i], max);
    }
    for (let i = end; i >= 0; i--) {
        if (array[i] > min) {
            result[0] = i;
        }
        min = Math.min(array[i], min);
    }
    return result;
}
