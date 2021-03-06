## 模板解析

```typescript
`核心`：将模板编译成可以创建视图和更新视图的JS代码，相较于将模板交给浏览器，可以支持跨平台，服务端渲染，模板静态检查，及更多的扩展语法；

`view` 由 `template`[模板] 和 `class`组成。   

将组件编译后会形成【CompiledTemplate实例】
view:{
    _viewClass：view函数,
    compType:组件类【class】
    compMeta:组件的元数据【template，变更检查方式，选择器，生命周期....】
    directives:基础指令及自定义指令。
}

`ngfactory 节点为什么要编译成一维的`
```

组件中的 template解析【1-bootstrapModuleFactory/ 2.1.1.3-loadDirectiveMetadata】中的 `templateMeta`

```typescript
	  const template = metadata.template !;
      const templateMeta = this._directiveNormalizer.normalizeTemplate({
        ngModuleType,
        componentType: directiveType,
        moduleUrl: this._reflector.componentModuleUrl(directiveType, annotation),
        encapsulation: template.encapsulation,
        template: template.template,
        templateUrl: template.templateUrl,
        styles: template.styles,
        styleUrls: template.styleUrls,
        animations: template.animations,
        interpolation: template.interpolation,
        preserveWhitespaces: template.preserveWhitespaces
      });
```

### _directiveNormalizer【DirectiveNormalizer类】

#### normalizeTemplate

```typescript
  normalizeTemplate(prenormData: PrenormalizedTemplateMetadata):
      SyncAsync<CompileTemplateMetadata> {
      ....
      判定 template 和 templateUrl 格式为string，有且只能有一个;
      preserveWhitespaces必须是 boolean 类型;
      否则报错

    return SyncAsync.then(
        this._preParseTemplate(prenormData),
        (preparsedTemplate) => this._normalizeTemplateMetadata(prenormData, preparsedTemplate));
  }
1-`preparsedTemplate是_preParseTemplate返回值`{
      template,
      templateUrl: templateAbsUrl,
      isInline,
      htmlAst: rootNodesAndErrors,
      styles,
      inlineStyleUrls,
      styleUrls,
      ngContentSelectors: visitor.ngContentSelectors,
}
2-`运行this._normalizeTemplateMetadata`
```

##### 1-_preParseTemplate

```typescript
  private _preParseTemplate(prenomData: PrenormalizedTemplateMetadata):
      SyncAsync<PreparsedTemplate> {
    let template: SyncAsync<string>;
    let templateUrl: string;
    if (prenomData.template != null) {
      template = prenomData.template;
      templateUrl = prenomData.moduleUrl;
    } else {
      templateUrl = this._urlResolver.resolve(prenomData.moduleUrl, prenomData.templateUrl!);
      template = this._fetch(templateUrl);
    }
    return SyncAsync.then(
        template, (template) => this._preparseLoadedTemplate(prenomData, template, templateUrl));
  }
```

##### 1.1_preparseLoadedTemplate

```typescript
  private _preparseLoadedTemplate(
      prenormData: PrenormalizedTemplateMetadata, template: string,
      templateAbsUrl: string): PreparsedTemplate {
    const isInline = !!prenormData.template; //标志位，是否是行内模板
    const interpolationConfig = InterpolationConfig.fromArray(prenormData.interpolation!);//插值格式
      //返回路径： `ng:///模块名称/组件名称.html` 【附录templateSourceUrl】
    const templateUrl = templateSourceUrl(
        {reference: prenormData.ngModuleType}, {type: {reference: prenormData.componentType}},
        {isInline, templateUrl: templateAbsUrl});
      //【附录HtmlParser】返回值{rootNodes,errors}
    const rootNodesAndErrors = this._htmlParser.parse(
        template, templateUrl, {tokenizeExpansionForms: true, interpolationConfig});
    if (rootNodesAndErrors.errors.length > 0) {
      const errorString = rootNodesAndErrors.errors.join('\n');
      throw syntaxError(`Template parse errors:\n${errorString}`);
    }
	//模板元数据的样式styles
    const templateMetadataStyles = this._normalizeStylesheet(new CompileStylesheetMetadata(
        {styles: prenormData.styles, moduleUrl: prenormData.moduleUrl}));
	//模板访问者实例【附录TemplatePreparseVisitor】
    const visitor = new TemplatePreparseVisitor();
      //附录【visitAll】循环处理rootNodes
    html.visitAll(visitor, rootNodesAndErrors.rootNodes);
    const templateStyles = this._normalizeStylesheet(new CompileStylesheetMetadata(
        {styles: visitor.styles, styleUrls: visitor.styleUrls, moduleUrl: templateAbsUrl}));

    const styles = templateMetadataStyles.styles.concat(templateStyles.styles);

    const inlineStyleUrls = templateMetadataStyles.styleUrls.concat(templateStyles.styleUrls);
    const styleUrls = this
                          ._normalizeStylesheet(new CompileStylesheetMetadata(
                              {styleUrls: prenormData.styleUrls, moduleUrl: prenormData.moduleUrl}))
                          .styleUrls;
    return {
      template,
      templateUrl: templateAbsUrl,
      isInline,
      htmlAst: rootNodesAndErrors,//节点数组【附录HtmlParser】
      styles,
      inlineStyleUrls,
      styleUrls,
      ngContentSelectors: visitor.ngContentSelectors,
    };
  }
