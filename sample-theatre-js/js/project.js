/*
* 以下はTheatre.jsのGetting StartedのWith HTML/SVGのコード
* https://www.theatrejs.com/docs/latest/getting-started/with-html-svg
*/
export default function prepareProject( core, projectId, projectState ) {
    // Studioから呼ばれたときは、projectStateはnullが渡される。
    const project = core.getProject( projectId, {
            state: projectState
    });

    const sheet = project.sheet('Sheet 1');
    const obj = sheet.object('Heading 1', {
        y: 0,
        opacity: core.types.number(1, { range: [0, 1] }),
    });
      
    const articleHeadingElement = document.getElementById('article-heading');
    
    // animations
    obj.onValuesChange((obj) => {
        articleHeadingElement.style.transform = `translateY(${obj.y}px)`
        articleHeadingElement.style.opacity = obj.opacity
    });

    return { project: project, sheet: sheet, obj: obj };
}