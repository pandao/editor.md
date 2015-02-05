'use strict';

var gulp         = require('gulp');
var gutil        = require("gulp-util");
var sass         = require('gulp-ruby-sass');
var jshint       = require('gulp-jshint');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var concat       = require('gulp-concat');
var notify       = require('gulp-notify');
var header       = require('gulp-header');
var minifycss    = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var jsdoc        = require("gulp-jsdoc");
var jsdoc2md     = require("gulp-jsdoc-to-markdown");
var pkg          = require('./package.json');
var dateFormat   = require('dateformatter').format;

pkg.name         = "Editor.md";
pkg.today        = dateFormat;

var headerComment = ["/*", 
					" * <%= pkg.name %>",
					" * @file        <%= fileName(file) %> ",
					" * @version     v<%= pkg.version %> ",
					" * @description <%= pkg.description %>",
					" * @license     MIT License",
					" * @author      <%= pkg.author %>",
					" * {@link       <%= pkg.homepage %>}",
					" * @updateTime  <%= pkg.today('Y-m-d') %>",
					" */", 
					"\r\n"].join("\r\n");

var headerMiniComment = "/*! <%= pkg.name %> v<%= pkg.version %> | <%= fileName(file) %> | <%= pkg.description %> | MIT License | By: <%= pkg.author %> | <%= pkg.homepage %> | <%=pkg.today('Y-m-d') %> */\r\n";

var scssTask = function(fileName, path) {
    
    path = path || 'src/scss/';
    
    return gulp.src(path + fileName + ".scss")
           .pipe(sass({ style: 'expanded' }))   //nested,compact,expanded,compressed
           //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
           .pipe(gulp.dest('dist/css')) 
            .pipe(header(headerComment, {pkg : pkg, fileName : function(file) { 
                var name = file.path.split(file.base);
                return name[1].replace('\\', '');
            }}))
           .pipe(gulp.dest('dist/css')) 
           .pipe(rename({ suffix: '.min' }))
           .pipe(gulp.dest('dist/css'))
           .pipe(minifycss())
           .pipe(gulp.dest('dist/css')) 
            .pipe(header(headerMiniComment, {pkg : pkg, fileName : function(file) { 
                var name = file.path.split(file.base);
                return name[1].replace('\\', '');
            }}))
           .pipe(gulp.dest('dist/css')) 
           .pipe(notify({ message: fileName + '.scss task completed!' }));
};

gulp.task('scss', function() { 
	return scssTask('editormd');
}); 

gulp.task('scss2', function() { 
	return scssTask('editormd.preview');
}); 

gulp.task('js', function() { 
  return gulp.src('src/js/editormd.js')
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('default'))
    //.pipe(concat('all.js'))
    //.pipe(gulp.dest('dist/js'))
	.pipe(header(headerComment, {pkg : pkg, fileName : function(file) { 
		var name = file.path.split(file.base);
		return name[1].replace('\\', '');
	}}))
	.pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))	
	.pipe(header(headerMiniComment, {pkg : pkg, fileName : function(file) {
		var name = file.path.split(file.base + "\\");
		return name[1].replace('\\', '');
	}}))
	.pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'js task complete' }));
}); 

gulp.task("jsdoc", function(){
    return gulp.src(["./src/editormd.js", "README.md"])
               .pipe(jsdoc.parser())
               .pipe(jsdoc.generator('./docs/html'));
});

gulp.task("jsdoc2md", function() {
    return gulp.src("src/js/editormd.js")
        .pipe(jsdoc2md())
        .on("error", function(err){
            gutil.log(gutil.colors.red("jsdoc2md failed"), err.message)
        })
        .pipe(rename(function(path) {
            path.extname = ".md";
        }))
        .pipe(gulp.dest("docs/markdown"));
});

gulp.task('watch', function() { 
	gulp.watch('src/scss/editormd.scss', ['scss']);
	gulp.watch('src/scss/editormd.preview.scss', ['scss2']);
	gulp.watch('src/js/editormd.js', ['js']);
});

gulp.task('default', function() {
    gulp.run('scss');
    gulp.run('scss2');
    gulp.run('js');
});