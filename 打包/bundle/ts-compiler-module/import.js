'use strict';
exports.__esModule = true;
exports.replaceImport = void 0;
var ts = require('typescript'),
    fs = require('fs');
// 查找特定的token节点
function searchChildToken(node, kinds) {
    var index,
        res = [];
    function go(node) {
        if ((index = kinds.indexOf(node.kind)) > -1) {
            res[index] = node.getText();
        } else {
            node.getChildren().forEach(function (child) {
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
        var res = searchChildToken(node, [
            ts.SyntaxKind.ImportClause,
            ts.SyntaxKind.StringLiteral,
        ]);
        res[1] = res[1].replace(/^'/, "'@WEB_ES_Modules");
        result += 'import' + res[0] + 'from ' + res[1][0] + ';';
    } else {
        result += node.getText();
    }
    return result;
}
function replaceImport(fileName, target, setNodeParents) {
    if (target === void 0) {
        target = ts.ScriptTarget.ES2015;
    }
    if (setNodeParents === void 0) {
        setNodeParents = true;
    }
    var result = '',
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
        fileName: sourceFile.fileName,
    };
}
exports.replaceImport = replaceImport;
