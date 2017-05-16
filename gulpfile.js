(function () {
  'use strict';

  // Include gulp
  var gulp = require('gulp');

  // Include Our Plugins
  var exec              = require('child_process').exec;
  var htmlhint          = require('gulp-htmlhint');
  var prompt            = require('gulp-prompt');
  var release           = require('gulp-github-release');
  var gulpif            = require('gulp-if');
  var zip               = require('gulp-zip');
  var argv              = require('yargs').argv;
  var autoprefixer      = require('gulp-autoprefixer');
  var concat            = require('gulp-concat');
  var del               = require('del');
  var jshint            = require('gulp-jshint');
  var minifycss         = require('gulp-minify-css');
  var notify            = require('gulp-notify');
  var path              = require('path');
  var runSequence       = require('run-sequence');
  var sass              = require('gulp-sass');
  var connect           = require('gulp-connect');
  var uglify            = require('gulp-uglify');
  var cleanCSS          = require('gulp-clean-css');

  // Variables
  var release_version;
  var src_app                 = './app';
  var src_base_dir            = './app/assets';
  var src_js_files            = [
    path.join(src_base_dir, 'js/plugins', '**', '*.js'),
    path.join(src_base_dir, 'js', '*.js'),
  ];
  var src_js_global_files     = path.join(src_base_dir, 'jsGlobals', '**', '*.js');
  var src_js_data             = path.join(src_base_dir, 'js/data', '**', '*.js');
  var src_fonts_files         = path.join(src_base_dir, 'fonts', '**', '*');
  var src_sass_files          = path.join(src_base_dir, 'sass', '**', '*.scss');
  var dist_folder             = 'dist';
  var dist_base_dir           = './app';
  var release_base_dir        = './release';
  var dist_js_dir             = 'js';
  var dist_css_dir            = 'css';
  var dist_font_dir           = 'fonts';
  var dist_font_dir_bootstrap = path.join(dist_font_dir, 'bootstrap');
  var dist_html_dir           = 'templates';
  var dist_img_dir            = 'images';
  var src_html_files          = path.join(src_app, dist_html_dir, '**', '*.html');
  var src_py_files            = './context_vars/*.py';

  var vendor_js_src               = [
    './bower_components/jquery/dist/jquery.min.js',
    './bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
    './bower_components/jquery-ui/jquery-ui.min.js',
    './bower_components/modernizr/modernizr.js',
    './bower_components/wowjs/dist/wow.min.js',
  ];

  var vendor_css_src              = [
    './bower_components/font-awesome/css/font-awesome.min.css',
    './bower_components/wowjs/css/libs/animate.css',
  ];

  var vendor_source_maps          = [
    './bower_components/jquery/dist/jquery.min.map',
  ];

  var vendor_font_src             = [
    './bower_components/font-awesome/fonts/*',
  ];

  var vendor_font_src_bootstrap   = [
    './bower_components/bootstrap-sass/assets/fonts/bootstrap/*',
  ];

  // Functions helpers
  function getPath(nextPath, argv) {
    if (argv.release) {
      return path
        .join(release_base_dir, dist_folder, nextPath);
    }

    return path
      .join(dist_base_dir, dist_folder, nextPath);
  }

  // Secundaries tasks
  gulp.task('jshint', function () {
    return gulp
      .src(src_js_files)
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('jshint-stylish', {
        verbose: true,
      }));
  }).help = 'Analyzes js code quality with jshint according default config file.';

  gulp.task('htmlhint', function () {
    return gulp
      .src(getPath('*.html', argv))
      .pipe(htmlhint())
      .pipe(htmlhint.reporter('htmlhint-stylish'));
  }).help = 'Analyzes html code quality with htmlhint according default config file.';

  gulp.task('sass', function () {
    return gulp
      .src(src_sass_files)
      .pipe(sass({
        errLogToConsole: true,
        outputStyle: 'expanded',
        sourceComments: true,
      }))
      .pipe(autoprefixer({
        browsers: ['last 3 version', 'ie >= 10'],
      }))
      .pipe(gulpif(argv.uglify, cleanCSS({ compatibility: 'ie8' })))
      .pipe(gulp.dest(getPath(dist_css_dir, argv)));
  }).help = 'Compiles and autoprefixes sass source files.';

  gulp.task('vendor-css', function () {
    return gulp
      .src(vendor_css_src)
      .pipe(concat('vendor.css'))
      .pipe(gulpif(argv.uglify, cleanCSS({ compatibility: 'ie8' })))
      .pipe(gulp.dest(getPath(dist_css_dir, argv)));
  }).help = 'Concatenates css vendor files.';

  gulp.task('vendor-fonts-dir', ['vendor-fonts', 'vendor-font-bootstrap']).help = 'Adds fonts vendor files.';

  gulp.task('vendor-fonts', function () {
    return gulp
      .src(vendor_font_src)
      .pipe(gulp.dest(getPath(dist_font_dir, argv)));
  }).help = 'Adds fonts vendor files.';

  gulp.task('vendor-font-bootstrap', function () {
    return gulp
      .src(vendor_font_src_bootstrap)
      .pipe(gulp.dest(getPath(dist_font_dir_bootstrap, argv)));
  }).help = 'Adds fonts vendor files.';

  gulp.task('scripts', function () {
    return gulp
      .src(src_js_files)
      .pipe(concat('app.js'))
      .pipe(gulpif(argv.uglify, uglify()))
      .pipe(gulp.dest(getPath(dist_js_dir, argv)));
  }).help = 'Concatenates and minifies all js files.';

  gulp.task('globals-scripts', function() {
    return gulp
      .src(src_js_global_files)
      .pipe(concat('globals.js'))
      .pipe(gulpif(argv.uglify, uglify()))
      .pipe(gulp.dest(getPath(dist_js_dir, argv)));
  }).help = 'Concatenates and minifies all js files.';

  gulp.task('data', function() {
    return gulp
      .src(src_js_data)
      .pipe(concat('data.js'))
      .pipe(gulpif(argv.uglify, uglify()))
      .pipe(gulp.dest(getPath(dist_js_dir, argv)));
  }).help = 'Concatenates and minifies all data files.';

  gulp.task('watch', function() {
    gulp.watch(src_js_files, ['jshint', 'scripts', 'data']);
    gulp.watch(src_sass_files, ['sass']);
    gulp.watch(src_html_files, ['jinja']);
    gulp.watch(src_py_files, ['jinja']);
  }).help = 'Keeps watching for changes in sass (trigger jshint and scripts) and javascript (trigger sass).';

  gulp.task('clean', function(cb) {
    del([getPath('', argv)], cb);
  }).help = 'Removes files in css and javascript destination folders.';

  gulp.task('clean-release', function(cb) {
    del([release_base_dir], cb);
  }).help = 'Removes files in css and javascript destination folders.';

  gulp.task('jinja', function(cb) {
    var build = './build.py';
    if (argv.release) {
      build = './build-release.py';
    }
    exec('python3 ' + build, function(err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);

      runSequence(['htmlhint']);
    });
  });

  gulp.task('images', function() {
    // Slick
    gulp
      .src(['./node_modules/slick-carousel/slick/ajax-loader.gif'])
      .pipe(gulp.dest(getPath(dist_css_dir, argv)));

    return gulp
      .src(['app/assets/images/**/*'])
      .pipe(gulp.dest(getPath(dist_img_dir, argv)));
  });

  gulp.task('fonts', function() {
    // Slick fonts
    gulp
      .src(['./node_modules/slick-carousel/slick/fonts/*'])
      .pipe(gulp.dest(getPath(dist_css_dir + '/fonts', argv)));

    return gulp
      .src([src_fonts_files])
      .pipe(gulp.dest(getPath(dist_font_dir, argv)));
  });

  gulp.task('old_browsers', function() {
    return gulp
      .src(['app/assets/js/old_browsers_support/**/*'])
      .pipe(gulp.dest('app/dist/js/old_browsers_support'));
  });

  gulp.task('inject-bower',function() {
    gulp.src(vendor_js_src)
      .pipe(gulp.dest(getPath(dist_js_dir, argv)));
  });

  gulp.task('connect', function() {
    return connect.server({
      root: './app/dist',
      port: 7000,
      livereload: false
    });
  });

  gulp.task('create-release-zip', function() {
    return gulp
      .src(getPath('**/*', argv))
      .pipe(zip(release_version + '.zip'))
      .pipe(gulp.dest(release_base_dir));
  });

  gulp.task('upload-release', function() {
    gulp
      .src('')
      .pipe(prompt
        .prompt([{
          type: 'password',
          name: 'token',
          message: 'Please, insert a token string.'
        }],
        function(res){
          gulp
            .src([path.join(release_base_dir, release_version + '.zip')])
            .pipe(release({
              token: res.token,
              tag: release_version,
              manifest: require('./package.json')
            }));
        })
      );
  });

  gulp.task('create-release', function() {
    if (!argv.release) {
      return;
    }
    gulp
      .src('')
      .pipe(prompt
      .prompt([{
        type: 'input',
        name: 'version',
        message: 'Please, insert the version of release (v0.0.0).'
        }],
        function(res){
          release_version = res.version;
          runSequence(
            ['create-release-zip'],
            ['upload-release']
          );
        })
      );
  });

  // Primaries tasks
  gulp.task('build', function() {
    runSequence(
      ['clean', 'clean-release'],
      ['jshint', 'old_browsers', 'fonts', 'vendor-fonts-dir', 'images', 'sass', 'vendor-css', 'scripts', 'globals-scripts', 'inject-bower', 'jinja', 'data'],
      ['create-release'], // if has not param '--release', not work
      function() {
        gulp
          .src('')
          .pipe(notify({
            title: 'Build',
            message: 'Built task done.'
          }));
      }
    );
  }).help = 'Build assets for development. Executes sass, vendor-scripts and scripts.';

  gulp.task('default', function() {
    argv.release = false;
    runSequence(
      ['build'],
      ['watch'],
      ['connect'],
      function() {
        gulp
          .src('')
          .pipe(notify({
            title: 'Development',
            message: 'Run localhost server, watching for changes...'
          }));
      }
    );
  }).help = 'Build assets for development. Executes jshint, sass, vendor-scripts and scripts. Keeps watching for changes';
})();
