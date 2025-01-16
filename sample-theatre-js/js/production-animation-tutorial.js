import 'https://cdn.jsdelivr.net/npm/@theatre/browser-bundles@0.7.2/dist/core-only.min.js';
/*
* プロジェクトの定義はプロダクションのページと共有するために、別ページにファンクションとして
* 定義する。
*/
import prepareProject from './project.js';
// We can now access just Theatre.core from here
const { core } = Theatre;

const projectId = apex.item("P1_PROJECT_ID").getValue();
apex.debug.info("projectId: ", projectId);

/*
* Theatre.jsのアニメーションを表示する処理。
* 
* ボタンIMPORTを押した時に実行されるように、ファンクションにしている。
*/
async function restoreProjectState(projectId ) {
  /*
  * アニメーションを定義しているJSONをデータベースから取り出す。
  */
  const response = await apex.server.process(
    "RESTORE_PROJECT_STATE",
    {
      pageItems: "#P1_PROJECT_ID"
    }
  );
  const projectState = JSON.parse(response.state);
  apex.debug.info("projectState: ", projectState);

  /*
  * アニメーションを実行する。
  */
  const r = prepareProject(core, projectId, projectState);
  const project = r.project;
  const sheet   = r.sheet;

  // wait for project to be ready
  project.ready.then(() => {
    apex.debug.info('project is ready', project);
    sheet.sequence.play({ iterationCount: Infinity })
  });
};

/*
* Theatre.jsのアニメーションのエクスポートとインポートを行う。
*/
const channel = new BroadcastChannel('control-theatre');

// エクスポートの成功をP1_STATUSに表示する。
channel.addEventListener("message", (event) => {
  apex.debug.info("status: ", event);
  if ( event.data.type === 'status' ) {
    apex.item("P1_STATUS").setValue(event.data.message);
  }
});

const controlElement = document.getElementById("CONTROLS");
const controls = apex.actions.createContext("controls", controlElement);

controls.add([
  {
    // EXPORTはStudioが実装されているページで処理する。
    name: "EXPORT",
    action: (event, element, args) => {
      channel.postMessage( { type: "export" } );
    }
  },
  {
    // ページをリロードしてアニメーションを初期化する。
    name: "RELOAD",
    action: (event, element, args) => {
      window.location.reload();
      apex.item("P1_STATUS").setValue(null);
    }
  },
  {
    // IMPORTはこのページで処理する。
    name: "IMPORT",
    action: (event, element, args) => {
      restoreProjectState( projectId );
      apex.item("P1_STATUS").setValue("projectState is restored.");
    }
  }
]);