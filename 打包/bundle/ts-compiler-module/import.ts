const ts = require('typescript'),
    fs = require('fs');

// 查找特定的token节点
function searchChildToken(node, kinds: Array<number>) {
    let index,
        res = [];
    function go(node) {
        if ((index = kinds.indexOf(node.kind)) > -1) {
            res[index] = node.getText();
        } else {
            node.getChildren().forEach((child) => {
                go(child);
            });
        }
    }
    go(node);
    return res;
}
// 深度遍历 node,替换 import【from】
function printAllChildren(node, result) {
    if (ts.SyntaxKind[node.kind] == 'ImportDeclaration') {
        const res = searchChildToken(node, [
            ts.SyntaxKind.ImportClause,
            ts.SyntaxKind.StringLiteral,
        ]);
        res[1][0] = "'@WEB_ES_Modules";
        result += 'import' + res[0] + 'from ' + res[1][0] + ';';
    } else {
        result += node.getText();
    }
    return result;
}

function replaceImport(
    fileName,
    target = ts.ScriptTarget.ES2015,
    setNodeParents = true
) {
    let result = '',
        sourceCode = fs.readFileSync(fileName, 'utf-8'),
        sourceFile = ts.createSourceFile(
            fileName,
            sourceCode,
            target,
            setNodeParents
        );
    sourceFile.statements.forEach((statement) => {
        result = printAllChildren(statement, result);
    });
    return {
        result,
        fileName: sourceFile.name,
    };
}

export { replaceImport };
