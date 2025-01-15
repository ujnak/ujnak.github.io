/*
* 非モーダル・ダイアログに表示されているレポートの表示を制御する。
*/
const channel = new BroadcastChannel('exchange-event');

const controlsElement = document.getElementById("CONTROLS");
const controls = apex.actions.createContext("controls", controlsElement);

/*
* ボタンのカスタム属性data-actionに基づいて、ボタンのアクションを実行する。
*/
controls.add([
    {
        name: "SEARCH",
        action: (event, element, args) => {
            apex.server.process(
                "ADD_FILTER",
                {
                    pageItems: "#P1_ENAME"
                },
                {
                    success: (data) => {
                        // この例では、dataとして受け取るのは{ success: true }のみ
                        channel.postMessage({ type: "refresh", data: data });
                    }
                }
            );
        }
    },
    {
        name: "CLEAR",
        action: (event, element, args) => {
            apex.server.process(
                "CLEAR_REPORT",
                {},
                {
                    success: (data) => {
                        // clearでも、dataとして受け取るのは{ success: true }のみ
                        channel.postMessage({ type: "refresh", data: data });
                    }
                }
            );
        }
    }
]);
