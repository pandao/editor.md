"use strict";

var os           = require("os");
var gulp         = require("gulp");
var gutil        = require("gulp-util");
var sass         = require("gulp-ruby-sass");
var jshint       = require("gulp-jshint");
var uglify       = require("gulp-uglifyjs");
var rename       = require("gulp-rename");
var concat       = require("gulp-concat");
var notify       = require("gulp-notify");
var header       = require("gulp-header");
var minifycss    = require("gulp-minify-css");
//var jsdoc        = require("gulp-jsdoc");
//var jsdoc2md     = require("gulp-jsdoc-to-markdown");
var pkg          = require("./package.json");
var dateFormat   = require("dateformatter").format;
var replace      = require("gulp-replace");

pkg.name         = "Editor.md";
pkg.today        = dateFormat;

var headerComment = ["/*", 
					" * <%= pkg.name %>",
                    " *",
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
    
    path = path || "scss/";
    
    var distPath = "css";
    
    return sass(path + fileName + ".scss", { style: "expanded", sourcemap: false, noCache : true })
        .pipe(gulp.dest(distPath))
        .pipe(header(headerComment, {pkg : pkg, fileName : function(file) { 
            var name = file.path.split(file.base);
            return name[1].replace("\\", "");
        }}))
       .pipe(gulp.dest(distPath)) 
       .pipe(rename({ suffix: ".min" }))
       .pipe(gulp.dest(distPath))
       .pipe(minifycss())
       .pipe(gulp.dest(distPath)) 
        .pipe(header(headerMiniComment, {pkg : pkg, fileName : function(file) { 
            var name = file.path.split(file.base);
            return name[1].replace("\\", "");
        }}))
       .pipe(gulp.dest(distPath)) 
       .pipe(notify({ message: fileName + ".scss task completed!" }));
};

gulp.task("scss", function() { 
	return scssTask("editormd");
}); 

gulp.task("scss2", function() { 
	return scssTask("editormd.preview");
}); 

gulp.task("scss3", function() {
	return scssTask("editormd.logo");
}); 

gulp.task("js", function() { 
  return gulp.src("./src/editormd.js")
            .pipe(jshint("./.jshintrc"))
            .pipe(jshint.reporter("default"))
            .pipe(header(headerComment, {pkg : pkg, fileName : function(file) { 
                var name = file.path.split(file.base);
                return name[1].replace(/[\\\/]?/, "");
            }}))
            .pipe(gulp.dest("./"))
            .pipe(rename({ suffix: ".min" }))
            .pipe(uglify())  // {outSourceMap: true, sourceRoot: './'}
            .pipe(gulp.dest("./"))	
            .pipe(header(headerMiniComment, {pkg : pkg, fileName : function(file) {
                var name = file.path.split(file.base + ( (os.platform() === "win32") ? "\\" : "/") );
                return name[1].replace(/[\\\/]?/, "");
            }}))
            .pipe(gulp.dest("./"))
            .pipe(notify({ message: "editormd.js task complete" }));
}); 

gulp.task("amd", function() {
    var replaceText1 = [
        'var cmModePath  = "codemirror/mode/";',
        '            var cmAddonPath = "codemirror/addon/";', 
        '',
        '            var codeMirrorModules = [',
        '                "jquery", "marked", "prettify",',
        '                "katex", "raphael", "underscore", "flowchart",  "jqueryflowchart",  "sequenceDiagram",',
        '',
        '                "codemirror/lib/codemirror",',
        '                cmModePath + "css/css",',
        '                cmModePath + "sass/sass",', 
        '                cmModePath + "shell/shell",', 
        '                cmModePath + "sql/sql",',
        '                cmModePath + "clike/clike",',
        '                cmModePath + "php/php",',
        '                cmModePath + "xml/xml",',
        '                cmModePath + "markdown/markdown",', 
        '                cmModePath + "javascript/javascript",',
        '                cmModePath + "htmlmixed/htmlmixed",',
        '                cmModePath + "gfm/gfm",',
        '                cmModePath + "http/http",',
        '                cmModePath + "go/go",', 
        '                cmModePath + "dart/dart",', 
        '                cmModePath + "coffeescript/coffeescript",',
        '                cmModePath + "nginx/nginx",',
        '                cmModePath + "python/python",', 
        '                cmModePath + "perl/perl",',
        '                cmModePath + "lua/lua",', 
        '                cmModePath + "r/r", ',
        '                cmModePath + "ruby/ruby", ',
        '                cmModePath + "rst/rst",',
        '                cmModePath + "smartymixed/smartymixed",', 
        '                cmModePath + "vb/vb",',
        '                cmModePath + "vbscript/vbscript",', 
        '                cmModePath + "velocity/velocity",',
        '                cmModePath + "xquery/xquery",',
        '                cmModePath + "yaml/yaml",',
        '                cmModePath + "erlang/erlang",', 
        '                cmModePath + "jade/jade",',
        '',
        '                cmAddonPath + "edit/trailingspace", ',
        '                cmAddonPath + "dialog/dialog", ',
        '                cmAddonPath + "search/searchcursor", ',
        '                cmAddonPath + "search/search", ',
        '                cmAddonPath + "scroll/annotatescrollbar", ', 
        '                cmAddonPath + "search/matchesonscrollbar", ',
        '                cmAddonPath + "display/placeholder", ',
        '                cmAddonPath + "edit/closetag", ',
        '                cmAddonPath + "fold/foldcode",',
        '                cmAddonPath + "fold/foldgutter",',
        '                cmAddonPath + "fold/indent-fold",',
        '                cmAddonPath + "fold/brace-fold",',
        '                cmAddonPath + "fold/xml-fold", ',
        '                cmAddonPath + "fold/markdown-fold",',
        '                cmAddonPath + "fold/comment-fold", ',
        '                cmAddonPath + "mode/overlay", ',
        '                cmAddonPath + "selection/active-line", ',
        '                cmAddonPath + "edit/closebrackets", ',
        '                cmAddonPath + "display/fullscreen",',
        '                cmAddonPath + "search/match-highlighter"',
        '            ];',
        '',
        '            define(codeMirrorModules, factory);'
    ].join("\r\n");
    
    var replaceText2 = [
        "if (typeof define == \"function\" && define.amd) {",
        "       $          = arguments[0];",
        "       marked     = arguments[1];",
        "       prettify   = arguments[2];",
        "       katex      = arguments[3];",
        "       Raphael    = arguments[4];",
        "       _          = arguments[5];",
        "       flowchart  = arguments[6];",
        "       CodeMirror = arguments[9];",
        "   }"
    ].join("\r\n");
    
    gulp.src("src/editormd.js")
        .pipe(rename({ suffix: ".amd" }))
        .pipe(gulp.dest('./'))
        .pipe(header(headerComment, {pkg : pkg, fileName : function(file) { 
            var name = file.path.split(file.base);
            return name[1].replace(/[\\\/]?/, "");
        }}))
        .pipe(gulp.dest("./"))
        .pipe(replace("/* Require.js define replace */", replaceText1))
        .pipe(gulp.dest('./'))
        .pipe(replace("/* Require.js assignment replace */", replaceText2))
        .pipe(gulp.dest('./'))
        .pipe(rename({ suffix: ".min" }))
        .pipe(uglify()) //{outSourceMap: true, sourceRoot: './'}
        .pipe(gulp.dest("./"))
        .pipe(header(headerMiniComment, {pkg : pkg, fileName : function(file) {
            var name = file.path.split(file.base + ( (os.platform() === "win32") ? "\\" : "/") );
            return name[1].replace(/[\\\/]?/, "");
        }}))
        .pipe(gulp.dest("./"))
        .pipe(notify({ message: "amd version task complete"}));
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
        "fold/foldcode",
        "fold/foldgutter",
        "fold/indent-fold",
        "fold/brace-fold",
        "fold/xml-fold", 
        "fold/markdown-fold",
        "fold/comment-fold", 
        "mode/overlay", 
        "selection/active-line", 
        "edit/closebrackets", 
        "display/fullscreen", 
        "search/match-highlighter"
    ]
};

