/*
* 非モーダル・ダイアログに表示されているレポートの表示を制御する。
*/
const channel = new BroadcastChannel('exchange-event');

const controlsElement = document.getElementById("CONTROLS");
const controls = apex.actions.createContext("controls", controlsElement);

/*
* レポートを開いているウィンドウを保持する変数。
*/
var reportWindow = null;

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
                        /*
                        * 属性reportとして、リフレッシュ対象のレポートの静的IDが返される。
                        * 返されたレポートの静的IDは、そのままイベントに渡す。
                        */
                        channel.postMessage({ type: "refresh", target: data });
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
                        // CLEARもSERCHと同様、Ajaxコールバックのレスポンスをそのまま渡す。
                        channel.postMessage({ type: "refresh", target: data });
                        // ページ・アイテムP1_ENAMEをクリアする。
                        apex.item("P1_ENAME").setValue(null);
                    }
                }
            );
        }
    },
    /*
    * OPENについては、APEXアクションを使って定義する必要はありません。
    *
    * ボタンのプロパティの動作のアクションに、このページにリダイレクトを選択し、
    * 宛先のターゲットとなるページを設定すれば、以下と同様の処理が行われます。
    * 
    * APEX_PAGE.GET_URLのターゲットが標準ページとダイアログで、返されるURLが
    * 異なることを示すために、この例を含めている。
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
                        if ( url.startsWith("javascript:") ) {
                            /*
                            * URLがjavascript:で始まる場合、ダイアログとしてページを開く。
                            * URLはJavaScriptとしてそのまま実行する。
                            */
                            eval(url);
                        }
                        else
                        {
                            /*
                            * URLがjavascript:で始まらない標準ページは、新しいウィンドウで開く。
                            * ウィンドウのハンドラを取得するために、noopener: falseを指定する。
                            */                         
                            reportWindow = apex.navigation.openInNewWindow(url, "_blank", { noopener: false });
                            apex.debug.info("reportWindow: ", reportWindow);
                        }
                    }
                }
            );
        }
    }
]);