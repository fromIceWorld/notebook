var name2: string = '1';
function go() {
    return function (target: any) {
        target.console = function () {
            console.log('装饰器');
        };
    };
}
enum li {
    name = '123',
}
@go()
class com {
    private age = 12;
}
