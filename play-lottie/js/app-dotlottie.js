/*
 * dotLottie-webの実装
 * https://developers.lottiefiles.com/docs/dotlottie-player/dotlottie-web/
 */
import { DotLottie } from '@lottiefiles/dotlottie-web';

apex.debug.info('app-dotlottie.js is loaded.');

/* 発生したイベントを表示するページ・アイテム */
const eventItem = apex.item("P3_EVENT");

/* アニメーションを表示する要素 */
const lottieCanvas = document.getElementById('lottie-canvas');
/* アニメーションのデータ */
const lottieFile = apex.env.APP_FILES + 'MyFirstLottie.lottie';

/* アニメーションの表示を開始 */
const animation = new DotLottie({
    canvas: lottieCanvas,
    loop: true,
    autoplay: true,
    src: lottieFile
});

/* 
 * メソッドの一部をボタンに割り付ける。
 * https://developers.lottiefiles.com/docs/dotlottie-player/dotlottie-web/methods/
 */
const controlElm = document.getElementById('lottie-controls');
const controls = apex.actions.createContext('controls', controlElm);
controls.add([
    {
        name: "PLAY",
        action: (event, element, args) => {
            animation.play();
        }
    },
    {
        name: "PAUSE",
        action: (event, element, args) => {
            animation.pause();
        }
    },
    {
        name: "STOP",
        action: (event, element, args) => {
            animation.stop();
        }
    }
]);

/* 
 * 発生するイベントの一部を確認
 * https://developers.lottiefiles.com/docs/dotlottie-player/dotlottie-web/events/
 */
animation.addEventListener('loop', (event) => {
    eventItem.setValue(JSON.stringify(event));
});
animation.addEventListener('stop', (event) => {
    eventItem.setValue(JSON.stringify(event));
});