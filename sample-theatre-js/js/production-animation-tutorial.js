// only import core
import 'https://cdn.jsdelivr.net/npm/@theatre/browser-bundles@0.7.2/dist/core-only.min.js'
// We can now access just Theatre.core from here
const { core } = Theatre;

const projectId = apex.item("P1_PROJECT_ID").getValue();
apex.debug.info("projectId: ", projectId);

/*
* Theatre.jsのアニメーションを表示する処理。
* 
* コード自体はGetting StartedのWith HTML/SVGに記載されているものだが、
* 処理はボタンIMPORTを押した時に実行されるように、ファンクションにしている。
* https://www.theatrejs.com/docs/latest/getting-started/with-html-svg
*/
async function restoreProjectState( projectId ) {
  const articleHeadingElement = document.getElementById('article-heading');

  /*
  * アニメーションを定義しているJSONは、データベースから取り出す。
  */
  const response = await apex.server.process(
    "RESTORE_PROJECT_STATE",
    {
      x01: projectId
    }
  );
  const projectState = JSON.parse(response.state);
  apex.debug.info("projectState: ", projectState);

  /*
  * 以下はGetting StartedのWith HTML/SVGのコード
  */
  const project = core.getProject( projectId, {
    state: projectState,
  });
  
  const sheet = project.sheet('Sheet 1');
  const obj = sheet.object('Heading 1', {
    y: 0,
    opacity: core.types.number(1, { range: [0, 1] }),
  });
  
  // animations
  obj.onValuesChange((obj) => {
    articleHeadingElement.style.transform = `translateY(${obj.y}px)`
    articleHeadingElement.style.opacity = obj.opacity
  });
  
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
    // IMPORTはこのページで処理する。
    name: "IMPORT",
    action: (event, element, args) => {
      restoreProjectState( projectId );
    }
  }
]);