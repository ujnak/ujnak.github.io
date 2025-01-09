import 'https://cdn.jsdelivr.net/npm/@theatre/browser-bundles@0.5.0-insiders.88df1ef/dist/core-and-studio.js'
// We can now access Theatre.core and Theatre.studio from here
const { core, studio } = Theatre

studio.initialize() // Start the Theatre.js UI

const project = core.getProject('HTML Animation Tutorial')
const sheet = project.sheet('Sheet 1')
const obj = sheet.object('Heading 1', {
  y: 0, // you can use just a simple default value
  opacity: core.types.number(1, { range: [0, 1] }), // or use a type constructor to customize
})

const articleHeadingElement = document.getElementById('article-heading')

obj.onValuesChange((obj) => {
  articleHeadingElement.style.transform = `translateY(${obj.y}px)`
  articleHeadingElement.style.opacity = obj.opacity
})