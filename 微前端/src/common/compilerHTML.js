/**
 * @param String // <tag key="val" defer>
 * @return [
 *      1: tag
 *      2: src = "**" defer
 * ]
 */
let regTag = /\<([a-z]+)\s+((([a-z]+)\=(\'[^']+\'|\"[^"]+\")\s*|[a-z]+)+)/;
function splitDOM(innerHtml) {
    let node = {
        tag: '',
        attrs: [],
    };
    let group = regTag.exec(innerHtml);
    node['tag'] = group[1];
    let arrbutesKV = group[2].split(' '),
        targetKV = [];
    for (let kvString of arrbutesKV) {
        let [k, v] = kvString.split('=');
        targetKV[0] = k;
        targetKV[1] = v ? v.slice(1, -1) : undefined;
        node['attrs'].push([...targetKV]);
    }
    return node;
}
