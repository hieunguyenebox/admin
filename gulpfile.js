const gulp = require('gulp');
const nodemon = require('gulp-nodemon')
var ts = require("gulp-typescript");
const fs = require('fs')

const tsProject = ts.createProject("./tsconfig.json", {
  module: "commonjs"
});

const build = (done) => {
  // copy schema file
  gulp.src('src/schema.gql').pipe(gulp.dest('dist'))
  buildTS('src/**/*.ts', 'dist', done)
}

const buildTS = (path, dist, done) => {

  // compile typescript
  const tsResult = gulp.src(path).pipe(tsProject())
  tsResult
    .js.pipe(gulp.dest(dist))
    .on('finish', () => {
      fs.writeFile('nodemoon', Date.now(), () => { })
      if (typeof done === 'function')
        done()
    })
}

const start = (done) => {
  nodemon({
    script: 'dist/server.js',
    env: { NODE_ENV: 'development' },
    watch: 'nodemoon'
  })
  done()
}


const watch = (done) => {

  const schemaWatch = gulp.watch('src/schema.gql')
  schemaWatch.on('change', (path) => {
    gulp.src('src/schema.gql').pipe(gulp.dest('dist'))
  })

  const watcher = gulp.watch('src/**/*.ts')
  watcher.on('change', (path) => {
    // get path of file
    let distPath = path.replace('src/', 'dist/').split('/')
    distPath.pop()
    distPath = distPath.join('/')

    buildTS(path, distPath)
  })

  done()
}

exports.build = build

exports.dev = gulp.series(build, watch, start)
