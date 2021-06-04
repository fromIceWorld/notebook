const fs = require('fs');

import * as ts from 'typescript';
import { SyntaxKind } from './enums';
const scanner = ts.createScanner(ts.ScriptTarget.Latest, /* 忽略杂项 */ true);
// 此函数与初始化使用的 `initializeState` 函数相似
function initializeState(text: string) {
    scanner.setText(text);
    scanner.setOnError((message: ts.DiagnosticMessage, length: number) => {
        console.error(message);
    });
    scanner.setScriptTarget(ts.ScriptTarget.Latest);
    scanner.setLanguageVariant(ts.LanguageVariant.Standard);
}
// 使用示例
initializeState(
    `
  var foo:number = 123,age:number = 9;
  `.trim()
);
console.log('---------------扫描器(string -> token)------\n');
var token = scanner.scan();
while (token != ts.SyntaxKind.EndOfFileToken) {
    let start = scanner.getStartPos();
    token = scanner.scan();
    let end = scanner.getStartPos();
    console.log(SyntaxKind[token], start, end);
}
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
    console.log(res);
    return res;
}
// ---------------解析器

const types = ['ClassKeyword', 'Decorator', 'ImportDeclaration'];
const container = [];
console.log('---------------解析器(string -> token -> ast)------\n');
function printAllChildren(node: ts.Node, depth = 0) {
    if (types.includes(SyntaxKind[node.kind])) {
        if (SyntaxKind[node.kind] == 'ImportDeclaration') {
            const res = searchChildToken(node, [
                SyntaxKind.ImportClause,
                SyntaxKind.StringLiteral,
            ]);
            let output;
            if (res[1] == "'tui-iframe'") {
                res[0] = '{cbbEdit}';
                output = 'import ' + res[0] + 'from' + res[1];
                console.log(res);
                fs.writeFileSync('out.ts', output, {
                    encoding: 'utf8',
                });
            }
        }
        container.push(node.getText());
        // consoleAll(node);
    }
    container.push(node.getText());

    depth++;
    node.getChildren().forEach((c) => printAllChildren(c, depth));
}

var sourceCode = fs.readFileSync('origin.ts', 'utf8');

var sourceFile = ts.createSourceFile(
    'foo.ts',
    sourceCode,
    ts.ScriptTarget.ES5,
    true
);
printAllChildren(sourceFile);
// fs.writeFileSync('out.ts', container.join('----'), { encoding: 'utf8' });
