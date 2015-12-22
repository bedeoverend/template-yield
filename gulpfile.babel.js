import gulp from 'gulp';
import del from 'del';
import path from 'path';
import notify from 'gulp-notify';
import filter from 'gulp-filter';
import gulpif from 'gulp-if';
import gulprun from 'run-sequence';
import vulcanize from 'gulp-vulcanize';
import eslint from 'gulp-eslint';
import rollup from 'gulp-rollup';
import npm from 'rollup-plugin-npm';
import commonJs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import minify from 'gulp-minify-inline';
import plumber from 'gulp-plumber';
import yargs from 'yargs';
import browserSync from 'browser-sync';
import wct from 'web-component-tester';
import { componentImports, name as ELEMENT_NAME } from './bower.json';


const imports = componentImports.map(dep => `../${dep}`),
      bs = browserSync.create(),
      argv = yargs.alias('d', 'debug').boolean(['debug']).argv,
      errorNotifier = () => plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }),
      options = {
        rollup: {
          plugins: [
            npm({ main: true }),
            commonJs(),
            babel({
              presets: ['es2015-rollup']
            })
          ]
        },
        postcss: [
          autoprefixer()
        ],
        vulcanize: {
          stripComments: true,
          inlineCss: true,
          inlineScripts: true,
          addedImports: imports
        },
        browserSync: {
          server: {
            baseDir: './',
            index: 'demo/index.html',
            routes: {
              '/': './bower_components',
              [`/${ELEMENT_NAME}.html`]: `./${ELEMENT_NAME}.html`
            }
          },
          open: false
        }
      };

wct.gulp.init(gulp);

gulp.task('process', () => {
  let js = filter((file) => /\.(js)$/.test(file.path), { restore: true }),
      css = filter((file) => /\.(css)$/.test(file.path), { restore: true });

  return gulp.src(['src/**/*.{html,js,css}', 'src/*.{html,js,css}'])
          .pipe(errorNotifier())

            // Js
            .pipe(js)
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(gulpif(!argv.debug, eslint.failAfterError()))
            .pipe(rollup(options.rollup))
            .pipe(js.restore)

            // CSS
            .pipe(css)
            .pipe(postcss(options.postcss))
            .pipe(css.restore)

          .pipe(gulp.dest('.tmp'));
});

gulp.task('build', ['process'], () => {
  return gulp.src([`.tmp/${ELEMENT_NAME}/${ELEMENT_NAME}.html`,`.tmp/${ELEMENT_NAME}.html`])
          .pipe(errorNotifier())
          .pipe(vulcanize(options.vulcanize))
          .pipe(gulpif(!argv.debug, minify()))
        .pipe(gulp.dest('.'));
});

gulp.task('run', callback => {
  if (argv.debug) {
    gulprun('build', callback)
  } else {
    gulprun('build', 'clean', callback)
  }
});

gulp.task('clean', () => del([ '.tmp' ]));

gulp.task('demo', () => bs.init(options.browserSync));

gulp.task('refresh', () => bs.reload());

gulp.task('test', ['run', 'test:local']);

gulp.task('watch', () => gulp.watch(['src/**/*'], () => gulprun('run', 'refresh')));
gulp.task('default', ['run', 'demo', 'watch']);
