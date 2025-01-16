import 'https://cdn.jsdelivr.net/npm/@theatre/browser-bundles@0.7.2/dist/core-and-studio.js';
/*
* プロジェクトはプロダクションのページと共有するため、別ページにファンクションとして
* 定義する。
*/
import prepareProject from './project.js';
// We can now access Theatre.core and Theatre.studio from here
const { core, studio } = Theatre;

/*
* プロジェクトIDは、アプリケーション・アイテムG_PROJECT_IDに定義されている。
*/
const projectId = apex.item("P2_PROJECT_ID").getValue();
apex.debug.info("projectId: ", projectId);

/*
* データベースに保存されているアニメーションを取り出して、
* それでStudioを初期化する。
*/
apex.server.process(
  "RESTORE_PROJECT_STATE",
  {
    pageItems: "#P2_PROJECT_ID"
  },
  {
    success: (data) => {
      const projectState = JSON.parse(data.state);
      /*
      * Theatre.jsのStudioを開始する。
      */
      studio.initialize(); // Start the Theatre.js UI
      /*
      * Theatre.jsのStudioの起動時は、アニメーションのデータをlocalStorageから
      * 取り出す。DBから取り出したprojectStateを与えると、Studioは
      * ブラウザとディスクのデータでConflictがあると報告する。
      * ブラウザとディスクのどちらを使うか選択できるので、DBのデータを使う場合は
      * ブラウザ、localStorageを使う場合はディスクを選択する。
      */
      apex.debug.info("initial projectStage: ", projectState);
      const r = prepareProject(core, projectId, projectState);
      /*
      * アニメーションはブラウザのlocalStorageから取り出すので、project自体は
      * 初期化以後、参照することがない。
      */
    }
  }
)

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