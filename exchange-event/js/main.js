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
                        // ページ・アイテムP1_ENAMEをクリアする
                        apex.item("P1_ENAME").setValue(null);
                    }
                }
            );
        }
    },
    /*
    * OPENについては、APEXアクションを使って定義する必要はない。
    *
    * ボタンのプロパティの動作のアクションに、このページにリダイレクトを選択し、
    * 宛先のターゲットとなるページを設定すれば、そのページがダイアログであれば、
    * 以下と同じ処理が行われ、ページの設定に従ったダイアログが開かれる。
    * 
    * APEX_PAGE.GET_URLのターゲットがダイアログのときに、内部的にどのように
    * 処理されるのかを理解するために、この例を含めている。
    */
    {
        name: "OPEN",
        action: (event, element, args) => {
            apex.server.process(
                "GET_URL",
                {},
                {
                    success: (data) => {
                        const url = data.url;
                        apex.debug.info("url: ", url);
                        eval(url);
                    }
                }
            );
        }
    }
]);