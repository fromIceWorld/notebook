(function anonymous(
    jit_createRendererType2_0,
    jit_viewDef_1,
    jit_elementDef_2,
    jit_textDef_3,
    jit_queryDef_4,
    jit_anchorDef_5,
    jit_directiveDef_6,
    jit_NgTemplateOutlet_7,
    jit_ViewContainerRef_8,
    jit_Backgroud_9,
    jit_ElementRef_10,
    jit_View_CardComponent_0_11,
    jit__object_Object__12,
    jit_CardComponent_13,
    jit_View_ChildComponent_0_14,
    jit__object_Object__15,
    jit_ChildComponent_16,
    jit_nodeValue_17
) {
    var styles_AppComponent = [
        '\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC9hcHAuY29tcG9uZW50LmNzcyJ9 */',
    ];
    var RenderType_AppComponent = jit_createRendererType2_0({
        encapsulation: 0,
        styles: styles_AppComponent,
        data: {},
    });
    function View_AppComponent_1(_l) {
        return jit_viewDef_1(
            0,
            [
                (_l()(),
                jit_elementDef_2(
                    0,
                    0,
                    null,
                    null,
                    0,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
                )),
            ],
            null,
            null
        );
    }
    function View_AppComponent_2(_l) {
        return jit_viewDef_1(
            0,
            [
                (_l()(),
                jit_elementDef_2(
                    0,
                    0,
                    null,
                    null,
                    1,
                    'p',
                    [],
                    null,
                    null,
                    null,
                    null,
                    null
                )),
                (_l()(), jit_textDef_3(1, null, ['被嵌入的视图; 上下文:', ''])),
            ],
            null,
            function (_ck, _v) {
                var currVal_0 = _v.context.$implicit;
                _ck(_v, 1, 0, currVal_0);
            }
        );
    }
    function View_AppComponent_0(_l) {
        return jit_viewDef_1(
            0,
            [
                jit_queryDef_4(402653184, 1, { dir: 0 }),
                (_l()(),
                jit_elementDef_2(
                    1,
                    0,
                    null,
                    null,
                    1,
                    'div',
                    [],
                    null,
                    null,
                    null,
                    null,
                    null
                )),
                (_l()(), jit_textDef_3(-1, null, ['work'])),
                (_l()(),
                jit_elementDef_2(
                    3,
                    0,
                    null,
                    null,
                    1,
                    'h4',
                    [],
                    null,
                    null,
                    null,
                    null,
                    null
                )),
                (_l()(),
                jit_textDef_3(-1, null, [
                    '---------------ng-container 嵌入式图----------------',
                ])),
                (_l()(),
                jit_anchorDef_5(
                    16777216,
                    null,
                    null,
                    1,
                    null,
                    View_AppComponent_1
                )),
                jit_directiveDef_6(
                    6,
                    540672,
                    null,
                    0,
                    jit_NgTemplateOutlet_7,
                    [jit_ViewContainerRef_8],
                    {
                        ngTemplateOutletContext: [0, 'ngTemplateOutletContext'],
                        ngTemplateOutlet: [1, 'ngTemplateOutlet'],
                    },
                    null
                ),
                (_l()(),
                jit_elementDef_2(
                    7,
                    0,
                    null,
                    null,
                    1,
                    'h4',
                    [],
                    null,
                    null,
                    null,
                    null,
                    null
                )),
                (_l()(),
                jit_textDef_3(-1, null, ['----元素节点，属性节点-=-------'])),
                (_l()(),
                jit_elementDef_2(
                    9,
                    0,
                    null,
                    null,
                    1,
                    'p',
                    [],
                    null,
                    null,
                    null,
                    null,
                    null
                )),
                (_l()(), jit_textDef_3(10, null, ['', ''])),
                (_l()(),
                jit_elementDef_2(
                    11,
                    0,
                    null,
                    null,
                    0,
                    'span',
                    [],
                    [[8, 'textContent', 0]],
                    null,
                    null,
                    null,
                    null
                )),
                (_l()(),
                jit_elementDef_2(
                    12,
                    0,
                    [
                        [1, 0],
                        ['dir', 1],
                    ],
                    null,
                    1,
                    'h4',
                    [],
                    null,
                    null,
                    null,
                    null,
                    null
                )),
                (_l()(), jit_textDef_3(-1, null, ['-------指令----------'])),
                (_l()(),
                jit_elementDef_2(
                    14,
                    0,
                    null,
                    null,
                    2,
                    'p',
                    [['back-color', 'blue']],
                    null,
                    [[null, 'dirEvent']],
                    function (_v, en, $event) {
                        var ad = true;
                        var _co = _v.component;
                        if ('dirEvent' === en) {
                            var pd_0 = _co.handleEvent($event) !== false;
                            ad = pd_0 && ad;
                        }
                        return ad;
                    },
                    null,
                    null
                )),
                jit_directiveDef_6(
                    15,
                    16728064,
                    [[2, 4]],
                    1,
                    jit_Backgroud_9,
                    [jit_ElementRef_10],
                    { backColor: [0, 'backColor'] },
                    { dirEvent: 'dirEvent' }
                ),
                jit_queryDef_4(603979776, 2, { contentChildren: 1 }),
                (_l()(),
                jit_elementDef_2(
                    17,
                    0,
                    null,
                    null,
                    1,
                    'p',
                    [['style', 'color: goldenrod;']],
                    null,
                    null,
                    null,
                    null,
                    null
                )),
                (_l()(),
                jit_textDef_3(-1, null, ['----------本模块子组件--------'])),
                (_l()(),
                jit_elementDef_2(
                    19,
                    0,
                    null,
                    null,
                    7,
                    'app-card',
                    [],
                    null,
                    null,
                    null,
                    jit_View_CardComponent_0_11,
                    jit__object_Object__12
                )),
                jit_directiveDef_6(
                    20,
                    114688,
                    null,
                    0,
                    jit_CardComponent_13,
                    [],
                    null,
                    null
                ),
                (_l()(),
                jit_elementDef_2(
                    21,
                    0,
                    null,
                    0,
                    1,
                    'p',
                    [['class', 'in']],
                    null,
                    null,
                    null,
                    null,
                    null
                )),
                (_l()(), jit_textDef_3(-1, null, ['主视图投影进来的段落1'])),
                (_l()(),
                jit_elementDef_2(
                    23,
                    0,
                    null,
                    1,
                    1,
                    'p',
                    [['id', 'in2']],
                    null,
                    null,
                    null,
                    null,
                    null
                )),
                (_l()(), jit_textDef_3(-1, null, ['主视图投影进来的段落2'])),
                (_l()(),
                jit_elementDef_2(
                    25,
                    0,
                    null,
                    1,
                    1,
                    'p',
                    [],
                    null,
                    null,
                    null,
                    null,
                    null
                )),
                (_l()(), jit_textDef_3(-1, null, ['主视图投影进来的段落3'])),
                (_l()(),
                jit_elementDef_2(
                    27,
                    0,
                    null,
                    null,
                    1,
                    'p',
                    [['style', 'color: indianred;']],
                    null,
                    null,
                    null,
                    null,
                    null
                )),
                (_l()(),
                jit_textDef_3(-1, null, ['-----《child-module》的组件'])),
                (_l()(),
                jit_elementDef_2(
                    29,
                    0,
                    null,
                    null,
                    1,
                    'app-child',
                    [['tochild', 'title']],
                    null,
                    [[null, 'childEmit']],
                    function (_v, en, $event) {
                        var ad = true;
                        var _co = _v.component;
                        if ('childEmit' === en) {
                            var pd_0 = _co.handleEvent(_co.event) !== false;
                            ad = pd_0 && ad;
                        }
                        return ad;
                    },
                    jit_View_ChildComponent_0_14,
                    jit__object_Object__15
                )),
                jit_directiveDef_6(
                    30,
                    16760832,
                    null,
                    0,
                    jit_ChildComponent_16,
                    [],
                    { tochild: [0, 'tochild'] },
                    { childEmit: 'childEmit' }
                ),
                (_l()(),
                jit_anchorDef_5(
                    0,
                    [['tem1', 2]],
                    null,
                    0,
                    null,
                    View_AppComponent_2
                )),
            ],
            function (_ck, _v) {
                var _co = _v.component;
                var currVal_0 = _co.myContext;
                var currVal_1 = jit_nodeValue_17(_v, 31);
                _ck(_v, 6, 0, currVal_0, currVal_1);
                var currVal_4 = 'blue';
                _ck(_v, 15, 0, currVal_4);
                _ck(_v, 20, 0);
                var currVal_5 = 'title';
                _ck(_v, 30, 0, currVal_5);
            },
            function (_ck, _v) {
                var _co = _v.component;
                var currVal_2 = _co.title;
                _ck(_v, 10, 0, currVal_2);
                var currVal_3 = 'Hello ' + _co.title;
                _ck(_v, 11, 0, currVal_3);
            }
        );
    }
    return {
        RenderType_AppComponent: RenderType_AppComponent,
        View_AppComponent_0: View_AppComponent_0,
    };
    //# sourceURL=ng:///AppModule/AppComponent.ngfactory.js
    //# sourceMappingURL=data:application/json;base64,eyJmaWxlIjoibmc6Ly8vQXBwTW9kdWxlL0FwcENvbXBvbmVudC5uZ2ZhY3RvcnkuanMiLCJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZzovLy9BcHBNb2R1bGUvQXBwQ29tcG9uZW50Lm5nZmFjdG9yeS5qcyIsIm5nOi8vL0FwcE1vZHVsZS9BcHBDb21wb25lbnQuaHRtbCJdLCJzb3VyY2VzQ29udGVudCI6WyIgIiwiPGRpdj53b3JrPC9kaXY+XG48aDQ+LS0tLS0tLS0tLS0tLS0tbmctY29udGFpbmVyIOW1jOWFpeW8j+Wbvi0tLS0tLS0tLS0tLS0tLS08L2g0PlxuPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInRlbTE7IGNvbnRleHQ6IG15Q29udGV4dFwiPjwvbmctY29udGFpbmVyPlxuXG48aDQ+LS0tLeWFg+e0oOiKgueCue+8jOWxnuaAp+iKgueCuS09LS0tLS0tLTwvaDQ+XG48cD57eyB0aXRsZSB9fTwvcD5cblxuPHNwYW4gW3RleHRDb250ZW50XT1cIidIZWxsbyAnICsgdGl0bGVcIj48L3NwYW4+XG5cbjxoNCAjZGlyPi0tLS0tLS3mjIfku6QtLS0tLS0tLS0tPC9oND5cbjxwIGJhY2stY29sb3I9XCJibHVlXCIgKGRpckV2ZW50KT1cImhhbmRsZUV2ZW50KCRldmVudClcIj48L3A+XG5cbjxwIHN0eWxlPVwiY29sb3I6IGdvbGRlbnJvZDtcIj4tLS0tLS0tLS0t5pys5qih5Z2X5a2Q57uE5Lu2LS0tLS0tLS08L3A+XG5cbjxhcHAtY2FyZD5cbiAgPHAgY2xhc3M9XCJpblwiPuS4u+inhuWbvuaKleW9sei/m+adpeeahOauteiQvTE8L3A+XG4gIDxwIGlkPVwiaW4yXCI+5Li76KeG5Zu+5oqV5b2x6L+b5p2l55qE5q616JC9MjwvcD5cbiAgPHA+5Li76KeG5Zu+5oqV5b2x6L+b5p2l55qE5q616JC9MzwvcD5cbjwvYXBwLWNhcmQ+XG5cbjxwIHN0eWxlPVwiY29sb3I6IGluZGlhbnJlZDtcIj4tLS0tLeOAimNoaWxkLW1vZHVsZeOAi+eahOe7hOS7tjwvcD5cblxuPGFwcC1jaGlsZCA6dG9jaGlsZD1cInRpdGxlXCIgKGNoaWxkRW1pdCk9XCJoYW5kbGVFdmVudChldmVudClcIj48L2FwcC1jaGlsZD5cbjxuZy10ZW1wbGF0ZSAjdGVtMSBsZXQtbmFtZT5cbiAgPHA+6KKr5bWM5YWl55qE6KeG5Zu+OyDkuIrkuIvmloc6e3sgbmFtZSB9fTwvcD5cbjwvbmctdGVtcGxhdGU+XG4iXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7MEJDRUE7TUFBQTs7OzBCQXNCRTtNQUFBLGlCQUFHOztJQUFBO0lBQUE7Ozs7OERBeEJMO01BQUEsa0RBQUs7TUFBQSxXQUNMO01BQUEsT0FBSTtNQUNKLHdFQUFBO1VBQUE7Y0FBQTtVQUFBLE1BRUE7VUFBQSxPQUFJLDJEQUNKO1VBQUEsbUVBQUc7VUFBQSxnQ0FFSDtVQUFBLHdEQUVBO1VBQUEsOERBQVM7VUFBQSwrQkFDVDtVQUFBO1lBQUE7WUFBQTtZQUFxQjtjQUFBO2NBQUE7WUFBQTtZQUFyQjtVQUFBLGNBQUE7VUFBQTtVQUFBLHVCQUVBO1VBQUEsaURBQTZCO1VBQUEsb0NBRTdCO1VBQUE7TUFBQSx1RUFDRTtVQUFBO2NBQUEsT0FBYyxnREFDZDtVQUFBLHlEQUFZO1VBQUEsdUJBQ1o7VUFBQSxzQkFBRyxnREFHTDtVQUFBO2NBQUEsc0JBQTZCO01BRTdCO1VBQUE7WUFBQTtZQUFBO1lBQTRCO2NBQUE7Y0FBQTtZQUFBO1lBQTVCO1VBQUEsd0RBQUE7VUFBQTtNQUNBOzs7SUFyQmM7SUFBQTtJQUFkLFdBQWMsbUJBQWQ7SUFRRztJQUFILFlBQUcsU0FBSDtJQUlBO0lBUVc7SUFBWCxZQUFXLFNBQVg7OztJQWpCRztJQUFBO0lBRUc7SUFBTixZQUFNLFNBQU47OzsifQ==
});
