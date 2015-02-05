/*
 * Editor.md
 * @file        editormd.js 
 * @version     v1.0.0 
 * @description A simple online markdown editor.
 * @license     MIT License
 * @author      Pandao
 * {@link       https://github.com/pandao/editor.md}
 * @updateTime  2015-02-06
 */

;(function(factory) {
    "use strict";
    
	// CommonJS/Node.js
	if (typeof require === "function" && typeof exports === "object" && typeof module === "object")
    { 
        module.exports = factory();
    }
	else if (typeof define === "function")  // AMD/CMD/Sea.js
	{
		define(["jquery"], factory);
	} 
	else
	{ 
        window.editormd = factory();
	}
    
}(function() {
    
    /**
     * editormd
     * 
     * @param   {String} id           编辑器的ID
     * @param   {Object} options      配置选项 Key/Value
     * @returns {Object} editormd     返回editormd对象
     */
    
    "use strict";
    
    var $ = jQuery; 
    
    var editormd         = function (id, options) {
        return new editormd.fn.init(id, options);
    };
    
    editormd.title       = "Editor.md";
    editormd.version     = "1.0.0";
    editormd.homePage    = "https://github.com/pandao/editor.md";
    editormd.description = "A simple markdown doucment online editor.";
    editormd.classPrefix = "editormd-";  
    
    editormd.defaults    = {
        mode                 : "gfm",          //gfm or markdown
        markdown             : "",
        width                : "100%",
        height               : "100%",
        path                 : "./lib/",
        watch                : true,            
        onload               : function() {},
        fontSize             : "13px",
        flowChart            : false,          // flowChart.js only support IE9+
        mathjax              : false,
        sequenceDiagram      : false,          // sequenceDiagram.js only support IE9+
        previewCodeHighlight : true,
        inRequirejs          : false,
        toolbar              : true,
        toolbarIcons         : [
            "undo", "redo", "|", 
            "bold", "del", "italic", "quote", "|", 
            "h1", "h2", "h3", "h4", "h5", "h6", "|", 
            "list-ul", "list-ol", "hr", "|",
            "link", "picture", "code", "code-block-tab", "code-block", "datetime", "|",
            "watch", "preview", "fullscreen", "|",
            "info"
        ],

        toolbarIconsClass    : {
            undo             : "fa-undo",
            redo             : "fa-repeat",
            bold             : "fa-bold",
            del              : "fa-strikethrough",
            italic           : "fa-italic",
            quote            : "fa-quote-left",
            h1               : editormd.classPrefix + "bold",
            h2               : editormd.classPrefix + "bold",
            h3               : editormd.classPrefix + "bold",
            h4               : editormd.classPrefix + "bold",
            h5               : editormd.classPrefix + "bold",
            h6               : editormd.classPrefix + "bold",
            "list-ul"        : "fa-list-ul",
            "list-ol"        : "fa-list-ol",
            hr               : "fa-minus",
            link             : "fa-link",
            picture          : "fa-picture-o",
            code             : "fa-code",
            "code-block-tab" : "fa-file-code-o",
            "code-block"     : "fa-file-code-o",
            datetime         : "fa-clock-o",
            watch            : "fa-eye-slash",
            unwatch          : "fa-eye",
            preview          : "fa-search",
            fullscreen       : "fa-arrows-alt",
            info             : "fa-info-circle"
        },

        lang : {
            toolbar : {
                undo             : "撤销",
                redo             : "重做",
                bold             : "粗体",
                del              : "删除线",
                italic           : "斜体",
                quote            : "引用",
                h1               : "标题1",
                h2               : "标题2",
                h3               : "标题3",
                h4               : "标题4",
                h5               : "标题5",
                h6               : "标题6",
                "list-ul"        : "无序列表",
                "list-ol"        : "有序列表",
                hr               : "横线",
                link             : "链接",
                picture          : "图片",
                code             : "行内代码",
                "code-block-tab" : "代码块(缩进风格)",
                "code-block"     : "代码块(多语言风格)",
                datetime         : "日期时间",
                watch            : "关闭实时预览",
                unwatch          : "开启实时预览",
                preview          : "预览HTML(按ESC还原)",
                fullscreen       : "全屏(按ESC还原)",
                info             : "关于" + editormd.title
            }
        },

        codemirror : {
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
                //"r", 
                "ruby", 
                "rst",
                "smartymixed",
                //"vb",
                //"vbscript",
                //"velocity",
                //"xquery",
                "yaml"
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
        }
    };
    
    editormd.$marked      = null;
    editormd.$CodeMirror  = null;
    editormd.$prettyPrint = null;

    editormd.prototype    = editormd.fn = {
        state : {
            preview    : false,
            fullscreen : false
        },
        
        /**
         * 构造函数/实例初始化
         * @param   {String}   id            编辑器的ID
         * @param   {Object}   [options={}]  配置选项 Key/Value
         * @returns {editormd}               返回editormd的实例对象
         */
        
        init : function (id, options) {
            
            options           = options || {};
            
            var _this         = this;
            var classPrefix   = this.classPrefix  = editormd.classPrefix;
            var editor        = this.editor       = $("#" + id);        
            var settings      = this.settings     = $.extend(true, editormd.defaults, options); 
            var markdownDoc   = (settings.markdown === "") ? editor.children("[type=\"text/markdown\"]").html() : settings.markdown;
            this.id           = id;
            
            this.classNames   = {
                textarea : {
                    html     : this.classPrefix + "html-textarea",
                    markdown : this.classPrefix + "markdown-textarea"
                }
            };
            
            editor.css({
                width  : (typeof settings.width  === "number") ? settings.width  + "px" : settings.width,
                height : (typeof settings.height === "number") ? settings.height + "px" : settings.height
            });
            
            editor.children("[type=\"text/markdown\"]").remove();
            
            var infoDialogHTML = [
                "<div class=\"" + classPrefix + "dialog " + classPrefix + "dialog-info\">",
                "<a href=\"javascript:;\" class=\"fa fa-close " + classPrefix + "dialog-close\"></a>",
                "<div class=\"" + classPrefix + "dialog-container\">",
                "<h1><i class=\"fa fa-lg fa-edit\"></i>" + editormd.title + "<small>v" + editormd.version + "</small></h1>",
                "<p>" + editormd.description + "</p>",
                "<p>Home page: <a href=\"" + editormd.homePage + "\" traget=\"_blank\">" + editormd.homePage + "</a></p>",
                "<p>License: MIT</p>",
                "</div>",
                "</div>"
            ].join("\n");
            
            var appendElements = [
                '<div class="'+classPrefix+'toolbar"><div class="'+classPrefix+'toolbar-container"><ul class="'+classPrefix+'menu"></ul></div></div>',
                '<textarea id="test123" class="'+this.classNames.textarea.markdown+'" name="'+id+'-markdown-doc" placeholder="now coding markdown...">'+markdownDoc+'</textarea>',
                '<textarea class="'+this.classNames.textarea.html+'" name="'+id+'-html-code"></textarea>',
                '<div class="'+classPrefix+'preview"><div class="markdown-body '+classPrefix+'preview-container"></div>',
                "</div>"
            ].join("\n");
            
            editor.append(infoDialogHTML).append(appendElements);
            
            this.preview          = editor.find("." + classPrefix + "preview");
            this.toolbar          = editor.find("." + classPrefix + "toolbar");
            this.previewContainer = this.preview.children("." + classPrefix + "preview-container");
            this.infoDialog       = editor.find("." + classPrefix + "dialog-info");
            this.toolbarIconHandlers  = {};
            
            editor.addClass(classPrefix + "vertical");
            
            if (!settings.inRequirejs) 
            {                
                this.loadQueues();
            } 
            else 
            {                
                _this.setCodeEditor();                        
                _this.setToolbar();                        
                _this.toolbarHandler();
                _this.setMarked().loadedDisplay();
            }

            return this;
        },
        
        /**
         * 所需组件加载队列
         * @returns {editormd}  返回editormd的实例对象
         */
        
        loadQueues : function() {
            var _this        = this;
            var settings     = this.settings;
            var cmModeIndex  = 0, cmModeTotal  = settings.codemirror.modes.length;
            var cmAddonIndex = 0, cmAddonTotal = settings.codemirror.addons.length;
            var loadPath     = settings.path;
                                
            var loadFlowChartOrSequenceDiagram = function() {

                if (settings.flowChart || settings.sequenceDiagram) 
                {
                    editormd.loadScript(loadPath + "raphael.min", function() {

                        editormd.loadScript(loadPath + "underscore.min", function() {  

                            if (!settings.flowChart && settings.sequenceDiagram) 
                            {
                                editormd.loadScript(loadPath + "sequence-diagram.min", function() {
                                    _this.setMarked().loadedDisplay();
                                });
                            }
                            else if (settings.flowChart && !settings.sequenceDiagram) 
                            {      
                                editormd.loadScript(loadPath + "flowchart.min", function() {  
                                    editormd.loadScript(loadPath + "jquery.flowchart.min", function() {
                                        _this.setMarked().loadedDisplay();
                                    });
                                });
                            }
                            else if (settings.flowChart && settings.sequenceDiagram) 
                            {  
                                editormd.loadScript(loadPath + "flowchart.min", function() {  
                                    editormd.loadScript(loadPath + "jquery.flowchart.min", function() {
                                        editormd.loadScript(loadPath + "sequence-diagram.min", function() {
                                            _this.setMarked().loadedDisplay();
                                        });
                                    });
                                });
                            }
                        });

                    });
                } 
                else
                {
                    _this.setMarked().loadedDisplay();
                }
            }; 

            var loadCodeMirrorAddons = function() {

                var addonName = settings.codemirror.addons[cmAddonIndex];

                editormd.loadScript(loadPath + "codemirror/addon/" + addonName, function() {

                    if(cmAddonIndex < cmAddonTotal - 1) 
                    {
                        cmAddonIndex ++;                            
                        loadCodeMirrorAddons();
                    } 
                    else 
                    {
                        _this.setCodeEditor();                        
                        _this.setToolbar();                        
                        _this.toolbarHandler();

                        editormd.loadScript(loadPath + "marked.min", function() {

                            editormd.$marked = marked;
                            //_this.marked = marked;

                            if (settings.previewCodeHighlight) 
                            {
                                editormd.loadScript(loadPath + "prettify.min", function() {
                                    loadFlowChartOrSequenceDiagram();
                                });
                            } 
                            else
                            {                            
                                loadFlowChartOrSequenceDiagram();
                            }
                        });
                    }
                });
            };

            var loadCodeMirrorModes = function(){

                var modeName = settings.codemirror.modes[cmModeIndex];

                editormd.loadScript(loadPath + "codemirror/mode/" + modeName + "/" + modeName, function() {

                    if(cmModeIndex < cmModeTotal - 1) 
                    {
                        cmModeIndex ++;
                        loadCodeMirrorModes();
                    } 
                    else 
                    {
                        loadCodeMirrorAddons();
                    }
                });
            };
                      
            //editormd.loadCSS(loadPath + "font-awesome.min");
            editormd.loadCSS(loadPath + "codemirror/lib/codemirror.min");            
            editormd.loadScript(loadPath + "codemirror/lib/codemirror.min", function() {  
                editormd.$CodeMirror = CodeMirror;                
                loadCodeMirrorModes(); 
            });

            return this;
        },
        
        /**
         * 配置和初始化CodeMirror组件
         * @returns {editormd}  返回editormd的实例对象
         */
        
        setCodeEditor : function() { 
            var settings = this.settings;
            
            var codeMirrorConfig = {
                mode: this.settings.mode,
                theme: "default",
                tabSize: 4,
                dragDrop: false,
                autofocus: true,
                indentUnit : 4,
                lineNumbers: true,
                lineWrapping: true,
                matchBrackets: true,
                indentWithTabs: true,
                styleActiveLine: true,
                styleSelectedText: true,
                autoCloseBrackets: true,
                showTrailingSpace: true,
                highlightSelectionMatches: {
                    showToken: /\w/
                } 
            };
            
            this.codeEditor = editormd.$CodeMirror.fromTextArea(this.editor.find("." + this.classNames.textarea.markdown)[0], codeMirrorConfig);
                
            this.codeMirror = this.editor.find(".CodeMirror");
            this.codeMirror.css("font-size", this.settings.fontSize);

            return this;
        },
        
        /**
         * 显示工具栏
         * @returns {editormd}  返回editormd的实例对象
         */
        
        showToolbar : function() {
            
            this.settings.toolbar = true; 
            this.toolbar.show();
            this.resize();

            return this;
        },
        
        /**
         * 隐藏工具栏
         * @returns {editormd}  返回editormd的实例对象
         */
        
        hideToolbar : function() {  
            
            this.settings.toolbar = false;  
            this.toolbar.hide();
            this.resize();

            return this;
        },
        
        /**
         * 配置和初始化工具栏
         * @returns {editormd}  返回editormd的实例对象
         */
        
        setToolbar : function() {
            var settings         = this.settings;            
            var editor           = this.editor;
            var preview          = this.preview;
            var toolbar          = this.toolbar;
            
            if (!settings.toolbar) {
                toolbar.hide();
                return ;
            } else {
                toolbar.show();
            }
            
            var toolbarMenu      = toolbar.find("." + this.classPrefix + "menu"), menu = "";
            
            for (var i = 0, len = settings.toolbarIcons.length; i < len; i++)
            {
                var name = settings.toolbarIcons[i];
                
                if (name !== "|")
                {
                    var isHeader = (/h(\d)/.test(name));
                    
                    menu += "<li><a href=\"javascript:;\" title=\""+settings.lang.toolbar[name]+"\"><i class=\"fa "+settings.toolbarIconsClass[name]+"\" name=\""+name+"\">"+((isHeader) ? name : "")+"</i></a></li>";
                }
                else
                {
                    menu += "<li class=\"divider\">|</li>";
                }
            }
            
            toolbarMenu.append(menu);

            return this;
        },        
        
        /**
         * 工具栏图标事件处理器
         * @returns {editormd}  返回editormd的实例对象
         */
        
        toolbarHandler : function() {
            var settings         = this.settings; 
            
            if (!settings.toolbar) {
                return ;
            }            
            
            var _this            = this;
            var editor           = this.editor;
            var preview          = this.preview;
            var toolbar          = this.toolbar;
            var codeEditor       = this.codeEditor;
            var codeMirror       = this.codeMirror;
            var previewContainer = this.previewContainer;            
            var toolbarIcons     = this.toolbarIcons = toolbar.find("." + this.classPrefix + "menu .fa");
                
            toolbarIcons.bind(editormd.mouseOrTouch("click", "touchend"), function(event) {

                var icon      = $(this);
                var name      = icon.attr("name");
                var cursor    = codeEditor.getCursor();
                var selection = codeEditor.getSelection();

                if (name === "") {
                    return ;
                }

                //console.log("toolbarIcons.click =>", name);
            
                var toolbarIconHandlers  = _this.toolbarIconHandlers = {
                    undo : function() {
                        codeEditor.undo();
                    },
                    redo : function() {
                        codeEditor.redo();
                    },
                    bold : function() {

                        codeEditor.replaceSelection("**" + selection + "**");

                        if(selection === "") {
                            codeEditor.setCursor(cursor.line, cursor.ch + 2);
                        }                    
                    },
                    del : function() {

                        codeEditor.replaceSelection("~~" + selection + "~~");

                        if(selection === "") {
                            codeEditor.setCursor(cursor.line, cursor.ch + 2);
                        }
                    },

                    italic : function() {
                        codeEditor.replaceSelection("*" + selection + "*");

                        if(selection === "") {
                            codeEditor.setCursor(cursor.line, cursor.ch + 1);
                        }
                    },

                    quote : function() {
                        codeEditor.replaceSelection((selection === "") ? ["> " + selection, ""].join("\n") : "> " + selection);
                        codeEditor.setCursor(cursor.line, (selection === "") ? cursor.ch + 2 : cursor.ch + selection.length + 2);
                    },

                    h1 : function() {
                        codeEditor.replaceSelection("#" + selection);
                    },

                    h2 : function() {
                        codeEditor.replaceSelection("##" + selection);
                    },

                    h3 : function() {
                        codeEditor.replaceSelection("###" + selection);
                    },

                    h4 : function() {
                        codeEditor.replaceSelection("####" + selection);
                    },

                    h5 : function() {
                        codeEditor.replaceSelection("#####" + selection);
                    },

                    h6 : function() {
                        codeEditor.replaceSelection("######" + selection);
                    },

                    "list-ul" : function() {

                        if (selection === "") 
                        {
                            codeEditor.replaceSelection("- " + selection);
                        } 
                        else 
                        {
                            var selectionText = selection.split("\n");

                            for (var i = 0, len = selectionText.length; i < len; i++) 
                            {
                                selectionText[i] = (selectionText[i] === "") ? "" : "- " + selectionText[i];
                            }

                            codeEditor.replaceSelection(selectionText.join("\n"));
                        }
                    },

                    "list-ol" : function() {

                        if(selection === "") 
                        {
                            codeEditor.replaceSelection("1. " + selection);
                        }
                        else
                        {
                            var selectionText = selection.split("\n");

                            for (var i = 0, len = selectionText.length; i < len; i++) 
                            {
                                selectionText[i] = (selectionText[i] === "") ? "" : (i+1) + ". " + selectionText[i];
                            }

                            codeEditor.replaceSelection(selectionText.join("\n"));
                        }
                    },

                    hr : function() {
                        codeEditor.replaceSelection("------------");
                    },

                    link : function() {
                        codeEditor.replaceSelection("[" + selection + "](" + selection + " \""+selection+"\")");
                    },

                    picture : function() {
                        codeEditor.replaceSelection("![" + selection + "](" + selection + " \""+selection+"\")");
                    },

                    code : function() {

                        codeEditor.replaceSelection("`" + selection + "`");

                        if (selection === "") {
                            codeEditor.setCursor(cursor.line, cursor.ch + 1);
                        }

                    },

                    "code-block-tab" : function() {
                        codeEditor.replaceSelection("    " + selection);                    
                    },

                    "code-block" : function() {

                        codeEditor.replaceSelection(["```", selection, "```"].join("\n"));

                        if (selection === "") {
                            codeEditor.setCursor(cursor.line, cursor.ch + 3);
                        } 

                    },

                    datetime : function() {
                        var date = new Date();
                        codeEditor.replaceSelection(editormd.dateFormat() + " " + editormd.dateFormat("cn-week-day"));
                    },
                    
                    watch : function() {
                        if (_this.settings.watch)
                        {  
                            _this.unwatch();
                        } 
                        else 
                        {    
                            _this.watch();
                        }

                        event.preventDefault();

                        return false;
                    },
                    
                    preview : function() {
                        
                        _this.previewing();
                        event.preventDefault();

                        return false;
                    },
                    
                    fullscreen : function() {
                        
                        _this.fullscreen();
                        event.preventDefault(); 

                        return false;
                    },
                    
                    info : function() {
                        _this.showInfoDialog();
                        event.preventDefault(); 

                        return false;
                    }
                };

                toolbarIconHandlers[name]();

                codeEditor.focus();
                event.preventDefault(); 

                return false;

            });

            return this;
        },
        
        /**
         * 显示关于Editor.md
         * @returns {editormd}  返回editormd的实例对象
         */
        
        showInfoDialog : function() {

            $("html,body").css("overflow-x", "hidden");
            this.editor.find("." + this.classPrefix + "dialog-info").fadeIn();

            return this;
        },
        
        /**
         * 隐藏关于Editor.md
         * @returns {editormd}  返回editormd的实例对象
         */
        
        hideInfoDialog : function() {
            $("html,body").css("overflow-x", null);
            this.editor.find("." + this.classPrefix + "dialog-info").fadeOut();

            return this;
        },
        
        /**
         * 配置和初始化marked组件
         * @returns {editormd}  返回editormd的实例对象
         */
        
        setMarked : function() {
            var marked         = editormd.$marked;            
            var markedRenderer = this.markedRenderer = editormd.markedRenderer();
            
            marked.setOptions({
                renderer: markedRenderer,
                gfm: true,
                tables: true,
                breaks: false,
                pedantic: false,
                sanitize: true,
                smartLists: true,
                smartypants: true
            });

            return this;
        },
        
        /**
         * 加载队列完成之后的显示处理
         * @returns {editormd}  返回editormd的实例对象
         */
        
        loadedDisplay : function() {
            
            this.state.loaded    = true;
            
            var _this            = this;
            var editor           = this.editor;
            var preview          = this.preview;
            var toolbar          = this.toolbar;
            var settings         = this.settings;
            var codeEditor       = this.codeEditor;
            var codeMirror       = this.codeMirror;
            var previewContainer = this.previewContainer;
            var mouseOrTouch     = editormd.mouseOrTouch;
            var htmlTextarea     = this.htmlTextarea     = editor.find("."+this.classNames.textarea.html);
            var markdownTextarea = this.markdownTextarea = editor.find("."+this.classNames.textarea.markdown);
            
            editor.css("background", "none");
            
            this.saveToTextareas();
            
            preview.show();
            
            if (settings.previewCodeHighlight) 
            {
                previewContainer.find("pre").addClass("prettyprint linenums");
                prettyPrint();
            }
            
            if (settings.flowChart) {
                previewContainer.find(".flowchart").flowChart(); 
            }
            
            if (settings.sequenceDiagram) {
                previewContainer.find(".sequence-diagram").sequenceDiagram({theme: "simple"});
            }

            if (settings.mathjax) 
            {
                editormd.setMathJaxConfig(function() {
                    editormd.loadMathJax();
                });
            }
            
            editor.data({
                oldWidth  : editor.outerWidth(),
                oldHeight : editor.outerHeight()
            });
            
            this.resize(); 

            $(window).resize(function(){
                _this.resize();
            });
            
            $.proxy(this.settings.onload, this)();

            editor.find("." + this.classPrefix + "dialog-close").bind(mouseOrTouch("click", "touchend"), function() {
                _this.hideInfoDialog();
            });
                
            var codeEditorBindScroll = function() {    
                codeMirror.find(".CodeMirror-scroll").bind(mouseOrTouch("scroll", "touchmove"), function() {
                    var height    = $(this).outerHeight();
                    var scrollTop = $(this).scrollTop();                    
                    var percent   = (scrollTop / $(this)[0].scrollHeight);

                    if (scrollTop === 0) 
                    {
                        preview.scrollTop(0);
                    } 
                    else if (scrollTop + height >= $(this)[0].scrollHeight)
                    { 
                        preview.scrollTop(preview[0].scrollHeight);                        
                    } 
                    else
                    {                    
                        preview.scrollTop(preview[0].scrollHeight * percent);
                    }
                });
            };

            var codeEditorUnbindScroll = function() {
                codeMirror.find(".CodeMirror-scroll").unbind(mouseOrTouch("scroll", "touchmove"));
            };

            var previewBindScroll = function() {
                preview.bind(mouseOrTouch("scroll", "touchmove"), function() {
                    var height    = $(this).outerHeight();
                    var scrollTop = $(this).scrollTop();                    
                    var percent   = (scrollTop / $(this)[0].scrollHeight);
                    var codeView  = codeMirror.find(".CodeMirror-scroll");

                    if(scrollTop === 0) 
                    {
                        codeView.scrollTop(0);
                    } 
                    else if (scrollTop + height >= $(this)[0].scrollHeight)
                    { 
                        codeView.scrollTop(codeView[0].scrollHeight);                        
                    } 
                    else 
                    {                    
                        codeView.scrollTop(codeView[0].scrollHeight * percent);
                    }
                });
            };

            var previewUnbindScroll = function() {
                preview.unbind(mouseOrTouch("scroll", "touchmove"));
            }; 
            
            codeMirror.hover(codeEditorBindScroll, codeEditorUnbindScroll).bind("touchstart", codeEditorBindScroll).bind("touchend", codeEditorUnbindScroll);  
            preview.hover(previewBindScroll, previewUnbindScroll).bind("touchstart", previewBindScroll).bind("touchend", previewUnbindScroll);

            codeEditor.on("change", function(cm, changeObj) { 

                console.log('change =>', codeEditor);
                if (!settings.watch) {
                    return ;
                }
                
                _this.saveToTextareas();

                if (settings.previewCodeHighlight) {
                    preview.find("pre").addClass("prettyprint linenums");
                    prettyPrint();      
                }

                if (settings.flowChart) {
                    previewContainer.find(".flowchart").flowChart(); 
                }
                
                if (settings.sequenceDiagram) {
                    previewContainer.find(".sequence-diagram").sequenceDiagram({theme: "simple"});
                }

                if (settings.mathjax)
                {                        
                    MathJax.Hub.Queue(function () {
                        previewContainer.find(".mathjax-code").each(function() {

                            var mathjaxDoc = $(this).html().replace(/\$\$(.*)\$\$/, function(s1, s2) { return s2; });
                            var jaxScript  = "<script type=\"math/tex; mode=display\">" + mathjaxDoc + "</script>";
                            
                            $(this).html($(jaxScript));

                            MathJax.Hub.Queue(["Typeset", MathJax.Hub, "mathjax-code"]);
                        });
                    }); 
                }
            });

            return this;
        },
        
        /**
         * 设置编辑器的宽度
         * @param   {Number|String} width  编辑器宽度值
         * @returns {editormd}             返回editormd的实例对象
         */
        
        width : function(width) {
                
            this.editor.css({
                width  : (typeof width === "number") ? width  + "px" : width
            });
            
            this.resize();
            
            return this;
        },
        
        /**
         * 设置编辑器的高度
         * @param   {Number|String} height  编辑器高度值
         * @returns {editormd}              返回editormd的实例对象
         */
        
        height : function(height) {
                
            this.editor.css({
                height  : (typeof height === "number")  ? height  + "px" : height
            });
            
            this.resize();
            
            return this;
        },
        
        /**
         * 调整编辑器的尺寸和布局
         * @param   {Number|String} [width=null]  编辑器宽度值
         * @param   {Number|String} [height=null] 编辑器高度值
         * @returns {editormd}                    返回editormd的实例对象
         */
        
        resize : function(width, height) {
            
            width  = width  || null;
            height = height || null;

            var editor           = this.editor;
            var preview          = this.preview;
            var toolbar          = this.toolbar;
            var settings         = this.settings;
            var infoDialog       = this.infoDialog;
            var codeEditor       = this.codeEditor;
            var codeMirror       = this.codeMirror;
            
            if(width && height) 
            {                
                editor.css({
                    width  : (typeof width  === "number") ? width  + "px" : width,
                    height : (typeof height === "number") ? height + "px" : height
                });
            }
            
            infoDialog.css({
                top  : (editor.height() - infoDialog.height()) / 2,
                left : (editor.width() - infoDialog.width()) / 2
            });
                        
            if (settings.toolbar) {            
                codeMirror.css("margin-top", toolbar.outerHeight()).outerHeight(editor.height() - toolbar.outerHeight());
            } else {
                codeMirror.css("margin-top", 0).outerHeight(editor.height());
            }
            
            if(this.settings.watch) 
            {
                codeMirror.outerWidth(editor.width() / 2);
                preview.outerWidth(editor.width() / 2);
                
                if (settings.toolbar) {
                    preview.css("top", toolbar.outerHeight()).outerHeight(editor.height() - toolbar.outerHeight());
                } else {
                    preview.css("top", 0).outerHeight(editor.height());
                }
            } 
            else 
            {
                codeMirror.outerWidth(editor.width());
                preview.hide();
            }

            return this;
        },
        
        /**
         * 分别将Markdown源码和解析的HTML源码保存到对应的textarea
         * @returns {editormd}                    返回editormd的实例对象
         */
        
        saveToTextareas : function() {
            
            var codeEditor     = this.codeEditor;
            
            codeEditor.save();
                     
            var newMarkdownDoc = editormd.$marked(codeEditor.getValue(), {renderer : this.markedRenderer});

            this.markdownTextarea.html(codeEditor.getValue());   
            this.htmlTextarea.html(newMarkdownDoc);                        
            this.previewContainer.html(newMarkdownDoc);

            return this;
        },
        
        /**
         * 设置和传入编辑器的markdown源文档
         * @param   {String}    md     要传入的markdown源文档
         * @returns {editormd}         返回editormd的实例对象
         */
        
        setMarkdown : function(md) {
            this.codeEditor.setValue(md);
            this.saveToTextareas();
            
            return this;
        },
        
        /**
         * 获取编辑器的markdown源文档
         * @returns {editormd}         返回editormd的实例对象
         */
        
        getMarkdown : function() {
            return this.codeEditor.getValue();
        },
        
        /**
         * 获取解析后的HTML源码
         * @returns {editormd}         返回editormd的实例对象
         */
        
        getHTML : function() {
            return this.editor.find("." + this.classNames.textarea.html).val();
        },
        
        /**
         * 开启实时预览
         * @returns {editormd}         返回editormd的实例对象
         */
        
        watch : function() {
            
            this.settings.watch = true;
            this.preview.show();
            
            var watchIcon   = this.settings.toolbarIconsClass.watch;
            var unWatchIcon = this.settings.toolbarIconsClass.unwatch;
            var icon        = this.toolbar.find(".fa[name=watch]");
            icon.parent().attr("title", this.settings.lang.toolbar.watch);
            icon.removeClass(unWatchIcon).addClass(watchIcon);
            
            this.codeMirror.css("border-right", "1px solid #ddd").outerWidth(this.editor.width() / 2); 
            
            this.saveToTextareas().resize();
            
            return this;
        },
        
        /**
         * 关闭实时预览
         * @returns {editormd}         返回editormd的实例对象
         */
        
        unwatch : function() {
            
            this.settings.watch = false;
            this.preview.hide();
            
            var watchIcon   = this.settings.toolbarIconsClass.watch;
            var unWatchIcon = this.settings.toolbarIconsClass.unwatch;
            
            var icon        = this.toolbar.find(".fa[name=watch]");
            icon.parent().attr("title", this.settings.lang.toolbar.unwatch);
            icon.removeClass(watchIcon).addClass(unWatchIcon);
            
            this.codeMirror.css("border-right", "none").outerWidth(this.editor.width());
            
            this.resize();
            
            return this;
        },
        
        /**
         * 显示编辑器
         * @returns {editormd}         返回editormd的实例对象
         */
        
        show : function() {
            this.editor.show();
            
            return this;
        },
        
        /**
         * 隐藏编辑器
         * @returns {editormd}         返回editormd的实例对象
         */
        
        hide : function() {
            this.editor.hide();
            
            return this;
        },
        
        /**
         * 隐藏编辑器部分，只预览HTML
         * @returns {editormd}         返回editormd的实例对象
         */
        
        previewing : function() {
            
            var _this            = this;
            var editor           = this.editor;
            var preview          = this.preview;
            var toolbar          = this.toolbar;
            var settings         = this.settings;
            var codeMirror       = this.codeMirror;
            
            if (settings.toolbar) {
                toolbar.toggle();
            }

            toolbar.find(".fa[name=preview]").toggleClass("active");
            codeMirror.toggle();

            if(codeMirror.is(":hidden")) 
            {
                this.state.preview = true;

                if(this.state.fullscreen) {
                    preview.css("background", "#fff");
                }

                preview.show().css({
                    top       : 0,
                    //borderTop :  "none", 
                    width     : editor.width(),
                    height    : editor.height()
                });
            } 
            else 
            {
                this.previewed();
            }

            $(window).keyup(function(event) {
                if (event.keyCode === 27) {
                    _this.previewed();
                }
            });
        },
        
        /**
         * 显示编辑器部分，退出只预览HTML
         * @returns {editormd}         返回editormd的实例对象
         */
        
        previewed : function() {
            
            var editor           = this.editor;
            var preview          = this.preview;
            var toolbar          = this.toolbar;
            var settings         = this.settings;
            var codeMirror       = this.codeMirror;

            this.state.preview   = false;  
            
            codeMirror.show();
            
            if (settings.toolbar) {
                toolbar.show();
            }

            if(this.settings.watch) {
                preview.show();
            } else {
                preview.hide();
            }
            
            preview.css({ 
                background : null,
                //borderTop  : "1px solid #ddd", 
                width      : editor.width() / 2,
                height     : editor.height() - toolbar.outerHeight(),
                top        : (settings.toolbar) ? toolbar.outerHeight() : 0
            });
            
            return this;
        },
        
        /**
         * 编辑器全屏显示
         * @returns {editormd}         返回editormd的实例对象
         */
        
        fullscreen : function() {
            
            var _this            = this;
            var editor           = this.editor;
            var preview          = this.preview;
            var toolbar          = this.toolbar;
            var fullscreenClass  = this.classPrefix + "fullscreen";
            
            toolbar.find(".fa[name=fullscreen]").parent().toggleClass("active"); 

            if (!editor.hasClass(fullscreenClass)) 
            {               
                this.state.fullscreen = true;

                $("html,body").css("overflow", "hidden");
                
                editor.css({
                    position : "fixed", 
                    top      : 0, 
                    left     : 0, 
                    margin   : 0, 
                    border   : "none",
                    width    : $(window).width(),
                    height   : $(window).height()
                }).addClass(fullscreenClass);                
            }
            else
            {                
                this.fullscreenExit();                
            }                            

            this.resize();

            $(window).keyup(function(event) {
                if (_this.state.preview) {
                    return ;                
                }
                
                if (event.keyCode === 27) {
                    _this.fullscreenExit();
                }
            });

            return this;
        },
        
        /**
         * 编辑器退出全屏显示
         * @returns {editormd}         返回editormd的实例对象
         */
        
        fullscreenExit : function() {
            
            var editor            = this.editor;
            var fullscreenClass   = this.classPrefix + "fullscreen";            
            this.state.fullscreen = false;
            
            this.toolbar.find(".fa[name=fullscreen]").parent().removeClass("active"); 

            $("html,body").css("overflow", null);

            editor.css({
                position : "", 
                top      : "",
                left     : "", 
                margin   : "0 auto", 
                width    : editor.data("oldWidth"),
                height   : editor.data("oldHeight"),
                border   : "1px solid #ddd"
            }).removeClass(fullscreenClass);

            this.resize();

            return this;
        }
    };
    
    editormd.fn.init.prototype = editormd.fn; 
    
    /**
     * 自定义marked的解析器
     * @param   {Array}    markdownToC     传入用于接收TOC的数组
     * @returns {Renderer} markedRenderer  返回marked的Renderer自定义对象            
     */
    
    editormd.markedRenderer = function(markdownToC) {
        var marked         = editormd.$marked;
        var markedRenderer = new marked.Renderer();
        markdownToC        = markdownToC || [];

        markedRenderer.heading = function(text, level) {
            var escapedText    = text.toLowerCase().replace(/[^\w]+/g, "-");

            //console.log("escapedText", text, escapedText);

            markdownToC.push({
                level : level,
                slug  : escapedText,
                title : text
            });

            return "<h" + level + " id=\"" + escape(text) + "\"><a href=\"#" + text + "\" name=\"" + text + "\" class=\"anchor\"></a><span class=\"header-link\"></span>" + text + "</h" + level + ">";
        }; 

        var mathJaxList = [];

        markedRenderer.paragraph = function(text) {

            var isMathJax = /\$\$(.*)\$\$/.test(text);
            var mathjaxClassName = (isMathJax) ? " class=\"mathjax-code\"" : "";

            if (isMathJax) {
                mathJaxList.push(text);
            }

            return "<p" + mathjaxClassName + ">" + text + "</p>\n";
        };

        markedRenderer.code = function (code, lang, escaped) { 

            if (lang === "seq")
            {
                return "<div class=\"sequence-diagram\">" + code + "</div>";
            } 
            else if ( lang === "flow")
            {
                return "<div class=\"flowchart\">" + code + "</div>";
            } 
            else 
            {

                return marked.Renderer.prototype.code.apply(this, arguments);
            }
        };
        
        return markedRenderer;
    };
    
    /**
     * 将Markdown文档解析为HTML用于前台显示
     * @param {String}   id           用于显示HTML的对象ID
     * @param {Object}   [options={}] 配置选项，可选
     */
    
    editormd.markdownToHTML = function(id, options) {
        options      = options || {};
        
        var defaults = {
            markdown : "",
            mathjax : false,
            previewCodeHighlight : true,
            flowChart : false,
            sequenceDiagram : false
        };
        
        editormd.$marked = marked;
        
        var settings      = $.extend(true, defaults, options);
        var div           = $("#" + id);
        var saveTo        = div.find("[type=\"text/markdown\"]");
        var markdownDoc   = (settings.markdown === "") ? saveTo.html() : settings.markdown; 
        var markedOptions = {
            renderer: editormd.markedRenderer(),
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: true
        };
        var markdownParsed   = marked(markdownDoc, markedOptions);
        
        saveTo.html(markdownDoc);
        div.addClass("markdown-body").append(markdownParsed);
            
        if (settings.previewCodeHighlight) 
        {
            div.find("pre").addClass("prettyprint linenums");
            prettyPrint();
        }

        if (settings.flowChart) {
            div.find(".flowchart").flowChart(); 
        }

        if (settings.sequenceDiagram) {
            div.find(".sequence-diagram").sequenceDiagram({theme: "simple"});
        }

        if (settings.mathjax) 
        {
            editormd.setMathJaxConfig(function() {
                editormd.loadMathJax();
            });
        }
    };
    
    /**
     * 用于支持Require.js加载的方法
     * @param {Function} CodeMirror  CodeMirror对象
     * @param {Function} marked      marked对象
     * @param {Function} prettyPrint prettyPrint函数
     */
    
    editormd.requirejsInit    = function(CodeMirror, marked, prettyPrint) {
        editormd.$CodeMirror  = CodeMirror;
        editormd.$marked      = marked;
        editormd.$prettyPrint = prettyPrint;
    };
    
    /**
     * 用于Require.js加载的模块队列
     * @param   {String} [loadPath=""] 基本路径，默认为空
     * @returns {Array}  modules       返回队列路径数组
     */
    
    editormd.requireModules = function(loadPath) {
        loadPath     = loadPath || "";
        var settings = editormd.defaults;
        var modules  = [];
        
        modules.push(loadPath + "codemirror/lib/codemirror.min");
        
        for (var i = 0, len = settings.codemirror.modes.length; i < len; i++) 
        {
            var modeName = settings.codemirror.modes[i];
            modules.push(loadPath + "codemirror/mode/" + modeName + "/" + modeName);
        }   

        for (var i = 0, len = settings.codemirror.addons.length; i < len; i++) 
        {
            var addonName = settings.codemirror.addons[i];
            modules.push(loadPath + "codemirror/addon/" + addonName);
        }

        return modules;
    };
    
    /**
     * 动态加载CSS文件的方法
     * @param {String}   fileName              CSS文件名
     * @param {Function} [callback=function()] 加载成功后执行的回调函数
     * @param {String}   [into="head"]         嵌入页面的位置
     */
    
    editormd.loadCSS   = function(fileName, callback, into) {
        
        into       = into     || "head";        
        callback   = callback || function() {};
        
        var css    = document.createElement("link");
        css.type   = "text/css";
        css.rel    = "stylesheet";
        css.onload = css.onreadystatechange = function() {
            callback();
        };

        css.href   = fileName + ".css";

        if(into === "head") {
            document.getElementsByTagName("head")[0].appendChild(css);
        } else {
            document.body.appendChild(css);
        }
    };
        
    /**
     * 动态加载JS文件的方法
     * @param {String}   fileName              JS文件名
     * @param {Function} [callback=function()] 加载成功后执行的回调函数
     * @param {String}   [into="head"]         嵌入页面的位置
     */
    
    editormd.loadScript = function(fileName, callback, into) {
        
        into          = into     || "head";
        callback      = callback || function() {};
        
        var script    = document.createElement("script");
        script.type   = "text/javascript";
        
        script.onload = script.onreadystatechange = function() {
            if(script.readyState) 
            {
                if (script.readyState === "loaded" || script.readyState === "complete") 
                {
                    script.onreadystatechange = null; 
                    callback();
                }
            } 
            else
            {
                callback();
            }
        };
        
        script.src    = fileName + ".js";

        //console.log("script.src =>", script.src);

        if (into === "head") {
            document.getElementsByTagName("head")[0].appendChild(script);
        } else {
            document.body.appendChild(script);
        }
    };
    
    /**
     * MathJax配置信息
     * @param {Function} [callback=function()]  加载成功后执行的回调函数
     */
    
    editormd.setMathJaxConfig = function (callback) {
        callback         = callback || function() {};
        
        var script       = document.createElement("script");
        script.className = "mathjax-config";
        script.type      = "text/x-mathjax-config";
        script.text      = 'MathJax.Hub.Config({' +
                                'extensions: ["tex2jax.js"],'+
                                'jax: ["input/TeX","output/HTML-CSS"],'+
                                'tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]}'+
                            '});';

        document.getElementsByTagName("head")[0].appendChild(script);

        callback();
    };
    
    editormd.mathjaxURL  = "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
    
    /**
     * 加载MathJax文件
     * @param {Function} [callback=function()]  加载成功后执行的回调函数
     */
    
    editormd.loadMathJax = function (callback) {
        callback = callback || function() {};
        
        var script       = document.createElement("script");
        script.type      = "text/javascript";
        script.className = "mathjax-script";
        
        script.onload    = script.onreadystatechange = function() {
            if (script.readyState)
            {
                if (script.readyState === "loaded" || script.readyState === "complete") 
                {
                    script.onreadystatechange = null; 
                    callback();
                }
            } 
            else 
            {
                callback();
            }
        };
        
        script.src       = editormd.mathjaxURL;
        
        document.getElementsByTagName("head")[0].appendChild(script);
    };
    
    /**
     * 鼠标和触摸事件的判断/选择方法
     * @param   {String} [mouseEventType="click"]    供选择的鼠标事件
     * @param   {String} [touchEventType="touchend"] 供选择的触摸事件
     * @returns {String} EventType                   返回事件类型名称
     */
    
    editormd.mouseOrTouch = function(mouseEventType, touchEventType) {
        mouseEventType = mouseEventType || "click";
        touchEventType = touchEventType || "touchend";
        
        var eventType  = mouseEventType;

        try
        {
            document.createEvent("TouchEvent");
            eventType = touchEventType;
        }  
        catch(e) {
        } 

        return eventType;
    };   
    
    /**
     * 日期时间的格式化方法
     * @param   {String}   [format=""]  日期时间的格式，类似PHP的格式
     * @returns {String}   datefmt      返回格式化后的日期时间字符串
     */
    
    editormd.dateFormat = function(format) {                
        format      = format || "";

        var addZero = function(d) {
            return (d < 10) ? "0" + d : d;
        };

        var date    = new Date; 
        var year    = date.getFullYear();
        var year2   = year.toString().slice(2, 4);
        var month   = addZero(date.getMonth() + 1);
        var day     = addZero(date.getDate());
        var weekDay = date.getDay();
        var hour    = addZero(date.getHours());
        var min     = addZero(date.getMinutes());
        var second  = addZero(date.getSeconds());
        var ms      = addZero(date.getMilliseconds()); 
        var datefmt = "";

        var ymd     = year2 + "-" + month + "-" + day;
        var fymd    = year  + "-" + month + "-" + day;
        var hms     = hour  + ":" + min   + ":" + second;

        switch (format) 
        {
            case "UNIX Time" :
                    datefmt = date.getTime();
                break;

            case "UTC" :
                    datefmt = date.toUTCString();
                break;	

            case "yy" :
                    datefmt = year2;
                break;	

            case "year" :
            case "yyyy" :
                    datefmt = year;
                break;

            case "month" :
            case "mm" :
                    datefmt = month;
                break;                        

            case "cn-week-day" :
            case "cn-wd" :
                    var cnWeekDays = ["日", "一", "二", "三", "四", "五", "六"];
                    datefmt = "星期" + cnWeekDays[weekDay];
                break;

            case "week-day" :
            case "wd" :
                    datefmt = weekDay;
                break;

            case "day" :
            case "dd" :
                    datefmt = day;
                break;

            case "hour" :
            case "hh" :
                    datefmt = hour;
                break;

            case "min" :
            case "ii" :
                    datefmt = min;
                break;

            case "second" :
            case "ss" :
                    datefmt = second;
                break;

            case "ms" :
                    datefmt = ms;
                break;	

            case "yy-mm-dd" :
                    datefmt = ymd;
                break;

            case "yyyy-mm-dd" :
                    datefmt = fymd;
                break;

            case "yyyy-mm-dd h:i:s ms" :
            case "full + ms" : 
                    datefmt = fymd + " " + hms + " " + ms;
                break;	

            case "full" :
            case "yyyy-mm-dd h:i:s" :
                default:
                    datefmt = fymd + " " + hms;
                break;	
        }

        return datefmt;
    };
    
    return editormd;
    
}));