```

##### 2-_normalizeTemplateMetadata

```typescript
@params prenormData
@params preparsedTemplate:【1.1返回值】  

private _normalizeTemplateMetadata(
      prenormData: PrenormalizedTemplateMetadata,
      preparsedTemplate: PreparsedTemplate): SyncAsync<CompileTemplateMetadata> {
    return SyncAsync.then(
        this._loadMissingExternalStylesheets(
            preparsedTemplate.styleUrls.concat(preparsedTemplate.inlineStyleUrls)),
        (externalStylesheets) => this._normalizeLoadedTemplateMetadata(
            prenormData, preparsedTemplate, externalStylesheets));
  }
返回：
return new CompileTemplateMetadata({
      encapsulation,
      template: preparsedTemplate.template,
      templateUrl: preparsedTemplate.templateUrl,
      htmlAst: preparsedTemplate.htmlAst,
      styles,
      styleUrls,
      ngContentSelectors: preparsedTemplate.ngContentSelectors,
      animations: prenormData.animations,
      interpolation: prenormData.interpolation,
      isInline: preparsedTemplate.isInline,
      externalStylesheets,
      preserveWhitespaces: preserveWhitespacesDefault(
          prenormData.preserveWhitespaces, this._config.preserveWhitespaces),
    });
} 
```



### 附录

#### templateSourceUrl

```typescript
export function templateSourceUrl(
    ngModuleType: CompileIdentifierMetadata, compMeta: {type: CompileIdentifierMetadata},
    templateMeta: {isInline: boolean, templateUrl: string|null}) {
  let url: string;
  if (templateMeta.isInline) {
    if (compMeta.type.reference instanceof StaticSymbol) {
      // Note: a .ts file might contain multiple components with inline templates,
      // so we need to give them unique urls, as these will be used for sourcemaps.
      url = `${compMeta.type.reference.filePath}.${compMeta.type.reference.name}.html`;
    } else {
      url = `${identifierName(ngModuleType)}/${identifierName(compMeta.type)}.html`;
    }
  } else {
    url = templateMeta.templateUrl!;
  }
  return compMeta.type.reference instanceof StaticSymbol ? url : jitSourceUrl(url);
}
function jitSourceUrl(url: string) {
  // Note: We need 3 "/" so that ng shows up as a separate domain
  // in the chrome dev tools.
  return url.replace(/(\w+:\/\/[\w:-]+)?(\/+)?/, 'ng:///');
}
`如果是行内template`生成 url：`模块名称/组件名称.html`  
`如果是templateUrl`生成 url：`路径/组件名称.html`    
    --最终转换返回->
       `ng:///模块名称/组件名称.html`  
```

#### HtmlParser【html解析器】

```typescript
export class HtmlParser extends Parser {
  constructor() {
    super(getHtmlTagDefinition);
  }

  parse(source: string, url: string, options?: TokenizeOptions): ParseTreeResult {
    return super.parse(source, url, options);
  }
}
`调用Parser👇`
```

#### Parser【解析器】

```typescript
export class Parser {
  constructor(public getTagDefinition: (tagName: string) => TagDefinition) {}