gulp.task("cm-mode", function() { 
    
    var modes = [
        codeMirror.path.src.mode + "/meta.js"
    ];
    
    for(var i in codeMirror.modes) {
        var mode = codeMirror.modes[i];
        modes.push(codeMirror.path.src.mode + "/" + mode + "/" + mode + ".js");
    }
    
    return gulp.src(modes)
                .pipe(concat("modes.min.js"))
                .pipe(gulp.dest(codeMirror.path.dist))
                .pipe(uglify()) // {outSourceMap: true, sourceRoot: codeMirror.path.dist}
                .pipe(gulp.dest(codeMirror.path.dist))	
                .pipe(header(headerMiniComment, {pkg : pkg, fileName : function(file) {
                    var name = file.path.split(file.base + "\\"); 
                    return (name[1]?name[1]:name[0]).replace(/\\/g, "");
                }}))
                .pipe(gulp.dest(codeMirror.path.dist))
                .pipe(notify({ message: "codemirror-mode task complete!" }));
}); 

gulp.task("cm-addon", function() { 
    
    var addons = [];
    
    for(var i in codeMirror.addons) {
        var addon = codeMirror.addons[i];
        addons.push(codeMirror.path.src.addon + "/" + addon + ".js");
    }
    
    return gulp.src(addons)
                .pipe(concat("addons.min.js"))
                .pipe(gulp.dest(codeMirror.path.dist))
                .pipe(uglify()) //{outSourceMap: true, sourceRoot: codeMirror.path.dist}
                .pipe(gulp.dest(codeMirror.path.dist))	
                .pipe(header(headerMiniComment, {pkg : pkg, fileName : function(file) {
                    var name = file.path.split(file.base + "\\");
                    return (name[1]?name[1]:name[0]).replace(/\\/g, "");
                }}))
                .pipe(gulp.dest(codeMirror.path.dist))
                .pipe(notify({ message: "codemirror-addon.js task complete" }));
}); 
/*
gulp.task("jsdoc", function(){
    return gulp.src(["./src/editormd.js", "README.md"])
               .pipe(jsdoc.parser())
               .pipe(jsdoc.generator("./docs/html"));
});

gulp.task("jsdoc2md", function() {
    return gulp.src("src/js/editormd.js")
            .pipe(jsdoc2md())
            .on("error", function(err){
                gutil.log(gutil.colors.red("jsdoc2md failed"), err.message);
            })
            .pipe(rename(function(path) {
                path.extname = ".md";
            }))
            .pipe(gulp.dest("docs/markdown"));
});
*/
gulp.task("watch", function() {
	gulp.watch("scss/editormd.scss", ["scss"]);
	gulp.watch("scss/editormd.preview.scss", ["scss", "scss2"]);
	gulp.watch("scss/editormd.logo.scss", ["scss", "scss3"]);
	gulp.watch("src/editormd.js", ["js", "amd"]);
});

gulp.task("default", function() {
    gulp.run("scss");
    gulp.run("scss2");
    gulp.run("scss3");
    gulp.run("js");
    gulp.run("amd");
    gulp.run("cm-addon");
    gulp.run("cm-mode");
});