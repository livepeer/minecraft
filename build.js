const fs = require('fs')
const [html] = fs
  .readFileSync('./index.html', 'utf8')
  .split('<script src="./index.js"></script>')
const js = fs.readFileSync('./src/index.min.js', 'utf8')

fs.writeFileSync(
  'dist/index.html',
  html + `<script>${js}\n</script></body></html>`,
  'utf8',
)