  parse(source: string, url: string, options?: lex.TokenizeOptions): ParseTreeResult {
    const tokenizeResult = lex.tokenize(source, url, this.getTagDefinition, options);【👇返回值】
    //返回_TreeBuilder实例
    const parser = new _TreeBuilder(tokenizeResult.tokens, this.getTagDefinition);【👇_TreeBuilder】
    //生成节点树
    parser.build();
      //实例化{rootNodes}
    return new ParseTreeResult(
        parser.rootNodes,
        (tokenizeResult.errors as ParseError[]).concat(parser.errors),
    );
  }
}
```

#### lex

##### tokenize

```typescript
@params source:组件template属性
@params url:生成的名称
export function tokenize(
    source: string, url: string, getTagDefinition: (tagName: string) => TagDefinition,
    options: TokenizeOptions = {}): TokenizeResult {
  const tokenizer = new _Tokenizer(new ParseSourceFile(source, url), getTagDefinition, options);
  tokenizer.tokenize();//【_Tokenizer👇】解析template 生成token存入tokens
    //生成储存 tokens的实例
  return new TokenizeResult(
      mergeTextTokens(tokenizer.tokens), tokenizer.errors, tokenizer.nonNormalizedIcuExpressions);
}

export class ParseSourceFile {
  constructor(public content: string, public url: string) {}
}
参数1：{
    content：组件template内容,
    url：生成的url
}
`👇`
`最终返回`：{
    tokens: 解析模板生成的tokens 
    errors: TokenError[],
    nonNormalizedIcuExpressions: Token[]) {}
}
```

##### _Tokenizer【存储生成的token,当前token种类，光标状态】

```typescript
`_cursor`:光标信息【当前光标ASCⅡ,行，列】

class _Tokenizer {
  private _cursor: CharacterCursor;
    //编译时的配置
  private _tokenizeIcu: boolean;
  private _interpolationConfig: InterpolationConfig;         //插值表达式的符号
  private _leadingTriviaCodePoints: number[]|undefined;
    
  private _currentTokenStart: CharacterCursor|null = null;   //当前光标的状态
  private _currentTokenType: TokenType|null = null;          //当前token光标的类型
  private _expansionCaseStack: TokenType[] = [];
  private _inInterpolation: boolean = false;
  private readonly _preserveLineEndings: boolean;
  private readonly _escapedString: boolean;
  private readonly _i18nNormalizeLineEndingsInICUs: boolean;
  tokens: Token[] = [];                                     //存储生成的token
  errors: TokenError[] = []; 
  nonNormalizedIcuExpressions: Token[] = [];
    
  constructor(
      _file: ParseSourceFile, private _getTagDefinition: (tagName: string) => TagDefinition,
      options: TokenizeOptions) {
    this._tokenizeIcu = options.tokenizeExpansionForms || false;
    this._interpolationConfig = options.interpolationConfig || DEFAULT_INTERPOLATION_CONFIG;
          //默认 undefined
    this._leadingTriviaCodePoints =
        options.leadingTriviaChars && options.leadingTriviaChars.map(c => c.codePointAt(0) || 0);
          //template 字符串的信息
    const range =
        options.range || {endPos: _file.content.length, startPos: 0, startLine: 0, startCol: 0};
          //根据是否转义字符串 生成字符光标【PlainCharacterCursor】
    this._cursor = options.escapedString ? new EscapedCharacterCursor(_file, range) :
                                          new PlainCharacterCursor(_file, range);
          //是否 保留行尾
    this._preserveLineEndings = options.preserveLineEndings || false;
           //是否转义字符串
    this._escapedString = options.escapedString || false;
          //i18n规范行尾
    this._i18nNormalizeLineEndingsInICUs = options.i18nNormalizeLineEndingsInICUs || false;
    try {
      this._cursor.init();
    } catch (e) {
      this.handleError(e);
    }
  }
  tokenize(): void {
    while (this._cursor.peek() !== chars.$EOF) {//peek为0,模板解析结束
      const start = this._cursor.clone();       //生成新的PlainCharacterCursor实例储存编译信息【if逻辑】
      try {
        if (this._attemptCharCode(chars.$LT)) {               //<
          if (this._attemptCharCode(chars.$BANG)) {             //<!
            if (this._attemptCharCode(chars.$LBRACKET)) {         //<![
              this._consumeCdata(start);
            } else if (this._attemptCharCode(chars.$MINUS)) {     //<!-
              this._consumeComment(start);          
            } else {                                            //<!Doctype                       
              this._consumeDocType(start);
            }
          } else if (this._attemptCharCode(chars.$SLASH)) {    //</        
            this._consumeTagClose(start);
          } else {
            this._consumeTagOpen(start);                       //<
          }
        } else if (!(this._tokenizeIcu && this._tokenizeExpansionForm())) {
          this._consumeText();
        }
      } catch (e) {
        this.handleError(e);
      }
    }
    this._beginToken(TokenType.EOF);
    this._endToken([]);
  }
}
`处理 CDATA数据`:<![CDATA[文本内容]]>
 private _consumeCdata(start: CharacterCursor) {
    this._beginToken(TokenType.CDATA_START, start);
    this._requireStr('CDATA[');
    this._endToken([]);
    this._consumeRawText(false, () => this._attemptStr(']]>'));
    this._beginToken(TokenType.CDATA_END);
    this._requireStr(']]>');
    this._endToken([]);
  }
