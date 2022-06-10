function matchCssJsSttyle(arr = []) {
    let css = [],
        style = [],
        js = [];
    arr.forEach((link) => {
        let type = link.match(/^\<([a-z]+)\s+/)[1];
        switch (type) {
            case 'link':
                css.push(link);
                break;
            case 'style':
                style.push(link);
                break;
            case 'script':
                js.push(link);
        }
    });
    console.log(css, style, js);
}
function compilerHTML(str) {
    str.match(/^\<([a-z]+)\s+([^<]+)/);
}
function attempTag() {}
