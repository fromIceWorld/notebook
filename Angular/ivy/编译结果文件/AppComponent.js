(function anonymous(
    jit___elementContainer_0,
    jit___elementStart_1,
    jit___text_2,
    jit___elementEnd_3,
    jit___advance_4,
    jit___textInterpolate1_5,
    jit___defineComponent_6,
    jit_AppComponent_7,
    jit___viewQuery_8,
    jit___queryRefresh_9,
    jit___loadQuery_10,
    jit___NgOnChangesFeature_11,
    jit___template_12,
    jit___element_13,
    jit___listener_14,
    jit___templateRefExtractor_15,
    jit___reference_16,
    jit___property_17,
    jit___textInterpolate_18
) {
    'use strict';
    'use strict';
    var _c0 = ['dir'];
    function AppComponent_ng_container_2_Template(rf, ctx) {
        if (rf & 1) {
            jit___elementContainer_0(0);
        }
    }
    function AppComponent_ng_template_20_Template(rf, ctx) {
        if (rf & 1) {
            jit___elementStart_1(0, 'p');
            jit___text_2(1);
            jit___elementEnd_3();
        }
        if (rf & 2) {
            var name_r4 = ctx.$implicit;
            jit___advance_4(1);
            jit___textInterpolate1_5('被嵌入的视图; 上下文:', name_r4, '');
        }
    }
    var $def = jit___defineComponent_6({
        type: jit_AppComponent_7,
        selectors: [['app-root']],
        viewQuery: function AppComponent_Query(rf, ctx) {
            if (rf & 1) {
                jit___viewQuery_8(_c0, 1);
            }
            if (rf & 2) {
                var _t;
                jit___queryRefresh_9((_t = jit___loadQuery_10())) &&
                    (ctx.dir = _t.first);
            }
        },
        features: [jit___NgOnChangesFeature_11],
        decls: 22,
        vars: 5,
        consts: [
            [1, 'font-color', 'fonr', 2, 'background-color', 'black'],
            [4, 'ngTemplateOutlet', 'ngTemplateOutletContext'],
            [3, 'textContent'],
            ['dir', ''],
            ['back-color', 'blue', 3, 'dirEvent'],
            [2, 'color', 'goldenrod'],
            [1, 'in'],
            ['id', 'in2'],
            [3, 'tochild', 'childEmit'],
            ['tem1', ''],
        ],
        template: function AppComponent_Template(rf, ctx) {
            if (rf & 1) {
                jit___elementStart_1(0, 'div', 0);
                jit___text_2(1, 'work');
                jit___elementEnd_3();
                jit___template_12(
                    2,
                    AppComponent_ng_container_2_Template,
                    1,
                    0,
                    'ng-container',
                    1
                );
                jit___elementStart_1(3, 'p');
                jit___text_2(4);
                jit___elementEnd_3();
                jit___element_13(5, 'span', 2);
                jit___elementStart_1(6, 'h4', null, 3);
                jit___text_2(8, '-------指令----------');
                jit___elementEnd_3();
                jit___elementStart_1(9, 'p', 4);
                jit___listener_14(
                    'dirEvent',
                    function AppComponent_Template_p_dirEvent_9_listener(
                        $event
                    ) {
                        return ctx.handleEvent($event);
                    }
                );
                jit___elementEnd_3();
                jit___elementStart_1(10, 'p', 5);
                jit___text_2(11, '----------本模块子组件--------');
                jit___elementEnd_3();
                jit___elementStart_1(12, 'app-card');
                jit___elementStart_1(13, 'p', 6);
                jit___text_2(14, '主视图投影进来的段落1');
                jit___elementEnd_3();
                jit___elementStart_1(15, 'p', 7);
                jit___text_2(16, '主视图投影进来的段落2');
                jit___elementEnd_3();
                jit___elementStart_1(17, 'p');
                jit___text_2(18, '主视图投影进来的段落3');
                jit___elementEnd_3();
                jit___elementEnd_3();
                jit___elementStart_1(19, 'app-child', 8);
                jit___listener_14(
                    'childEmit',
                    function AppComponent_Template_app_child_childEmit_19_listener(
                        $event
                    ) {
                        return ctx.handleEvent($event);
                    }
                );
                jit___elementEnd_3();
                jit___template_12(
                    20,
                    AppComponent_ng_template_20_Template,
                    2,
                    1,
                    'ng-template',
                    null,
                    9,
                    jit___templateRefExtractor_15
                );
            }
            if (rf & 2) {
                var _r2 = jit___reference_16(21);
                jit___advance_4(2);
                jit___property_17('ngTemplateOutlet', _r2)(
                    'ngTemplateOutletContext',
                    ctx.myContext
                );
                jit___advance_4(2);
                jit___textInterpolate_18(ctx.title);
                jit___advance_4(1);
                jit___property_17('textContent', 'Hello ' + ctx.title);
                jit___advance_4(14);
                jit___property_17('tochild', ctx.title);
            }
        },
        styles: [
            '.font-color[_ngcontent-%COMP%] {\r\n  color: bisque;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsYUFBYTtBQUNmIiwiZmlsZSI6ImFwcC5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmZvbnQtY29sb3Ige1xyXG4gIGNvbG9yOiBiaXNxdWU7XHJcbn1cclxuIl19 */',
        ],
    });
    return { $def: $def };
    //# sourceURL=ng:///AppComponent.js
    //# sourceMappingURL=data:application/json;base64,eyJmaWxlIjoibmc6Ly8vQXBwQ29tcG9uZW50LmpzIiwidmVyc2lvbiI6Mywic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibmc6Ly8vQXBwQ29tcG9uZW50LmpzIiwibmc6Ly8vQXBwQ29tcG9uZW50L3RlbXBsYXRlLmh0bWwiXSwic291cmNlc0NvbnRlbnQiOlsiICIsIjxkaXYgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiBibGFja1wiIGNsYXNzPVwiZm9udC1jb2xvciBmb25yXCI+d29yazwvZGl2PlxuPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInRlbTE7IGNvbnRleHQ6IG15Q29udGV4dFwiPjwvbmctY29udGFpbmVyPlxuPHA+e3sgdGl0bGUgfX08L3A+XG48c3BhbiBbdGV4dENvbnRlbnRdPVwiJ0hlbGxvICcgKyB0aXRsZVwiPjwvc3Bhbj5cbjxoNCAjZGlyPi0tLS0tLS3mjIfku6QtLS0tLS0tLS0tPC9oND5cbjxwIGJhY2stY29sb3I9XCJibHVlXCIgKGRpckV2ZW50KT1cImhhbmRsZUV2ZW50KCRldmVudClcIj48L3A+XG48cCBzdHlsZT1cImNvbG9yOiBnb2xkZW5yb2RcIj4tLS0tLS0tLS0t5pys5qih5Z2X5a2Q57uE5Lu2LS0tLS0tLS08L3A+XG48YXBwLWNhcmQ+XG4gIDxwIGNsYXNzPVwiaW5cIj7kuLvop4blm77mipXlvbHov5vmnaXnmoTmrrXokL0xPC9wPlxuICA8cCBpZD1cImluMlwiPuS4u+inhuWbvuaKleW9sei/m+adpeeahOauteiQvTI8L3A+XG4gIDxwPuS4u+inhuWbvuaKleW9sei/m+adpeeahOauteiQvTM8L3A+XG48L2FwcC1jYXJkPlxuPGFwcC1jaGlsZCBbdG9jaGlsZF09XCJ0aXRsZVwiIChjaGlsZEVtaXQpPVwiaGFuZGxlRXZlbnQoJGV2ZW50KVwiPjwvYXBwLWNoaWxkPlxuPG5nLXRlbXBsYXRlICN0ZW0xIGxldC1uYW1lPlxuICA8cD7ooqvltYzlhaXnmoTop4blm747IOS4iuS4i+aWhzp7eyBuYW1lIH19PC9wPlxuPC9uZy10ZW1wbGF0ZT5cbiJdLCJtYXBwaW5ncyI6IkFBQUE7OztnQkNDQTs7OztJQWFFO0lBQUc7SUFBc0I7Ozs7SUFBdEI7SUFBQTs7Ozs7Ozs7Ozs7Ozs7OztRQWRMO1FBQTZEO1FBQUk7UUFDakU7YUFBQTtRQUNBO1FBQUc7UUFBVztRQUNkO1FBQ0E7UUFBUztRQUFtQjtRQUM1QjtRQUFxQjtvQkFBWTtTQUFaO1FBQWlDO1FBQ3REO1FBQTRCO1FBQXdCO1FBQ3BEO1FBQ0U7UUFBYztRQUFXO1FBQ3pCO1FBQVk7UUFBVztRQUN2QjtRQUFHO1FBQVc7UUFDaEI7UUFDQTtRQUE2QjtvQkFBYTtTQUFiO1FBQWtDO1FBQy9EO2dEQUFBOzs7O1FBWmU7UUFBQTtRQUNaO1FBQUE7UUFDRztRQUFBO1FBU0s7UUFBQTs7OyJ9
});