`处理注释`:<!--内容-->
private _consumeComment(start: CharacterCursor) {
    this._beginToken(TokenType.COMMENT_START, start);
    this._requireCharCode(chars.$MINUS);
    this._endToken([]);
    this._consumeRawText(false, () => this._attemptStr('-->'));
    this._beginToken(TokenType.COMMENT_END);
    this._requireStr('-->');
    this._endToken([]);
  }
`处理Doctype`:<!Doctype>
private _consumeDocType(start: CharacterCursor) {
    this._beginToken(TokenType.DOC_TYPE, start);
    const contentStart = this._cursor.clone();
    this._attemptUntilChar(chars.$GT);
    const content = this._cursor.getChars(contentStart);
    this._cursor.advance();
    this._endToken([content]);
  }
`处理闭合标签`:</tag>
private _consumeTagClose(start: CharacterCursor) {
    this._beginToken(TokenType.TAG_CLOSE, start);
    this._attemptCharCodeUntilFn(isNotWhitespace);
    const prefixAndName = this._consumePrefixAndName();
    this._attemptCharCodeUntilFn(isNotWhitespace);
    this._requireCharCode(chars.$GT);
    this._endToken(prefixAndName);
  }
`处理开始标签`:<tag>
 private _consumeTagOpen(start: CharacterCursor) {
    let tagName: string;
    let prefix: string;
    let openTagToken: Token|undefined;
    try {
      if (!chars.isAsciiLetter(this._cursor.peek())) {
        throw this._createError(
            _unexpectedCharacterErrorMsg(this._cursor.peek()), this._cursor.getSpan(start));
      }

      openTagToken = this._consumeTagOpenStart(start);
      prefix = openTagToken.parts[0];
      tagName = openTagToken.parts[1];
      this._attemptCharCodeUntilFn(isNotWhitespace);
      while (this._cursor.peek() !== chars.$SLASH && this._cursor.peek() !== chars.$GT &&
             this._cursor.peek() !== chars.$LT) {
        this._consumeAttributeName();
        this._attemptCharCodeUntilFn(isNotWhitespace);
        if (this._attemptCharCode(chars.$EQ)) {
          this._attemptCharCodeUntilFn(isNotWhitespace);
          this._consumeAttributeValue();
        }
        this._attemptCharCodeUntilFn(isNotWhitespace);
      }
      this._consumeTagOpenEnd();
    } catch (e) {
      if (e instanceof _ControlFlowError) {
        if (openTagToken) {
          // We errored before we could close the opening tag, so it is incomplete.
          openTagToken.type = TokenType.INCOMPLETE_TAG_OPEN;
        } else {
          // When the start tag is invalid, assume we want a "<" as text.
          // Back to back text tokens are merged at the end.
          this._beginToken(TokenType.TEXT, start);
          this._endToken(['<']);
        }
        return;
      }

      throw e;
    }

    const contentTokenType = this._getTagDefinition(tagName).contentType;

    if (contentTokenType === TagContentType.RAW_TEXT) {
      this._consumeRawTextWithTagClose(prefix, tagName, false);
    } else if (contentTokenType === TagContentType.ESCAPABLE_RAW_TEXT) {
      this._consumeRawTextWithTagClose(prefix, tagName, true);
    }
  }
