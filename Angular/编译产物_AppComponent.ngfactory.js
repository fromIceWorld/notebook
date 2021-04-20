(function anonymous(
    jit_createRendererType2_0,
    jit_viewDef_1,
    jit_elementDef_2,
    jit_textDef_3,
    jit_anchorDef_4,
    jit_directiveDef_5,
    jit_NgTemplateOutlet_6,
    jit_ViewContainerRef_7,
    jit_Backgroud_8,
    jit_ElementRef_9,
    jit_queryDef_10,
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
                (_l()(),
                jit_elementDef_2(
                    0,
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
                    2,
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
                jit_anchorDef_4(
                    16777216,
                    null,
                    null,
                    1,
                    null,
                    View_AppComponent_1
                )),
                jit_directiveDef_5(
                    5,
                    540672,
                    null,
                    0,
                    jit_NgTemplateOutlet_6,
                    [jit_ViewContainerRef_7],
                    {
                        ngTemplateOutletContext: [0, 'ngTemplateOutletContext'],
                        ngTemplateOutlet: [1, 'ngTemplateOutlet'],
                    },
                    null
                ),
                (_l()(),
                jit_elementDef_2(
                    6,
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
                (_l()(), jit_textDef_3(7, null, ['', ''])),
                (_l()(),
                jit_elementDef_2(
                    8,
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
                    9,
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
                jit_directiveDef_5(
                    10,
                    4276224,
                    [[1, 4]],
                    1,
                    jit_Backgroud_8,
                    [jit_ElementRef_9],
                    { backColor: [0, 'backColor'] },
                    { dirEvent: 'dirEvent' }
                ),
                jit_queryDef_10(603979776, 1, { contentChildren: 1 }),
                (_l()(),
                jit_elementDef_2(
                    12,
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
                    14,
                    0,
                    null,
                    null,
                    1,
                    'app-card',
                    [],
                    null,
                    null,
                    null,
                    jit_View_CardComponent_0_11,
                    jit__object_Object__12
                )),
                jit_directiveDef_5(
                    15,
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
                    16,
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
                    18,
                    0,
                    null,
                    null,
                    1,
                    'app-child',
                    [],
                    null,
                    null,
                    null,
                    jit_View_ChildComponent_0_14,
                    jit__object_Object__15
                )),
                jit_directiveDef_5(
                    19,
                    114688,
                    null,
                    0,
                    jit_ChildComponent_16,
                    [],
                    null,
                    null
                ),
                (_l()(),
                jit_anchorDef_4(
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
                var currVal_1 = jit_nodeValue_17(_v, 20);
                _ck(_v, 5, 0, currVal_0, currVal_1);
                var currVal_4 = 'blue';
                _ck(_v, 10, 0, currVal_4);
                _ck(_v, 15, 0);
                _ck(_v, 19, 0);
            },
            function (_ck, _v) {
                var _co = _v.component;
                var currVal_2 = _co.title;
                _ck(_v, 7, 0, currVal_2);
                var currVal_3 = 'Hello ' + _co.title;
                _ck(_v, 8, 0, currVal_3);
            }
        );
    }
    return {
        RenderType_AppComponent: RenderType_AppComponent,
        View_AppComponent_0: View_AppComponent_0,
    };
    //# sourceURL=ng:///AppModule/AppComponent.ngfactory.js
    //# sourceMappingURL=data:application/json;base64,eyJmaWxlIjoibmc6Ly8vQXBwTW9kdWxlL0FwcENvbXBvbmVudC5uZ2ZhY3RvcnkuanMiLCJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZzovLy9BcHBNb2R1bGUvQXBwQ29tcG9uZW50Lm5nZmFjdG9yeS5qcyIsIm5nOi8vL0FwcE1vZHVsZS9BcHBDb21wb25lbnQuaHRtbCJdLCJzb3VyY2VzQ29udGVudCI6WyIgIiwiPGRpdj53b3JrPC9kaXY+XG48aDQ+LS0tLS0tLS0tLS0tLS0tbmctY29udGFpbmVyIOW1jOWFpeW8j+Wbvi0tLS0tLS0tLS0tLS0tLS08L2g0PlxuPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInRlbTE7IGNvbnRleHQ6IG15Q29udGV4dFwiPjwvbmctY29udGFpbmVyPlxuXG48cD57eyB0aXRsZSB9fTwvcD5cblxuPHNwYW4gW3RleHRDb250ZW50XT1cIidIZWxsbyAnICsgdGl0bGVcIj48L3NwYW4+XG5cbjxwIGJhY2stY29sb3I9XCJibHVlXCIgKGRpckV2ZW50KT1cImhhbmRsZUV2ZW50KCRldmVudClcIj48L3A+XG5cbjxwIHN0eWxlPVwiY29sb3I6IGdvbGRlbnJvZDtcIj4tLS0tLS0tLS0t5pys5qih5Z2X5a2Q57uE5Lu2LS0tLS0tLS08L3A+XG5cbjxhcHAtY2FyZD48L2FwcC1jYXJkPlxuXG48cCBzdHlsZT1cImNvbG9yOiBpbmRpYW5yZWQ7XCI+LS0tLS3jgIpjaGlsZC1tb2R1bGXjgIvnmoTnu4Tku7Y8L3A+XG5cbjxhcHAtY2hpbGQ+PC9hcHAtY2hpbGQ+XG48bmctdGVtcGxhdGUgI3RlbTEgbGV0LW5hbWU+XG4gIDxwPuiiq+W1jOWFpeeahOinhuWbvjsg5LiK5LiL5paHOnt7IG5hbWUgfX08L3A+XG48L25nLXRlbXBsYXRlPlxuIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OzBCQ0VBO01BQUE7OzswQkFnQkU7TUFBQSxpQkFBRzs7SUFBQTtJQUFBOzs7OzBCQWxCTDtNQUFBLGlCQUFLLHlDQUNMO01BQUEsaURBQUk7TUFBQSx1REFDSjtNQUFBLHVDQUFBO01BQUE7VUFBQSwrQ0FFQTtNQUFBLGdEQUFHO01BQUEsVUFFSDtNQUFBLDBCQUVBO01BQUE7SUFBQTtJQUFBO0lBQXFCO01BQUE7TUFBQTtJQUFBO0lBQXJCO0VBQUEsY0FBQTtNQUFBO01BQUEsdUJBRUE7TUFBQSxpREFBNkI7TUFBQSwrQkFFN0I7TUFBQSx1RUFBQTtNQUFBLGlEQUVBO01BQUE7TUFBNkIsMkRBRTdCO1VBQUE7VUFBQSx5QkFBQTtVQUFBLGNBQ0E7OztRQWZjO1FBQUE7UUFBZCxXQUFjLG1CQUFkO1FBTUc7UUFBSCxZQUFHLFNBQUg7UUFJQTtRQUlBOzs7UUFaRztRQUFBO1FBRUc7UUFBTixXQUFNLFNBQU47OzsifQ==
});
