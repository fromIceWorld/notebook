import css from 'rollup-plugin-css-only';
import font from 'rollup-plugin-font';

export default {
    input: 'index.js',
    output: {
        file: 'dist/style.css',
        format: 'es',
    },
    plugins: [
        css(),
        font({
            svg: './node_modules/ionicons/fonts/ionicons.svg',
            css: {
                include: ['./font.css'],
            },
            whiteList: ['ion-alert'],
        }),
    ],
};