`处理文本`
private _consumeText() {
    const start = this._cursor.clone();
    this._beginToken(TokenType.TEXT, start);
    const parts: string[] = [];

    do {
      if (this._interpolationConfig && this._attemptStr(this._interpolationConfig.start)) {
        parts.push(this._interpolationConfig.start);
        this._inInterpolation = true;
      } else if (
          this._interpolationConfig && this._inInterpolation &&
          this._attemptStr(this._interpolationConfig.end)) {
        parts.push(this._interpolationConfig.end);
        this._inInterpolation = false;
      } else {
        parts.push(this._readChar(true));
      }
    } while (!this._isTextEnd());

    this._endToken([this._processCarriageReturns(parts.join(''))]);
  }
```

##### 模板解析函数

###### _beginToken

```typescript
@params type:标记当前生成token的类型
@params start:当前光标实例【存储编译状态】

private _beginToken(type: TokenType, start = this._cursor.clone()) {
    this._currentTokenStart = start;
    this._currentTokenType = type;
  }
`获取 当前token的其实状态和类型。`
```

###### _requireStr

```typescript
  private _requireStr(chars: string) {
    const location = this._cursor.clone();
    if (!this._attemptStr(chars)) {
      throw this._createError(
          _unexpectedCharacterErrorMsg(this._cursor.peek()), this._cursor.getSpan(location));
    }
  }
```

###### _attemptStr

```typescript
@params chars:期望得到的字符串

private _attemptStr(chars: string): boolean {
    const len = chars.length;
    if (this._cursor.charsLeft() < len) {
      return false;
    }
    const initialPosition = this._cursor.clone();
    for (let i = 0; i < len; i++) {
      if (!this._attemptCharCode(chars.charCodeAt(i))) {
        // If attempting to parse the string fails, we want to reset the parser
        // to where it was before the attempt
        this._cursor = initialPosition;
        return false;
      }
    }
    return true;
  }
`将期望得到的字符串和现有的字符串逐个比较，如果相同返回true，不相同就返回false，退到原始状态。👇`
```

###### _attemptCharCode

```typescript
  private _attemptCharCode(charCode: number): boolean {
    if (this._cursor.peek() === charCode) {
      this._cursor.advance();
      return true;
    }
    return false;
  }
```

###### advance

```typescript
 advance(): void {
    this.advanceState(this.state);
  }
调用👇更改状态。  
```

###### advanceState

```typescript
protected advanceState(state: CursorState) {
    if (state.offset >= this.end) {
      this.state = state;
      throw new CursorError('Unexpected character "EOF"', this);
    }
    const currentChar = this.charAt(state.offset);
    if (currentChar === chars.$LF) {//遇到换行符就 行+1,列不变
      state.line++;
      state.column = 0;
    } else if (!chars.isNewLine(currentChar)) {//非换行，列＋1
      state.column++;
    }
    state.offset++;   //光标右移1位
    this.updatePeek(state); //更新当前光标字符
  }
`更新 _cursor信息`
```

###### _endToken

```typescript
  private _endToken(parts: string[], end?: CharacterCursor): Token {
    if (this._currentTokenStart === null) {
      throw new TokenError(
          'Programming error - attempted to end a token when there was no start to the token',
          this._currentTokenType, this._cursor.getSpan(end));
    }
    if (this._currentTokenType === null) {
      throw new TokenError(
          'Programming error - attempted to end a token which has no token type', null,
          this._cursor.getSpan(this._currentTokenStart));
    }
    const token = new Token(
        this._currentTokenType, parts,
        this._cursor.getSpan(this._currentTokenStart, this._leadingTriviaCodePoints));
    this.tokens.push(token);
    this._currentTokenStart = null;
    this._currentTokenType = null;
    return token;
  }
`getSpan`
`生成token`👇
初始化数据
返回token
```

###### getSpan【PlainCharacterCursor】

```typescript
@params start：解析token时的初始状态【是初始_cursor】
@params this：_cursor【更新后的cursor】

getSpan(start?: this, leadingTriviaCodePoints?: number[]): ParseSourceSpan {
    start = start || this;
    let fullStart = start;
      //默认为 undefined
    if (leadingTriviaCodePoints) {
      while (this.diff(start) > 0 && leadingTriviaCodePoints.indexOf(start.peek()) !== -1) {
        if (fullStart === start) {
          start = start.clone() as this;
        }
        start.advance();
      }
    }
    const startLocation = this.locationFromCursor(start);//关于本token起点的信息👇
    const endLocation = this.locationFromCursor(this);////关于本token终点的信息👇
    const fullStartLocation =
        fullStart !== start ? this.locationFromCursor(fullStart) : startLocation;
    return new ParseSourceSpan(startLocation, endLocation, fullStartLocation);
  }
