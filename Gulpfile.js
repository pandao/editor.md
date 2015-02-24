'use strict';

var os           = require("os");
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

gulp.task('scss3', function() { 
	return scssTask('editormd.logo');
}); 

gulp.task('js', function() { 
  return gulp.src('src/js/**/*.js')
            .pipe(jshint('./.jshintrc'))
            .pipe(jshint.reporter('default'))
            .pipe(header(headerComment, {pkg : pkg, fileName : function(file) { 
                var name = file.path.split(file.base);
                return name[1].replace(/[\\\/]?/, '');
            }}))
            .pipe(gulp.dest('dist/js'))
            .pipe(rename({ suffix: '.min' }))
            .pipe(uglify())
            .pipe(gulp.dest('dist/js'))	
            .pipe(header(headerMiniComment, {pkg : pkg, fileName : function(file) {
                var name = file.path.split(file.base + ( (os.platform() === "win32") ? "\\" : "/") );
                return name[1].replace(/[\\\/]?/, '');
            }}))
            .pipe(gulp.dest('dist/js'))
            .pipe(notify({ message: 'js task complete' }));
}); 

var codeMirror = {
    path : {
        src : {
            mode : "lib/codemirror/mode",
            addon : "lib/codemirror/addon"
        },
        dist : "lib/codemirror"
    },
    modes : [
        "css",
        "sass",
        "shell",
        "sql",
        "clike",
        "php",
        "xml",
        "markdown",
        "javascript",
        "htmlmixed",
        "gfm",
        "http",
        "go",
        "dart",
        "coffeescript",
        "nginx",
        "python",
        "perl",
        "lua",
        "r", 
        "ruby", 
        "rst",
        "smartymixed",
        "vb",
        "vbscript",
        "velocity",
        "xquery",
        "yaml",
        "erlang",
        "jade",
    ],

    addons : [
        "edit/trailingspace", 
        "dialog/dialog", 
        "search/searchcursor", 
        "search/search", 
        "scroll/annotatescrollbar", 
        "search/matchesonscrollbar", 
        "display/placeholder", 
        "edit/closetag", 
        "fold/xml-fold", 
        "mode/overlay", 
        "selection/active-line", 
        "edit/closebrackets", 
        "display/fullscreen", 
        "search/searchcursor", 
        "search/match-highlighter"
    ]
};

gulp.task('codemirror-mode', function() { 
    
    var modes = [
        codeMirror.path.src.mode + "/meta.js"
    ];
    
    for(var i in codeMirror.modes) {
        var mode = codeMirror.modes[i];
        modes.push(codeMirror.path.src.mode + "/" + mode + "/" + mode + ".js");
    }
    
    return gulp.src(modes)
                .pipe(concat('modes.min.js'))
                .pipe(gulp.dest(codeMirror.path.dist))
                .pipe(uglify())
                .pipe(gulp.dest(codeMirror.path.dist))	
                .pipe(header(headerMiniComment, {pkg : pkg, fileName : function(file) {
                    var name = file.path.split(file.base + "\\");
                    return name[1].replace('\\', '');
                }}))
                .pipe(gulp.dest(codeMirror.path.dist))
                .pipe(notify({ message: 'codemirror-mode task complete' }));
}); 

gulp.task('codemirror-addon', function() { 
    
    var addons = [];
    
    for(var i in codeMirror.addons) {
        var addon = codeMirror.addons[i];
        addons.push(codeMirror.path.src.addon + "/" + addon + ".js");
    }
    
    return gulp.src(addons)
                .pipe(concat('addons.min.js'))
                .pipe(gulp.dest(codeMirror.path.dist))
                .pipe(uglify())
                .pipe(gulp.dest(codeMirror.path.dist))	
                .pipe(header(headerMiniComment, {pkg : pkg, fileName : function(file) {
                    var name = file.path.split(file.base + "\\");
                    return name[1].replace('\\', '');
                }}))
                .pipe(gulp.dest(codeMirror.path.dist))
                .pipe(notify({ message: 'codemirror-addon task complete' }));
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
	gulp.watch('src/scss/editormd.logo.scss', ['scss3']);
	gulp.watch('src/js/**/*.js', ['js']);
});

gulp.task('default', function() {
    gulp.run('scss');
    gulp.run('scss2');
    gulp.run('scss3');
    gulp.run('js');
    gulp.run("codemirror-addon");
    gulp.run("codemirror-mode");
    gulp.run('jsdoc');
});