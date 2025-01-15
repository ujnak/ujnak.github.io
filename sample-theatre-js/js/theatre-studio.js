import 'https://cdn.jsdelivr.net/npm/@theatre/browser-bundles@0.7.2/dist/core-and-studio.js';
// We can now access Theatre.core and Theatre.studio from here
const { core, studio } = Theatre;

const projectId = apex.item("P2_PROJECT_ID").getValue();
apex.debug.info("projectId: ", projectId);

/*
* Theatre.jsのStudioを使用するための処理。
* 
* 以下のGetting StartedのWith HTML/SVGのコードそのままです。
* https://www.theatrejs.com/docs/latest/getting-started/with-html-svg
*/
studio.initialize(); // Start the Theatre.js UI

const project = core.getProject(projectId);

const sheet = project.sheet('Sheet 1')
const obj = sheet.object('Heading 1', {
  y: 0, // you can use just a simple default value
  opacity: core.types.number(1, { range: [0, 1] }), // or use a type constructor to customize
});

const articleHeadingElement = document.getElementById('article-heading');

obj.onValuesChange((obj) => {
  articleHeadingElement.style.transform = `translateY(${obj.y}px)`
  articleHeadingElement.style.opacity = obj.opacity
});

/*
* BroadcastChannelからイベントを受け取って、アニメーションをエクスポートする。
* 本サンプルで追加したデータベースへアニメーションを保存する処理。
*/
const channel = new BroadcastChannel('control-theatre');

channel.addEventListener("message", (event) => {
  apex.debug.info("event: ", event);
  if (event.data.type === "export") {
    /*
    * 現在のアニメーションの設定をJSONドキュメントとして取り出し。
    * サーバーに送信するためにページ・アイテムP2_PROJECT_STATEに
    * 設定する。
    */
    const projectState = studio.createContentOfSaveFile(projectId);
    apex.debug.info("projectState: ", projectState);
    apex.item("P2_PROJECT_STATE").setValue(JSON.stringify(projectState));

    /*
    * アニメーションをデータベースに保存する。
    */
    apex.server.process(
      "SAVE_PROJECT_STATE",
      {
        pageItems: "#P2_PROJECT_ID,#P2_PROJECT_STATE"
      },
      {
        success: (data) => {
          apex.debug.info(data);
          channel.postMessage( { type: "status", message: data.message } );
        }
      }
    )
  }
});