生成 ParseSourceSpan实例 参数是locationFromCursor返回值
```

###### Token【保存在tokens中的数据】

```typescript
export class Token {
  constructor(
      public type: TokenType|null, public parts: string[], public sourceSpan: ParseSourceSpan) {}
}
`返回`{
    type:token类型【开始标签/闭合标签/doctype/注释...】
    parts:传入的数据 string[]
    sourceSpan：ParseSourceSpan实例👇
}
```



###### ParseSourceSpan

```typescript
class ParseSourceSpan {
      constructor(
      public start: ParseLocation, public end: ParseLocation,
      public fullStart: ParseLocation = start, public details: string|null = null) {}
}
返回：{
    start: _cursor【token初始cursor数据】, 
    end: _cursor【token结束cursor数据】,
    fullStart: _cursor, 
    details: null
}
_cursor:PlainCharacterCursor实例
```



###### locationFromCursor

```typescript
  private locationFromCursor(cursor: this): ParseLocation {
    return new ParseLocation(
        cursor.file, cursor.state.offset, cursor.state.line, cursor.state.column);
  }
class ParseLocation {
  constructor(
      public file: ParseSourceFile, public offset: number, public line: number,
      public col: number) {}
}
`生成 ParseLocation实例`:{
    file:{content:模板内容,url:生成的html文件名},
    offset: 模板起点,
    line:行数,  
    col:列数,
}
```

###### _consumeTagOpen【处理开始标签】

```typescript
  private _consumeTagOpen(start: CharacterCursor) {
    let tagName: string;
    let prefix: string;
    let openTagToken: Token|undefined;
    try {
      `tag如果不是大小写字母开头 报错`
	  //存储开始标签token，prefix是tag前缀【一般为空】,tagName是标签名
      openTagToken = this._consumeTagOpenStart(start);
        //获取前缀和标签名称
      prefix = openTagToken.parts[0];
      tagName = openTagToken.parts[1];
      this._attemptCharCodeUntilFn(isNotWhitespace);
        //循环解析开始标签中的属性
      while (this._cursor.peek() !== chars.$SLASH && this._cursor.peek() !== chars.$GT &&
             this._cursor.peek() !== chars.$LT) {
          //属性名称
        this._consumeAttributeName();
        this._attemptCharCodeUntilFn(isNotWhitespace);
        if (this._attemptCharCode(chars.$EQ)) {
          this._attemptCharCodeUntilFn(isNotWhitespace);
          this._consumeAttributeValue();
        }
        this._attemptCharCodeUntilFn(isNotWhitespace);
      }
        //解析完成属性后,解析闭合标签
      this._consumeTagOpenEnd();
    } catch (e) {
      if (e instanceof _ControlFlowError) {
        if (openTagToken) {
          // We errored before we could close the opening tag, so it is incomplete.
          openTagToken.type = TokenType.INCOMPLETE_TAG_OPEN;
        } else {
          // When the start tag is invalid, assume we want a "<" as text.
          // Back to back text tokens are merged at the end.
          this._beginToken(TokenType.TEXT, start);
          this._endToken(['<']);
        }
        return;
      }

      throw e;
    }
	//根据标签名获取对应的html定义【_getTagDefinition是映射表<tag->定义>】
    const contentTokenType = this._getTagDefinition(tagName).contentType;//返回标签类型 默认是2【可分析数据？】

    if (contentTokenType === TagContentType.RAW_TEXT) {//RAW_TEXT是原始文本？？？
      this._consumeRawTextWithTagClose(prefix, tagName, false);
    } else if (contentTokenType === TagContentType.ESCAPABLE_RAW_TEXT) {//RAW_TEXT是原始文本？？？
      this._consumeRawTextWithTagClose(prefix, tagName, true);
    }
  }
```

###### _consumeTagOpenStart

```typescript
  private _consumeTagOpenStart(start: CharacterCursor) {
    this._beginToken(TokenType.TAG_OPEN_START, start);
    const parts = this._consumePrefixAndName();
    return this._endToken(parts);
  }
