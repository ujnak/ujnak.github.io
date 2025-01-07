
/*
 * lottie-webの実装
 * Ref: https://airbnb.io/lottie/#/web
 */
import lottie from 'lottie-web';

apex.debug.info('app-lottie.js is loaded.');

/* 発生したイベントを表示するページ・アイテム */
const eventItem = apex.item("P2_EVENT");

/* アニメーションを表示する要素 */
const lottieContainer = document.getElementById('lottie-container');
/* アニメーションのデータ */
const lottieFile = apex.env.APP_FILES + 'MyFirstLottie.json';

/* アニメーションの表示を開始 */
const animation = lottie.loadAnimation({
    container: lottieContainer,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: lottieFile,
    name: 'myFirstLottie'
});

/* 
 * メソッドの一部をボタンに割り付ける。
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

/* 発生するイベントの一部を確認 */
/* loop = true */
animation.addEventListener('loopComplete', (event) => {
    eventItem.setValue(JSON.stringify(event));
});
/* loop <> true */
animation.addEventListener('complete', (event) => {
    eventItem.setValue(JSON.stringify(event));
});