```

###### _consumePrefixAndName

```typescript
  private _consumePrefixAndName(): string[] {
    const nameOrPrefixStart = this._cursor.clone();
    let prefix: string = '';
    while (this._cursor.peek() !== chars.$COLON && !isPrefixEnd(this._cursor.peek())) {//非冒号且在a-zA-Z0-9
      this._cursor.advance();
    }
    let nameStart: CharacterCursor;
    if (this._cursor.peek() === chars.$COLON) {
      prefix = this._cursor.getChars(nameOrPrefixStart);
      this._cursor.advance();
      nameStart = this._cursor.clone();
    } else {
      nameStart = nameOrPrefixStart;
    }
    this._requireCharCodeUntilFn(isNameEnd, prefix === '' ? 0 : 1);
    const name = this._cursor.getChars(nameStart);
    return [prefix, name];
  }
prefix:前缀
name:名称
```



##### PlainCharacterCursor【存储template信息的主要函数】

```typescript
`组件有 template属性`
@params fileOrCursor:tokenize返回值
@params range:_Tokenizer的range

`【初始走else】`
`【在解析过程中clone 时走 if 】`

class PlainCharacterCursor implements CharacterCursor {
    constructor(fileOrCursor: ParseSourceFile|PlainCharacterCursor, range?: LexerRange) {
    if (fileOrCursor instanceof PlainCharacterCursor) {
      this.file = fileOrCursor.file;
      this.input = fileOrCursor.input;
      this.end = fileOrCursor.end;

      const state = fileOrCursor.state;
      // Note: avoid using `{...fileOrCursor.state}` here as that has a severe performance penalty.
      // In ES5 bundles the object spread operator is translated into the `__assign` helper, which
      // is not optimized by VMs as efficiently as a raw object literal. Since this constructor is
      // called in tight loops, this difference matters.
      this.state = {
        peek: state.peek,
        offset: state.offset,
        line: state.line,
        column: state.column,
      };
    } else {
      if (!range) {
        throw new Error(
            'Programming error: the range argument must be provided with a file argument.');
      }
      this.file = fileOrCursor;【{content:template内容, url:文件名}】
      this.input = fileOrCursor.content;【template 模板内容】
      this.end = range.endPos;【template 模板 的长度】
      //初始化，记录编译状态
      this.state = {
        peek: -1,【记录当前光标点的 ASCⅡ 值, -1为初始化标志,0为结束标志,中间状态为光标点的ASCⅡ 值】
        offset: range.startPos,【当前光标位置】
        line: range.startLine,【当前行】
        column: range.startCol,【当前列】
      };
    }
  }
  clone(): PlainCharacterCursor {
    return new PlainCharacterCursor(this);
  }
  init(): void {
    this.updatePeek(this.state);
  }
  protected updatePeek(state: CursorState): void {
      //改变状态中的peek, -1为初始化标志,0为结束标志,中间状态为光标点的ASCⅡ 值
    state.peek = state.offset >= this.end ? chars.$EOF : this.charAt(state.offset);
  }
 getChars(start: this): string {
    return this.input.substring(start.state.offset, this.state.offset);
  }
}
`返回光标数据`
----‘不变数据’
this.file:{content:template内容, url:文件名}
this.input:【template 模板内容】
this.end:【template 模板 的长度】

-----‘变动数据’
this.state:{
    peek: -1,【记录当前光标点的 ASCⅡ 值, -1为初始化标志,0为结束标志,中间状态为光标点的ASCⅡ 值】
        offset: range.startPos,【当前光标位置】
        line: range.startLine,【当前行】
        column: range.startCol,【当前列】
}
```

#### _TreeBuilder

```typescript
class _TreeBuilder {
  private _index: number = -1;
  // `_peek` will be initialized by the call to `advance()` in the constructor.
  private _peek!: lex.Token;
  private _elementStack: html.Element[] = [];

  rootNodes: html.Node[] = [];
  errors: TreeError[] = [];

  constructor(
      private tokens: lex.Token[], private getTagDefinition: (tagName: string) => TagDefinition) {
    this._advance();
  }
  private _advance(): lex.Token {
    const prev = this._peek;
    if (this._index < this.tokens.length - 1) {
      // Note: there is always an EOF token at the end
      this._index++;
    }
    this._peek = this.tokens[this._index];
    return prev;
  }
  build(): void {
    while (this._peek.type !== lex.TokenType.EOF) {
      if (this._peek.type === lex.TokenType.TAG_OPEN_START ||
          this._peek.type === lex.TokenType.INCOMPLETE_TAG_OPEN) {
        this._consumeStartTag(this._advance());
      } else if (this._peek.type === lex.TokenType.TAG_CLOSE) {
        this._consumeEndTag(this._advance());
      } else if (this._peek.type === lex.TokenType.CDATA_START) {
        this._closeVoidElement();
        this._consumeCdata(this._advance());
      } else if (this._peek.type === lex.TokenType.COMMENT_START) {
        this._closeVoidElement();
        this._consumeComment(this._advance());
      } else if (
          this._peek.type === lex.TokenType.TEXT || this._peek.type === lex.TokenType.RAW_TEXT ||
          this._peek.type === lex.TokenType.ESCAPABLE_RAW_TEXT) {
        this._closeVoidElement();
        this._consumeText(this._advance());
      } else if (this._peek.type === lex.TokenType.EXPANSION_FORM_START) {
        this._consumeExpansion(this._advance());
      } else {
        // Skip all other tokens...
        this._advance();
      }
    }
  }
}
`将合并的token放到 _elementStack `
```

#### TemplatePreparseVisitor【2】

```typescript
class TemplatePreparseVisitor implements html.Visitor {
  ngContentSelectors: string[] = [];
  styles: string[] = [];
  styleUrls: string[] = [];
  ngNonBindableStackCount: number = 0;

  visitElement(ast: html.Element, context: any): any {
    const preparsedElement = preparseElement(ast);
    switch (preparsedElement.type) {
      case PreparsedElementType.NG_CONTENT:
        if (this.ngNonBindableStackCount === 0) {
          this.ngContentSelectors.push(preparsedElement.selectAttr);
        }
        break;
      case PreparsedElementType.STYLE:
        let textContent = '';
        ast.children.forEach(child => {
          if (child instanceof html.Text) {
            textContent += child.value;
          }
        });
        this.styles.push(textContent);
        break;
      case PreparsedElementType.STYLESHEET:
        this.styleUrls.push(preparsedElement.hrefAttr);
        break;
      default:
        break;
    }
    if (preparsedElement.nonBindable) {
      this.ngNonBindableStackCount++;
    }
    html.visitAll(this, ast.children);
    if (preparsedElement.nonBindable) {
      this.ngNonBindableStackCount--;
    }
    return null;
  }

  visitExpansion(ast: html.Expansion, context: any): any {
    html.visitAll(this, ast.cases);
  }

  visitExpansionCase(ast: html.ExpansionCase, context: any): any {
    html.visitAll(this, ast.expression);
  }

  visitComment(ast: html.Comment, context: any): any {
    return null;
  }
  visitAttribute(ast: html.Attribute, context: any): any {
    return null;
  }
  visitText(ast: html.Text, context: any): any {
    return null;
  }
}
```

#### visitAll【2】

```typescript
`循环处理生成的节点`
visitor.visit:undefined;
nodes:Element实例👇
content:null

export function visitAll(visitor: Visitor, nodes: Node[], context: any = null): any[] {
  const result: any[] = [];

  const visit = visitor.visit ?
      (ast: Node) => visitor.visit!(ast, context) || ast.visit(visitor, context) :
      (ast: Node) => ast.visit(visitor, context);
  nodes.forEach(ast => {
    const astResult = visit(ast);
    if (astResult) {
      result.push(astResult);
    }
  });
  return result;
}

```

##### Element【2】

```typescript
export class Element extends NodeWithI18n {
  constructor(
      public name: string, public attrs: Attribute[], public children: Node[],
      sourceSpan: ParseSourceSpan, public startSourceSpan: ParseSourceSpan,
      public endSourceSpan: ParseSourceSpan|null = null, i18n?: I18nMeta) {
    super(sourceSpan, i18n);
  }
  visit(visitor: Visitor, context: any): any {
    return visitor.visitElement(this, context);
  }
}
`调用TemplatePreparseVisitor 中的 visitElement 往visitor储存数据` 在调用过程中，不断地调用child，处理所有节点。
```

