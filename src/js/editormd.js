/** 
 * @fileOverview Editor.md
 * @author pandao
 * @version 1.1.6
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
    
    var $ = (typeof (jQuery) !== "undefined") ? jQuery : Zepto;

	if (typeof ($) === "undefined") {
		return ;
	}
    
    var editormd         = function (id, options) {
        return new editormd.fn.init(id, options);
    };
    
    editormd.title       = editormd.$name = "Editor.md";
    editormd.version     = "1.1.6";
    editormd.homePage    = "https://pandao.github.io/editor.md/";
    editormd.classPrefix = "editormd-";  
    
    editormd.defaults    = {
        mode                 : "gfm",          //gfm or markdown
        markdown             : "",
        width                : "100%",
        height               : "100%",
        path                 : "./lib/",
        watch                : true,
        placeholder          : "now coding markdown...",
        readOnly             : false,
        lineNumbers          : true,
        styleActiveLine      : true,           // 高亮显示当前行
        dialogLockScreen     : true,
        dialogShowMask       : true,
        dialogDraggable      : true,
        dialogMaskBgColor    : "#fff",
        dialogMaskOpacity    : 0.1,
        onload               : function() {},
        onchange             : function() {},
        onfullscreen         : function() {},
        onfullscreenExit     : function() {},
        imageUpload          : false,
        imageFormats         : ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
        imageUploadURL       : "",
        crossDomainUpload    : false,
        uploadCallbackURL    : "",
        saveHTMLToTextarea   : false,
        toc                  : true,
        tocStartLevel        : 1,              // 表示从H1开始生成ToC
        fontSize             : "13px",
        htmlDecode           : false,          // 是否开启HTML标签识别
        tex                  : false,
        flowChart            : false,          // flowChart.js only support IE9+
        sequenceDiagram      : false,          // sequenceDiagram.js only support IE9+
        previewCodeHighlight : true,
        inRequirejs          : false,
        toolbar              : true,
        toolbarIcons         : function() {
            return [
                "undo", "redo", "|", 
                "bold", "del", "italic", "quote", "|", 
                "h1", "h2", "h3", "h4", "h5", "h6", "|", 
                "list-ul", "list-ol", "hr", "|",
                "link", "anchor", "image", "code", "code-block-tab", "code-block", "datetime", "|",
                "watch", "preview", "fullscreen", "clear", "|",
                "info"
            ]
        },   
        toolbarTitles        : {},
        toolbarHandlers      : {},  // 工具栏按钮的点击后事件处理
        
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
            anchor           : "fa-anchor",
            image            : "fa-picture-o",
            code             : "fa-code",
            "code-block-tab" : "fa-file-code-o",
            "code-block"     : "fa-file-code-o",
            datetime         : "fa-clock-o",
            watch            : "fa-eye-slash",
            unwatch          : "fa-eye",
            preview          : "fa-search",
            fullscreen       : "fa-arrows-alt",
            clear            : "fa-eraser",
            info             : "fa-info-circle"
        },
        
        toolbarIconTexts     : {},
        lang : {
            name        : "zh-cn",
            description : "开源在线Markdown编辑器<br/>A simple markdown doucment online editor.",
            toolbar     : {
                undo             : "撤销（Ctrl+Z）",
                redo             : "重做（Ctrl+Y）",
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
                anchor           : "锚点",
                image          : "图片",
                code             : "行内代码",
                "code-block-tab" : "预格式文本 / 代码块（缩进风格）",
                "code-block"     : "代码块（多语言风格）",
                datetime         : "日期时间",
                watch            : "关闭实时预览",
                unwatch          : "开启实时预览",
                preview          : "全窗口预览HTML（可按ESC还原）",
                fullscreen       : "全屏（按ESC还原）",
                clear            : "清空",
                info             : "关于" + editormd.title
            },
            buttons : {
                enter  : "确定",
                cancel : "取消"
            },
            dialog : {
                link : {
                    title    : "添加链接",
                    url      : "链接地址",
                    urlTitle : "链接标题",
                    urlEmpty : "错误：请填写链接地址。",
                    titleEmpty : "错误：请填写链接标题。"
                },
                anchor : {
                    title    : "添加锚点链接",
                    name     : "锚点名称",
                    url      : "链接地址",
                    urlTitle : "链接标题",
                    nameEmpty: "错误：锚点名称不能为空。",
                    titleEmpty : "错误：请填写锚点链接标题。",
                    urlEmpty : "错误：请填写锚点链接地址。"
                },
                image : {
                    title    : "添加图片",
                    url      : "图片地址",
                    link     : "图片链接",
                    alt      : "图片描述",
                    uploadButton     : "本地上传",
                    imageURLEmpty    : "错误：图片地址不能为空。",
                    uploadFileEmpty  : "错误：上传的图片不能为空。",
                    formatNotAllowed : "错误：只允许上传图片文件，允许上传的图片文件格式有："
                },
                tabCodeBlock : {
                    title             : "添加预格式文本或代码块", 
                    codeEmptyAlert    : "错误：请填写预格式文本或代码的内容。"
                },
                codeBlock : {
                    title             : "添加代码块",                    
                    selectLabel       : "代码语言：",
                    selectDefaultText : "请选择代码语言",
                    otherLanguage     : "其他语言",
                    unselectedLanguageAlert : "错误：请选择代码所属的语言类型。",
                    codeEmptyAlert    : "错误：请填写代码内容。"
                }
            }
        }
    };
    
    editormd.classNames  = {
        tex : editormd.classPrefix + "tex"
    };
                
    editormd.dialogZindex = 99999;
    
    editormd.$katex       = null;
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
            
            options              = options || {};
            
            var _this            = this;
            var classPrefix      = this.classPrefix  = editormd.classPrefix;
            var editor           = this.editor       = $("#" + id);        
            var settings         = this.settings     = $.extend(true, editormd.defaults, options);
            
            this.id              = id;
            this.lang            = settings.lang;
            
            var classNames       = this.classNames   = {
                textarea : {
                    html     : this.classPrefix + "html-textarea",
                    markdown : this.classPrefix + "markdown-textarea"
                }
            };
            
            if (!editor.hasClass("editormd")) {
                editor.addClass("editormd");
            }
            
            editor.css({
                width  : (typeof settings.width  === "number") ? settings.width  + "px" : settings.width,
                height : (typeof settings.height === "number") ? settings.height + "px" : settings.height
            });
                        
            var markdownTextarea = this.markdownTextarea = editor.children("textarea");
            
            if (markdownTextarea.length < 1)
            {
                editor.append("<textarea></textarea>");
                markdownTextarea = this.markdownTextarea = editor.children("textarea");
            }
            
            markdownTextarea.addClass(classNames.textarea.markdown).attr("name", id + "-markdown-doc").attr("placeholder", settings.placeholder);
            
            var appendElements = [
                (!settings.readOnly) ? "<a href=\"javascript:;\" class=\"fa fa-close " + classPrefix + "preview-close-btn\"></a>" : "",
                ( (settings.saveHTMLToTextarea) ? "<textarea class=\"" + classNames.textarea.html + "\" name=\"" + id + "-html-code\"></textarea>" : "" ),
                "<div class=\"" + classPrefix + "preview\"><div class=\"markdown-body " + classPrefix + "preview-container\"></div></div>",
                "<div class=\"" + classPrefix + "container-mask\" style=\"display:block;\"></div>",
                "<div class=\"" + classPrefix + "mask\"></div>"
            ].join("\n");
            
            editor.append(appendElements).addClass(classPrefix + "vertical");
            
            if (settings.markdown !== "")
            {
                markdownTextarea.val(settings.markdown);
            }
            
            this.htmlTextarea = editor.find("." + classNames.textarea.html);
            
            this.preview              = editor.find("." + classPrefix + "preview");
            this.previewContainer     = this.preview.children("." + classPrefix + "preview-container");
            this.toolbarIconHandlers  = {};
            
            if (!settings.inRequirejs) 
            {
                this.loadQueues();
            } 
            else 
            {
                _this.setCodeMirror();                 
                _this.setToolbar();
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
            var loadPath     = settings.path;
                                
            var loadFlowChartOrSequenceDiagram = function() {
                
                if (editormd.isIE8) 
                {
                    _this.setMarked().loadedDisplay();
                    
                    return ;
                }

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

            editormd.loadCSS(loadPath + "codemirror/codemirror.min");            
            editormd.loadScript(loadPath + "codemirror/codemirror.min", function() {  
                
                editormd.$CodeMirror = CodeMirror;
                
                editormd.loadScript(loadPath + "codemirror/modes.min", function() {
                    
                    editormd.loadScript(loadPath + "codemirror/addons.min", function() {
                        
                        _this.setCodeMirror(); 
                        _this.setToolbar();

                        editormd.loadScript(loadPath + "marked.min", function() {

                            editormd.$marked = marked;
                                
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
                        
                    });
                    
                });
                
            });

            return this;
        },
        
        /**
         * 配置和初始化CodeMirror组件
         * @returns {editormd}  返回editormd的实例对象
         */
        
        setCodeMirror : function() { 
            var settings         = this.settings;
            var editor           = this.editor;
            var codeMirrorConfig = {
                mode                      : settings.mode,
                theme                     : "default",
                tabSize                   : 4,
                dragDrop                  : false,
                autofocus                 : true,
                readOnly                  : (settings.readOnly) ? "nocursor" : false,
                indentUnit                : 4,
                lineNumbers               : settings.lineNumbers,
                lineWrapping              : true,
                matchBrackets             : true,
                indentWithTabs            : true,
                styleActiveLine           : settings.styleActiveLine,
                styleSelectedText         : true,
                autoCloseBrackets         : true,
                showTrailingSpace         : true,
                highlightSelectionMatches : {
                    showToken: /\w/
                }
            };
            
            this.codeEditor = editormd.$CodeMirror.fromTextArea(this.markdownTextarea[0], codeMirrorConfig);
            this.codeMirror = editor.find(".CodeMirror");
            
            this.codeMirror.css({
                fontSize : settings.fontSize,
                width    : (!settings.watch) ? "100%" : "50%"
            });

            return this;
        },
        
        /**
         * 显示工具栏
         * @returns {editormd}  返回editormd的实例对象
         */
        
        showToolbar : function() {
            var settings = this.settings;
            if(settings.readOnly) return ;
            
            settings.toolbar = true; 
            this.toolbar.show();
            this.resize();

            return this;
        },
        
        /**
         * 隐藏工具栏
         * @returns {editormd}  返回editormd的实例对象
         */
        
        hideToolbar : function() { 
            var settings = this.settings; 
            
            settings.toolbar = false;  
            this.toolbar.hide();
            this.resize();

            return this;
        },
        
        /**
         * 配置和初始化工具栏
         * @returns {editormd}  返回editormd的实例对象
         */
        
        setToolbar : function() {
            var settings    = this.settings;  
            
            if(settings.readOnly) return ;
            
            var editor      = this.editor;
            var preview     = this.preview;
            var classPrefix = this.classPrefix;
            
            editor.append('<div class="'+classPrefix+'toolbar"><div class="'+classPrefix+'toolbar-container"><ul class="'+classPrefix+'menu"></ul></div></div>');
            
            var toolbar     = this.toolbar = editor.find("." + classPrefix + "toolbar");
            
            if (!settings.toolbar) 
            {
                toolbar.hide();
                
                return ;
            } 
            else 
            {
                toolbar.show();
            }
            
            var icons       = settings.toolbarIcons();
            var toolbarMenu = toolbar.find("." + this.classPrefix + "menu"), menu = "";
            
            for (var i = 0, len = icons.length; i < len; i++)
            {
                var name = icons[i];
                
                if (name !== "|")
                {
                    var isHeader = (/h(\d)/.test(name));
                    var index    = name;
                    
                    if (name === "watch" && !settings.watch) {
                        index = "unwatch";
                    }
                    
                    var title     = settings.lang.toolbar[index];
                    var iconTexts = settings.toolbarIconTexts[index];
                    var iconClass = settings.toolbarIconsClass[index];
                    
                    title     = (typeof title     === "undefined") ? "" : title;
                    iconTexts = (typeof iconTexts === "undefined") ? "" : iconTexts;
                    iconClass = (typeof iconClass === "undefined") ? "" : iconClass;
                    
                    menu += "<li><a href=\"javascript:;\" title=\"" + title + "\" unselectable=\"on\">" +
                            "<i class=\"fa " + iconClass + "\" name=\""+name+"\" unselectable=\"on\">"+((isHeader) ? name : ( (iconClass === "") ? iconTexts : "") ) + "</i></a></li>";
                }
                else
                {
                    menu += "<li class=\"divider\" unselectable=\"on\">|</li>";
                }
            }
            
            toolbarMenu.html(menu);
            
            this.setToolbarHandler();

            return this;
        },
        
        /**
         * 工具栏图标事件处理对象序列
         * @param   {Object}   cm    CodeMirror的实例对象
         * @param   {String}   name  要获取的事件处理器名称
         * @returns {Object}         返回处理对象序列
         */
        
        getToolbarHandles : function(name) {            
            var _this       = this;
            var settings    = this.settings;
            var lang        = settings.lang;
            var editor      = this.editor;
            var classPrefix = this.classPrefix;
            
            var dialogLockScreen = function() {    
                if (settings.dialogLockScreen) {
                    $("html,body").css("overflow", "hidden");
                }
            };
            
            var dialogShowMask = function(dialog) {
                dialog.css({
                    top    : ($(window).height() - dialog.height()) / 2 + "px",
                    left   : ($(window).width() - dialog.width()) / 2 + "px"
                });
                
                if (settings.dialogShowMask) {
                    editor.find("." + classPrefix + "mask").css("z-index", parseInt(dialog.css("z-index")) - 1).show();
                }
            };
            
            var toolbarHandlers = this.toolbarHandlers = {
                undo : function(cm) {
                    cm.undo();
                },
                redo : function(cm) {
                    cm.redo();
                },
                bold : function(cm) {
                    var cursor    = cm.getCursor();
                    var selection = cm.getSelection();
                    
                    cm.replaceSelection("**" + selection + "**");

                    if(selection === "") {
                        cm.setCursor(cursor.line, cursor.ch + 2);
                    }                    
                },
                del : function(cm) {
                    var cursor    = cm.getCursor();
                    var selection = cm.getSelection();
                    
                    cm.replaceSelection("~~" + selection + "~~");

                    if(selection === "") {
                        cm.setCursor(cursor.line, cursor.ch + 2);
                    }
                },

                italic : function(cm) {
                    var cursor    = cm.getCursor();
                    var selection = cm.getSelection();
                    
                    cm.replaceSelection("*" + selection + "*");

                    if(selection === "") {
                        cm.setCursor(cursor.line, cursor.ch + 1);
                    }
                },

                quote : function(cm) {
                    var cursor    = cm.getCursor();
                    var selection = cm.getSelection();
                    
                    cm.replaceSelection("> " + selection);
                    cm.setCursor(cursor.line, (selection === "") ? cursor.ch + 2 : cursor.ch + selection.length + 2);
                },

                h1 : function(cm) {
                    var selection = cm.getSelection();
                    
                    cm.replaceSelection("# " + selection);
                },

                h2 : function(cm) {
                    var selection = cm.getSelection();
                    
                    cm.replaceSelection("## " + selection);
                },

                h3 : function(cm) {
                    var selection = cm.getSelection();
                    
                    cm.replaceSelection("### " + selection);
                },

                h4 : function(cm) {
                    var selection = cm.getSelection();
                    
                    cm.replaceSelection("#### " + selection);
                },

                h5 : function(cm) {
                    var selection = cm.getSelection();
                    
                    cm.replaceSelection("##### " + selection);
                },

                h6 : function(cm) {
                    var selection = cm.getSelection();
                    
                    cm.replaceSelection("###### " + selection);
                },

                "list-ul" : function(cm) {
                    var cursor    = cm.getCursor();
                    var selection = cm.getSelection();

                    if (selection === "") 
                    {
                        cm.replaceSelection("- " + selection);
                    } 
                    else 
                    {
                        var selectionText = selection.split("\n");

                        for (var i = 0, len = selectionText.length; i < len; i++) 
                        {
                            selectionText[i] = (selectionText[i] === "") ? "" : "- " + selectionText[i];
                        }

                        cm.replaceSelection(selectionText.join("\n"));
                    }
                },

                "list-ol" : function(cm) {
                    var cursor    = cm.getCursor();
                    var selection = cm.getSelection();

                    if(selection === "") 
                    {
                        cm.replaceSelection("1. " + selection);
                    }
                    else
                    {
                        var selectionText = selection.split("\n");

                        for (var i = 0, len = selectionText.length; i < len; i++) 
                        {
                            selectionText[i] = (selectionText[i] === "") ? "" : (i+1) + ". " + selectionText[i];
                        }

                        cm.replaceSelection(selectionText.join("\n"));
                    }
                },

                hr : function(cm) {
                    var cursor    = cm.getCursor();
                    var selection = cm.getSelection();
                    
                    cm.replaceSelection("------------");
                },

                link : function(cm) {
                    var selection      = cm.getSelection();
                    var linkLang       = lang.dialog.link;
                    var linkDialogName = classPrefix + "link-dialog", linkDialog;

                    if (editor.find("." + linkDialogName).length > 0)
                    {
                        linkDialog = editor.find("." + linkDialogName);
                        linkDialog.find("[data-url]").val("http://");
                        linkDialog.find("[data-title]").val(selection);
                        
                        dialogShowMask(linkDialog);
                        dialogLockScreen();
                        linkDialog.show();
                    }
                    else
                    {                        
                        var linkDialogHTML = "<div class=\"" + classPrefix + "form\">" + 
                                                "<label>" + linkLang.url + "</label>" + 
                                                "<input type=\"text\" value=\"http://\" data-url />" +
                                                "<br/>" + 
                                                "<label>" + linkLang.urlTitle + "</label>" + 
                                                "<input type=\"text\" value=\"" + selection + "\" data-title />" + 
                                                "<br/>" +
                                            "</div>";

                        linkDialog = _this.createDialog({
                            title : linkLang.title,
                            width : 380,
                            height : 210,
                            content : linkDialogHTML,
                            mask   : settings.dialogShowMask,
                            drag   : settings.dialogDraggable,
                            lockScreen : settings.dialogLockScreen,
                            maskStyle  : {
                                opacity         : settings.dialogMaskOpacity,
                                backgroundColor : settings.dialogMaskBgColor
                            },
                            buttons : {
                                enter  : [lang.buttons.enter, function() {
                                    var url   = this.find("[data-url]").val();
                                    var title = this.find("[data-title]").val();
                                    
                                    if (url === "http://" || url === "")
                                    {
                                        alert(linkLang.urlEmpty);
                                        return false;
                                    }
                                    
                                    if (title === "")
                                    {
                                        alert(linkLang.titleEmpty);
                                        return false;
                                    }

                                    cm.replaceSelection("[" + title + "](" + url + " \""+title+"\")");
                                   
                                    this.hide().lockScreen(false).hideMask();
                                    
                                    return false;
                                }],
                                cancel : [lang.buttons.cancel, function() {                                   
                                    this.hide().lockScreen(false).hideMask();
                                    
                                    return false;
                                }]
                            }
                        });
                    }
                },

                anchor : function(cm) {
                    var cursor           = cm.getCursor();
                    var selection        = cm.getSelection();                    
                    var anchorLang       = lang.dialog.anchor;
                    var anchorDialogName = classPrefix + "anchor-dialog", anchorDialog;

                    if (editor.find("." + anchorDialogName).length > 0)
                    {
                        anchorDialog = editor.find("." + anchorDialogName);
                        anchorDialog.find("[data-name]").val("");
                        anchorDialog.find("[data-url]").val("http://");
                        anchorDialog.find("[data-title]").val(selection);
                        
                        dialogShowMask(anchorDialog);
                        dialogLockScreen();
                        anchorDialog.show();
                    }
                    else 
                    {      
                        var anchorDialogHTML = "<div class=\"" + classPrefix + "form\">" +
                                                "<label>" + anchorLang.name + "</label>" +
                                                "<input type=\"text\" data-name />" +  
                                                "<br/>" +
                                                "<label>" + anchorLang.url + "</label>" +
                                                "<input type=\"text\" value=\"http://\" data-url />" + 
                                                "<br/>" +
                                                "<label>" + anchorLang.urlTitle + "</label>" +
                                                "<input type=\"text\" value=\"" + selection + "\" data-title />" +
                                                "<br/>" +
                                            "</div>";

                        anchorDialog = _this.createDialog({   
                            name   : anchorDialogName,
                            title  : anchorLang.title,
                            width  : 380,
                            height : 250,
                            content : anchorDialogHTML,
                            mask   : settings.dialogShowMask,
                            drag   : settings.dialogDraggable,
                            lockScreen : settings.dialogLockScreen,
                            maskStyle  : {
                                opacity         : settings.dialogMaskOpacity,
                                backgroundColor : settings.dialogMaskBgColor
                            },
                            buttons : {
                                enter  : [lang.buttons.enter, function() {
                                    var name  = this.find("[data-name]").val();
                                    var url   = this.find("[data-url]").val();
                                    var title = this.find("[data-title]").val();
                                    
                                    if (name === "")
                                    {
                                        alert(anchorLang.nameEmpty);
                                        return false;
                                    }
                                    
                                    if (url === "http://" || url === "")
                                    {
                                        alert(anchorLang.urlEmpty);
                                        return false;
                                    }
                                    
                                    if (title === "")
                                    {
                                        alert(anchorLang.titleEmpty);
                                        return false;
                                    }

                                    cm.replaceSelection("[" + title + "][" + name + "]\n[" + name + "]: " + url + "");

                                    if (selection === "") {
                                        cm.setCursor(cursor.line, cursor.ch + 1);
                                    }
                                   
                                    this.hide().lockScreen(false).hideMask();
                                    
                                    return false;
                                }],
                                cancel : [lang.buttons.cancel, function() {                                   
                                    this.hide().lockScreen(false).hideMask();
                                    
                                    return false;
                                }]
                            }
                        });
                    }
                },

                image : function(cm) {
                    var cursor          = cm.getCursor();
                    var selection       = cm.getSelection();
                    var imageLang       = lang.dialog.image;
                    var iframeName      = classPrefix + "image-iframe";                        
                    var imageDialogName = classPrefix + "image-dialog", imageDialog;

                    if (editor.find("." + imageDialogName).length > 0) 
                    {
                        imageDialog = editor.find("." + imageDialogName);
                        imageDialog.find("[type=\"text\"]").val("");
                        imageDialog.find("[type=\"file\"]").val("");
                        imageDialog.find("[data-link]").val("http://");
                        
                        dialogShowMask(imageDialog);
                        dialogLockScreen();
                        imageDialog.show();
                    } 
                    else 
                    {    
                        var guid   = (new Date).getTime();
                        var action = settings.imageUploadURL + "?guid=" + guid;
                        
                        if (settings.crossDomainUpload)
                        {
                            action += "&callback=" + settings.uploadCallbackURL + "&dialog_id=editormd-image-dialog-" + guid;
                        }
                        
                        var imageDialogHTML = ( (settings.imageUpload) ? "<form action=\"" + action +"\" target=\"" + iframeName + "\" method=\"post\" enctype=\"multipart/form-data\" class=\"" + classPrefix + "form\">" : "<div class=\"" + classPrefix + "form\">" ) +
                                                ( (settings.imageUpload) ? "<iframe name=\"" + iframeName + "\" id=\"" + iframeName + "\" guid=\"" + guid + "\"></iframe>" : "" ) +
                                                "<label>" + imageLang.url + "</label>" +
                                                "<input type=\"text\" data-url />" + (function(){
                                                    return (settings.imageUpload) ? "<div class=\"" + classPrefix + "file-input\">" +
                                                                                        "<input type=\"file\" name=\"" + classPrefix + "image-file\" accept=\"image/*\" />" +
                                                                                        "<input type=\"submit\" value=\"" + imageLang.uploadButton + "\" />" +
                                                                                    "</div>" : "";
                                                })() +
                                                "<br/>" +
                                                "<label>" + imageLang.alt + "</label>" +
                                                "<input type=\"text\" data-alt />" + 
                                                "<br/>" +
                                                "<label>" + imageLang.link + "</label>" +
                                                "<input type=\"text\" value=\"http://\" data-link />" +
                                                "<br/>" +
                                            ( (settings.imageUpload) ? "</form>" : "</div>");

                        //var imageFooterHTML = "<button class=\"" + classPrefix + "btn " + classPrefix + "image-manager-btn\" style=\"float:left;\">" + imageLang.managerButton + "</button>";  

                        imageDialog = _this.createDialog({
                            title   : imageLang.title,
                            width   : (settings.imageUpload) ? 465 : 380,
                            height  : 250,
                            name    : imageDialogName,
                            content : imageDialogHTML,
                            mask    : settings.dialogShowMask,
                            drag    : settings.dialogDraggable,
                            lockScreen : settings.dialogLockScreen,
                            maskStyle  : {
                                opacity         : settings.dialogMaskOpacity,
                                backgroundColor : settings.dialogMaskBgColor
                            },
                            buttons : {
                                enter : [lang.buttons.enter, function() {
                                    var url  = this.find("[data-url]").val();
                                    var alt  = this.find("[data-alt]").val();
                                    var link = this.find("[data-link]").val();
                                    
                                    if (url === "")
                                    {
                                        alert(imageLang.imageURLEmpty);
                                        return false;
                                    }

                                    if (link === "" || link === "http://")
                                    {                                    
                                        cm.replaceSelection("![" + alt + "](" + url + " \"" + alt + "\")");
                                    }
                                    else 
                                    {                                   
                                        cm.replaceSelection("[![" + alt + "](" + url + " \"" + alt + "\")](" + link + " \"" + alt + "\")");
                                    }

                                    if (alt === "") {
                                        cm.setCursor(cursor.line, cursor.ch + 2);
                                    }
                                   
                                    this.hide().lockScreen(false).hideMask();
                                    
                                    return false;
                                }],
                                cancel : [lang.buttons.cancel, function() {                                   
                                    this.hide().lockScreen(false).hideMask();
                                    
                                    return false;
                                }]
                            }
                        });
                        
                        imageDialog.attr("id", classPrefix + "image-dialog-" + guid);
                    }
                    
                    var fileInput  = imageDialog.find("[name=\"" + classPrefix + "image-file\"]");

                    fileInput.bind("change", function() {
                        var fileName  = fileInput.val();
                        var isImage   = new RegExp("(\\.(" + settings.imageFormats.join("|") + "))$"); // /(\.(webp|jpg|jpeg|gif|bmp|png))$/

                        if (fileName === "")
                        {
                            alert(imageLang.uploadFileEmpty);
                        }
                        else if (!isImage.test(fileName))
                        {      
                            alert(imageLang.formatNotAllowed + settings.imageFormats.join(", "));
                        } 
                        else 
                        {
                            imageDialog.loading(true);

                            var submitHandler = function() {
                                
                                var uploadIframe = document.getElementById(iframeName);
                                
                                uploadIframe.onload = function() {
                                    imageDialog.loading(false);
                                    
                                    var json = uploadIframe.contentWindow.document.body.innerHTML;
                                    json = (typeof JSON.parse !== "undefined") ? JSON.parse(json) : eval("(" + json + ")");

                                    if (json.success === 1)
                                    {
                                        imageDialog.find("[data-url]").val(json.url);
                                    }
                                    else
                                    {
                                        alert(json.message);
                                    }

                                    return false;
                                };
                            };

                            imageDialog.find("[type=\"submit\"]").bind(editormd.mouseOrTouch("click", "touchend"), submitHandler).trigger("click");

                        }                    

                        return false;
                    });
                },

                code : function(cm) {
                    var cursor    = cm.getCursor();
                    var selection = cm.getSelection();

                    cm.replaceSelection("`" + selection + "`");

                    if (selection === "") {
                        cm.setCursor(cursor.line, cursor.ch + 1);
                    }

                },

                "code-block-tab" : function(cm) {
                    var cursor                 = cm.getCursor();
                    var selection              = cm.getSelection();
                    var tabCodeBlockDialogName = classPrefix + "dialog-tab-code-block", tabCodeBlockDialog;                     
                    
                    if (editor.find("." + tabCodeBlockDialogName).length > 0)
                    {
                        tabCodeBlockDialog = editor.find("." + tabCodeBlockDialogName);
                        tabCodeBlockDialog.find("textarea").val(selection);
                        
                        dialogShowMask(tabCodeBlockDialog);
                        dialogLockScreen();
                        tabCodeBlockDialog.show();
                    }
                    else 
                    {      
                        var tabCodeBlockDialogHTML = "<textarea placeholder=\"coding now....\" style=\"width: 680px;height: 300px;\">" + selection + "</textarea>";

                        tabCodeBlockDialog = _this.createDialog({
                            name   : tabCodeBlockDialogName,
                            title  : lang.dialog.tabCodeBlock.title,
                            width  : 750,
                            height : 470,
                            mask   : settings.dialogShowMask,
                            drag   : settings.dialogDraggable,
                            content : tabCodeBlockDialogHTML,
                            lockScreen : settings.dialogLockScreen,
                            maskStyle  : {
                                opacity         : settings.dialogMaskOpacity,
                                backgroundColor : settings.dialogMaskBgColor
                            },
                            buttons : {
                                enter  : [lang.buttons.enter, function() {
                                    var codeTexts  = this.find("textarea").val();
                                    
                                    if (codeTexts === "")
                                    {
                                        alert(lang.dialog.tabCodeBlock.codeEmptyAlert);
                                        return false;
                                    }
                                    
                                    codeTexts = codeTexts.split("\n");
                                    
                                    for (var i in codeTexts)
                                    {
                                        codeTexts[i] = "    " + codeTexts[i];
                                    }
                                    
                                    cm.replaceSelection(codeTexts.join("\n"));
                                   
                                    this.hide().lockScreen(false).hideMask();
                                    
                                    return false;
                                }],
                                cancel : [lang.buttons.cancel, function() {                                  
                                    this.hide().lockScreen(false).hideMask();
                                    
                                    return false;
                                }]
                            }
                        });
                    }
                },

                "code-block" : function(cm) {
                    var cursor              = cm.getCursor();
                    var selection           = cm.getSelection();
                    var codeBlockDialogName = classPrefix + "dialog-code-block", codeBlockDialog;

                    if (editor.find("." + codeBlockDialogName).length > 0)
                    {
                        codeBlockDialog = editor.find("." + codeBlockDialogName);
                        codeBlockDialog.find("option:first").attr("selected", "selected");
                        codeBlockDialog.find("textarea").val(selection);
                        
                        dialogShowMask(codeBlockDialog);
                        dialogLockScreen();
                        codeBlockDialog.show();
                    }
                    else 
                    {      
                        var codeBlockDialogHTML = "<div class=\"" + classPrefix + "code-toolbar\">" +
                                                lang.dialog.codeBlock.selectLabel + "<select><option selected=\"selected\" value=\"\">" + lang.dialog.codeBlock.selectDefaultText + "</option></select>" +
                                            "</div>" +
                                            "<textarea placeholder=\"coding now....\" style=\"width: 680px;height: 360px;\">" + selection + "</textarea>";

                        codeBlockDialog = _this.createDialog({
                            name   : codeBlockDialogName,
                            title  : lang.dialog.codeBlock.title,
                            width  : 752,
                            height : 565,
                            mask   : settings.dialogShowMask,
                            drag   : settings.dialogDraggable,
                            content    : codeBlockDialogHTML,
                            lockScreen : settings.dialogLockScreen,
                            maskStyle  : {
                                opacity         : settings.dialogMaskOpacity,
                                backgroundColor : settings.dialogMaskBgColor
                            },
                            buttons : {
                                enter  : [lang.buttons.enter, function() {
                                    var codeTexts  = this.find("textarea").val();
                                    var langName   = this.find("select").val();
                                    
                                    if (langName === "")
                                    {
                                        alert(lang.dialog.codeBlock.unselectedLanguageAlert);
                                        return false;
                                    }
                                    
                                    if (codeTexts === "")
                                    {
                                        alert(lang.dialog.codeBlock.codeEmptyAlert);
                                        return false;
                                    }
                                    
                                    langName = (langName === "other") ? "" : langName;
                                    
                                    cm.replaceSelection(["```" + langName, codeTexts, "```"].join("\n"));

                                    if (langName === "") {
                                        cm.setCursor(cursor.line, cursor.ch + 3);
                                    }
                                   
                                    this.hide().lockScreen(false).hideMask();
                                    
                                    return false;
                                }],
                                cancel : [lang.buttons.cancel, function() {                                   
                                    this.hide().lockScreen(false).hideMask();
                                    
                                    return false;
                                }]
                            }
                        });
                        
                        var langSelect = codeBlockDialog.find("select");
                        
                        for (var key in editormd.codeLanguages)
                        {
                            var codeLang = editormd.codeLanguages[key];
                            langSelect.append("<option value=\"" + key + "\">" + codeLang + "</option>");
                        }
                        
                        langSelect.append("<option value=\"other\">" + lang.dialog.codeBlock.otherLanguage + "</option>");
                    }
                },

                datetime : function(cm) {
                    var selection = cm.getSelection();
                    var date      = new Date();
                    var langName  = settings.lang.name;
                    var datefmt   = editormd.dateFormat() + " " + editormd.dateFormat((langName === "zh-cn" || langName === "zh-tw") ? "cn-week-day" : "week-day");
                    
                    cm.replaceSelection(datefmt);
                },

                watch : function(cm) {          
                    _this[_this.settings.watch ? "unwatch" : "watch"]();
                },

                preview : function(cm) {

                    _this.previewing();
                },

                fullscreen : function(cm) {

                    _this.fullscreen();
                },

                clear : function(cm) {
                    _this.clear();
                },

                info : function(cm) {
                    _this.showInfoDialog();
                }
            };
            
            return (name && typeof toolbarIconHandlers[name] !== "undefined") ? toolbarHandlers[name] : toolbarHandlers;
        },
        
        /**
         * 工具栏图标事件处理器
         * @returns {editormd}  返回editormd的实例对象
         */
        
        setToolbarHandler : function() {
            var _this               = this;
            var settings            = this.settings;
            
            if (!settings.toolbar || settings.readOnly) {
                return ;
            }
            
            var editor              = this.editor;
            var preview             = this.preview;
            var toolbar             = this.toolbar;
            var codeEditor          = this.codeEditor;
            var codeMirror          = this.codeMirror;
            var classPrefix         = this.classPrefix;
            var previewContainer    = this.previewContainer;            
            var toolbarIcons        = this.toolbarIcons = toolbar.find("." + classPrefix + "menu a");   
                
            toolbarIcons.bind(editormd.mouseOrTouch("click", "touchend"), function(event) {

                var icon                = $(this).children(".fa");
                var name                = icon.attr("name");
                var cursor              = codeEditor.getCursor();
                var selection           = codeEditor.getSelection();    
                var toolbarIconHandlers = _this.getToolbarHandles();

                if (name === "") {
                    return ;
                }
                
                _this.activeIcon = icon;

                if (typeof toolbarIconHandlers[name] !== "undefined") 
                {
                    toolbarIconHandlers[name](codeEditor);
                }
                else 
                {
                    if (typeof settings.toolbarHandlers[name] !== "undefined") 
                    {
                        $.proxy(settings.toolbarHandlers[name], _this)(codeEditor, icon, cursor, selection);
                    }
                }
                
                if (name !== "link" && name !== "anchor" && name !== "image" && name !== "code-block" && name !== "code-block-tab" && name !== "watch" && name !== "preview" && name !== "fullscreen" && name !== "info") 
                {
                    codeEditor.focus();
                }

                return false;

            });

            return this;
        },
        
        /**
         * 动态创建对话框
         * @param   {Object} options  配置项键值对 Key/Value
         * @returns {dialog}          返回创建的dialog的jQuery实例对象
         */
        
        createDialog : function(options) {
            var defaults = {
                name : "",
                width : 420,
                height: 240,
                title : "",
                drag  : true,
                closed : true,
                content : "",
                mask : true,
                maskStyle : {
                    backgroundColor : "#fff",
                    opacity : 0.1
                },
                lockScreen : true,
                footer : true,
                buttons : false
            };

            options          = $.extend(true, defaults, options);

            var editor       = this.editor;
            var classPrefix  = this.classPrefix;
            var guid         = (new Date).getTime();
            var dialogName   = ( (options.name === "") ? classPrefix + "dialog-" + guid : options.name);
            var mouseOrTouch = editormd.mouseOrTouch;
            
            var html         = "<div class=\"" + classPrefix + "dialog " + dialogName + "\">";

            if (options.title !== "")
            {
                html += "<div class=\"" + classPrefix + "dialog-header\"" + ( (options.drag) ? " style=\"cursor: move;\"" : "" ) + ">";
                html += "<strong class=\"" + classPrefix + "dialog-title\">" + options.title + "</strong>";
                html += "</div>";
            }

            if (options.closed)
            {
                html += "<a href=\"javascript:;\" class=\"fa fa-close " + classPrefix + "dialog-close\"></a>";
            }

            html += "<div class=\"" + classPrefix + "dialog-container\">" + options.content;                    

            if (options.footer || typeof options.footer === "string") 
            {
                html += "<div class=\"" + classPrefix + "dialog-footer\">" + ( (typeof options.footer === "boolean") ? "" : options.footer) + "</div>";
            }

            html += "</div>";

            html += "<div class=\"" + classPrefix + "dialog-mask " + classPrefix + "dialog-mask-bg\"></div>";
            html += "<div class=\"" + classPrefix + "dialog-mask " + classPrefix + "dialog-mask-con\"></div>";
            html += "</div>";

            editor.append(html);

            var dialog = editor.find("." + dialogName);
            
            dialog.lockScreen = function(lock) {
                if (options.lockScreen)
                {                
                    $("html,body").css("overflow", (lock) ? "hidden" : "");
                }
                
                return dialog;
            };

            dialog.showMask = function() {
                if (options.mask)
                {
                    editor.find("." + classPrefix + "mask").css(options.maskStyle).css("z-index", editormd.dialogZindex - 1).show();
                }
                return dialog;
            };

            dialog.hideMask = function() {                        
                if (options.mask)
                {
                    editor.find("." + classPrefix + "mask").hide();
                }
                
                return dialog;
            };

            dialog.loading = function(show) {                        
                var loading = dialog.find("." + classPrefix + "dialog-mask");
                loading[(show) ? "show" : "hide"]();
                
                return dialog;
            };
            
            dialog.lockScreen(true).showMask();

            dialog.show().css({
                zIndex : editormd.dialogZindex,
                border : (editormd.isIE8) ? "1px solid #ddd" : "",
                width  : (typeof options.width  === "number") ? options.width + "px"  : options.width,
                height : (typeof options.height === "number") ? options.height + "px" : options.height
            });

            var dialogPosition = function(){
                dialog.css({
                    top    : ($(window).height() - dialog.height()) / 2 + "px",
                    left   : ($(window).width() - dialog.width()) / 2 + "px"
                });
            };

            dialogPosition();

            $(window).resize(dialogPosition);

            dialog.children("." + classPrefix + "dialog-close").bind(mouseOrTouch("click", "touchend"), function() {
                dialog.hide().lockScreen(false).hideMask();
            });

            if (typeof options.buttons == "object")
            {
                var footer = dialog.footer = dialog.find("." + classPrefix + "dialog-footer");

                for (var key in options.buttons)
                {
                    var btn = options.buttons[key];
                    var btnClassName = classPrefix + key + "-btn";

                    footer.append("<button class=\"" + classPrefix + "btn " + btnClassName + "\">" + btn[0] + "</button>");
                    btn[1] = $.proxy(btn[1], dialog);
                    footer.children("." + btnClassName).bind(mouseOrTouch("click", "touchend"), btn[1]);
                }
            }

            if (options.title !== "" && options.drag)
            {                        
                var posX, posY;
                var dialogHeader = dialog.children("." + classPrefix + "dialog-header");

                if (!options.mask) {
                    dialogHeader.bind(mouseOrTouch("click", "touchend"), function(){
                        editormd.dialogZindex += 2;
                        dialog.css("z-index", editormd.dialogZindex);
                    });
                }

                dialogHeader.mousedown(function(e) {
                    e = e || window.event;  //IE
                    posX = e.clientX - parseInt(dialog[0].style.left);
                    posY = e.clientY - parseInt(dialog[0].style.top);

                    document.onmousemove = moveAction;                   
                });

                var userCanSelect = function (obj) {
                    obj.removeClass(classPrefix + "user-unselect").off("selectstart");
                }

                var userUnselect = function (obj) {
                    obj.addClass(classPrefix + "user-unselect").on("selectstart", function(event) { // selectstart for IE                        
                        return false;
                    });
                }

                var moveAction = function (e) {
                    e = e || window.event;  //IE

                    var left, top, nowLeft = parseInt(dialog[0].style.left), nowTop = parseInt(dialog[0].style.top);

                    if( nowLeft >= 0 ) {
                        if( nowLeft + dialog.width() <= $(window).width()) {
                            left = e.clientX - posX;
                        } else {	
                            left = $(window).width() - dialog.width();
                            document.onmousemove = null;
                        }
                    } else {
                        left = 0;
                        document.onmousemove = null;
                    }

                    if( nowTop >= 0 ) {
                        top = e.clientY - posY;
                    } else {
                        top = 0;
                        document.onmousemove = null;
                    }

                    
                    document.onselectstart = function() {
                        return false;
                    };
                    
                    userUnselect($("body"));
                    userUnselect(dialog);
                    dialog[0].style.left = left + "px";
                    dialog[0].style.top  = top + "px";
                }

                document.onmouseup = function() {                            
                    userCanSelect($("body"));
                    userCanSelect(dialog);
                    
                    document.onselectstart = null;         
                    document.onmousemove = null;
                };

                dialogHeader.touchDraggable = function() {
                    var offset = null;
                    var start  = function(e) {
                        var orig = e.originalEvent; 
                        var pos  = $(this).parent().position();

                        offset = {
                            x : orig.changedTouches[0].pageX - pos.left,
                            y : orig.changedTouches[0].pageY - pos.top
                        };
                    };

                    var move = function(e) {
                        e.preventDefault();
                        var orig = e.originalEvent;

                        $(this).parent().css({
                            top  : orig.changedTouches[0].pageY - offset.y,
                            left : orig.changedTouches[0].pageX - offset.x
                        });
                    };

                    this.bind("touchstart", start).bind("touchmove", move);
                };

                dialogHeader.touchDraggable();
            }

            editormd.dialogZindex += 2;

            return dialog;
        },
        
        /**
         * 创建关于Editor.md的对话框
         * @returns {editormd}  返回editormd的实例对象
         */
        
        createInfoDialog : function() {
            var _this        = this;
			var editor       = this.editor;
            var classPrefix  = this.classPrefix;  
            
            var infoDialogHTML = [
                "<div class=\"" + classPrefix + "dialog " + classPrefix + "dialog-info\" style=\"\">",
                "<div class=\"" + classPrefix + "dialog-container\">",
                "<h1><i class=\"editormd-logo editormd-logo-lg editormd-logo-color\"></i> " + editormd.title + "<small>v" + editormd.version + "</small></h1>",
                "<p>" + this.lang.description + "</p>",
                "<p>Home page: <a href=\"" + editormd.homePage + "\" traget=\"_blank\">" + editormd.homePage + "</a></p>",
                "<p>License: MIT</p>",
                "</div>",
                "<a href=\"javascript:;\" class=\"fa fa-close " + classPrefix + "dialog-close\"></a>",
                "</div>"
            ].join("\n");

            editor.append(infoDialogHTML);
            
            var infoDialog  = this.infoDialog = editor.find("." + classPrefix + "dialog-info");

            infoDialog.find("." + classPrefix + "dialog-close").bind(editormd.mouseOrTouch("click", "touchend"), function() {
                _this.hideInfoDialog();
            });
            
            infoDialog.css("border", (editormd.isIE8) ? "1px solid #ddd" : "").show();
            
            this.infoDialogPosition();

            return this;
        },
        
        /**
         * 关于Editor.md对话居中定位
         * @returns {editormd}  返回editormd的实例对象
         */
        
        infoDialogPosition : function() {
            var infoDialog = this.infoDialog;
            
			var _infoDialogPosition = function() {
				infoDialog.css({
					top  : ($(window).height() - infoDialog.height()) / 2 + "px",
					left : ($(window).width()  - infoDialog.width()) / 2  + "px"
				});
			};

			_infoDialogPosition();

			$(window).resize(_infoDialogPosition);
            
            return this;
        },
        
        /**
         * 显示关于Editor.md
         * @returns {editormd}  返回editormd的实例对象
         */
        
        showInfoDialog : function() {

            $("html,body").css("overflow-x", "hidden");
            
            var _this       = this;
			var editor      = this.editor;
            var classPrefix = this.classPrefix;            
			var infoDialog  = this.infoDialog = editor.find("." + classPrefix + "dialog-info");
            
            if (infoDialog.length < 1)
            {
                this.createInfoDialog();
            }

			infoDialog.show();

			this.infoDialogPosition();

            return this;
        },
        
        /**
         * 隐藏关于Editor.md
         * @returns {editormd}  返回editormd的实例对象
         */
        
        hideInfoDialog : function() {
            $("html,body").css("overflow-x", "");
            this.infoDialog.hide();

            return this;
        },
        
        /**
         * 配置和初始化marked组件
         * @returns {editormd}  返回editormd的实例对象
         */
        
        setMarked : function() {
            var marked       = editormd.$marked; 
            var markdownToC  = this.markdownToC = [];
            
            marked.setOptions({
                renderer    : editormd.markedRenderer(markdownToC),
                gfm         : true,
                tables      : true,
                breaks      : true,
                pedantic    : false,
                sanitize    : (this.settings.htmlDecode) ? false : true,  // 关闭忽略HTML标签，即开启识别HTML标签，默认为false
                smartLists  : true,
                smartypants : true
            });

            return this;
        },
        
        /**
         * 编辑器界面重建，用于动态语言包或模块加载等
         * @returns {editormd}  返回editormd的实例对象
         */
        
        recreateEditor : function() {
            var _this            = this;
            var editor           = this.editor;
            var settings         = this.settings;
            var toolbarIcons     = settings.toolbarIcons();            
            
            if (typeof this.infoDialog !== "undefined") {
                this.infoDialog.remove();
            }
            
            if (typeof toolbarIcons["info"] !== "undefined") {
                createInfoDialog();
            }

            if (!settings.readOnly) 
            {                
                if (editor.find(".editormd-dialog").length > 0) {
                    editor.find(".editormd-dialog").remove();
                }
                
                this.getToolbarHandles();
                this.setToolbar();
            }
            
            this.resize();

            return this;
        },
        
        /**
         * 高亮预览HTML的pre代码部分
         * @returns {editormd}             返回editormd的实例对象
         */
        
        previewCodeHighlight : function() {    
            var settings         = this.settings;
            var previewContainer = this.previewContainer;
            
            if (settings.previewCodeHighlight) 
            {
                previewContainer.find("pre").addClass("prettyprint linenums");
                prettyPrint();
            }

            return this;
        },
        
        /**
         * 解析TeX(KaTeX)科学公式
         * @returns {editormd}             返回editormd的实例对象
         */
        
        katexRender : function() {
            
            var previewContainer = this.previewContainer;
            
            previewContainer.find("." + editormd.classNames.tex).each(function(){
                var tex  = $(this);
                editormd.$katex.render(tex.html(), tex[0]);
            });   

            return this;
        },
        
        /**
         * 解析和渲染流程图及时序图
         * @returns {editormd}             返回editormd的实例对象
         */
        
        flowChartAndSequenceDiagramRender : function() {
            
            var settings         = this.settings;
            var previewContainer = this.previewContainer;
            
            if (editormd.isIE8) return ;

            if (settings.flowChart) {
                previewContainer.find(".flowchart").flowChart(); 
            }

            if (settings.sequenceDiagram) {
                previewContainer.find(".sequence-diagram").sequenceDiagram({theme: "simple"});
            }

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
            var settings         = this.settings;
            var codeEditor       = this.codeEditor;
            var codeMirror       = this.codeMirror;
            var previewContainer = this.previewContainer;
            var mouseOrTouch     = editormd.mouseOrTouch;
            
            editor.find("." + this.classPrefix  + "container-mask").hide();
            
            this.saveToTextareas();
            
            if(settings.watch) {
                preview.show();
            }
            
            editor.data("oldWidth", editor.width()).data("oldHeight", editor.height()); // 为了兼容Zepto
            
            this.resize();
            
            $(window).resize(function(){
                _this.resize();
            });
            
            $.proxy(settings.onload, this)();
                
            var codeEditorBindScroll = function() {    
                codeMirror.find(".CodeMirror-scroll").bind(mouseOrTouch("scroll", "touchmove"), function() {
                    var height    = $(this).height();
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
                    var height    = $(this).height();
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

			codeMirror.bind({
				mouseover  : codeEditorBindScroll,
				mouseout   : codeEditorUnbindScroll,
				touchstart : codeEditorBindScroll,
				touchend   : codeEditorUnbindScroll
			});
            
			preview.bind({
				mouseover  : previewBindScroll,
				mouseout   : previewUnbindScroll,
				touchstart : previewBindScroll,
				touchend   : previewUnbindScroll
			});

            codeEditor.on("change", function(cm, changeObj) {                 
                _this.saveToTextareas();
            });

            return this;
        },
        
        /**
         * 设置编辑器的宽度
         * @param   {Number|String} width  编辑器宽度值
         * @returns {editormd}             返回editormd的实例对象
         */
        
        width : function(width) {
                
            this.editor.css("width", (typeof width === "number") ? width  + "px" : width);            
            this.resize();
            
            return this;
        },
        
        /**
         * 设置编辑器的高度
         * @param   {Number|String} height  编辑器高度值
         * @returns {editormd}              返回editormd的实例对象
         */
        
        height : function(height) {
                
            this.editor.css("height", (typeof height === "number")  ? height  + "px" : height);            
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
            var codeEditor       = this.codeEditor;
            var codeMirror       = this.codeMirror;
            
            if(width && height) 
            {                
                editor.css({
                    width  : (typeof width  === "number") ? width  + "px" : width,
                    height : (typeof height === "number") ? height + "px" : height
                });
            }
                        
            if (settings.toolbar && !settings.readOnly) {
                codeMirror.css("margin-top", toolbar.height() + 1).height(editor.height() - toolbar.height());
            } else {
                codeMirror.css("margin-top", 0).height(editor.height());
            }
            
            codeMirror.find(".CodeMirror-gutters").height(codeMirror.height());
            
            if(settings.watch) 
            {
                codeMirror.width(editor.width() / 2);
                preview.width((!this.state.preview) ? editor.width() / 2 : editor.width());
                
                if (settings.toolbar && !settings.readOnly) {
                    preview.css("top", toolbar.height()).height(editor.height() - toolbar.height());
                } else {
                    preview.css("top", 0).height(editor.height());
                }
            } 
            else 
            {
                codeMirror.width(editor.width());
                preview.hide();
            }

            return this;
        },
        
        /**
         * 分别将Markdown源码和解析的HTML源码保存到对应的textarea
         * @returns {editormd}                    返回editormd的实例对象
         */
        
        saveToTextareas : function() {
            var _this            = this;
            var settings         = this.settings;
            var codeEditor       = this.codeEditor;
            var previewContainer = this.previewContainer;
            
            var codeMirrorValue  = codeEditor.getValue();
            var markdownToC      = this.markdownToC   = [];
            var newMarkdownDoc   = editormd.$marked(codeMirrorValue, {renderer : editormd.markedRenderer(markdownToC)});
            
            this.markdownTextarea[0].innerText = codeMirrorValue;
            
            codeEditor.save();
            
            if (settings.saveHTMLToTextarea) {
                this.htmlTextarea.html(newMarkdownDoc);
            }
            
            if(settings.watch || (!settings.watch && this.state.preview))
            {
                previewContainer.html(newMarkdownDoc);

                this.previewCodeHighlight();
            
                if (settings.toc) {
                    editormd.markdownToCRenderer(markdownToC, previewContainer, settings.tocStartLevel);
                }

                if (!settings.inRequirejs && !editormd.kaTeXLoaded) {
                    editormd.loadKaTeX(function(){
                        editormd.$katex = katex;
                        editormd.kaTeXLoaded = true;
                        _this.katexRender();
                    });
                } else {
                    this.katexRender();
                }
                
                var timer = setTimeout(function(){
                    clearTimeout(timer);
                    _this.flowChartAndSequenceDiagramRender();
                }, 10);

                $.proxy(settings.onchange, this)();
            }

            return this;
        },
        
        /**
         * 聚焦光标位置
         * @returns {editormd}         返回editormd的实例对象
         */
        
        focus : function() {
            this.codeEditor.focus();

            return this;
        },
        
        /**
         * 设置光标的位置
         * @param   {Object}    cursor 要设置的光标位置键值对象，例：{line:1, ch:0}
         * @returns {editormd}         返回editormd的实例对象
         */
        
        setCursor : function(cursor) {
            this.codeEditor.setCursor(cursor);

            return this;
        },
        
        /**
         * 获取当前光标的位置
         * @returns {Cursor}         返回一个光标Cursor对象
         */
        
        getCursor : function() {
            return this.codeEditor.getCursor();
        },
        
        /**
         * 设置光标选中的范围
         * @param   {Object}    from   开始位置的光标键值对象，例：{line:1, ch:0}
         * @param   {Object}    to     结束位置的光标键值对象，例：{line:1, ch:0}
         * @returns {editormd}         返回editormd的实例对象
         */
        
        setSelection : function(from, to) {
        
            this.codeEditor.setSelection(from, to);
        
            return this;
        },
        
        /**
         * 获取光标选中的文本
         * @returns {String}         返回选中文本的字符串形式
         */
        
        getSelection : function() {
            return this.codeEditor.getSelection();
        },
        
        /**
         * 替换当前光标选中的文本或在当前光标处插入新字符
         * @param   {String}    value  要插入的字符值
         * @returns {editormd}         返回editormd的实例对象
         */
        
        replaceSelection : function(value) {
            this.codeEditor.replaceSelection(value);

            return this;
        },
        
        /**
         * 在当前光标处插入新字符
         *
         * 同replaceSelection()方法
         * @param   {String}    value  要插入的字符值
         * @returns {editormd}         返回editormd的实例对象
         */
        
        insertValue : function(value) {
            this.replaceSelection(value);

            return this;
        },
        
        /**
         * 设置和传入编辑器的markdown源文档
         * @param   {String}    md     要传入的markdown源文档
         * @returns {editormd}         返回editormd的实例对象
         */
        
        setMarkdown : function(md) {
            var settings = this.settings;
            
            this.codeEditor.setValue(md);
            
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
         * 清空编辑器
         * @returns {editormd}         返回editormd的实例对象
         */
        
        clear : function() {
            this.codeEditor.setValue("");
            
            return this;            
        },
        
        /**
         * 获取解析后存放在Textarea的HTML源码
         * @returns {String}               返回HTML源码
         */
        
        getHTML : function() {
            if (!this.settings.saveHTMLToTextarea)
            {
                alert("Error: settings.saveHTMLToTextarea == false");

                return false;
            }
            
            return this.htmlTextarea.html();
        },
        
        /**
         * getHTML()的别名
         * @returns {editormd}         返回HTML源码
         */
        
        getTextareaSavedHTML : function() {
            return this.getHTML();
        },
        
        /**
         * 获取预览窗口的HTML源码
         * @returns {editormd}         返回editormd的实例对象
         */
        
        getPreviewedHTML : function() {
            if (!this.settings.watch)
            {
                alert("Error: settings.watch == false");

                return false;
            }
            
            return this.previewContainer.html();
        },
        
        /**
         * 开启实时预览
         * @returns {editormd}         返回editormd的实例对象
         */
        
        watch : function(callback) {
            callback  = callback || function() {};
            
            this.settings.watch = true;
            this.preview.show();
            
            var watchIcon   = this.settings.toolbarIconsClass.watch;
            var unWatchIcon = this.settings.toolbarIconsClass.unwatch;
            var icon        = this.toolbar.find(".fa[name=watch]");
            icon.parent().attr("title", this.settings.lang.toolbar.watch);
            icon.removeClass(unWatchIcon).addClass(watchIcon);
            
            this.codeMirror.css("border-right", "1px solid #ddd").width(this.editor.width() / 2); 
            
            this.saveToTextareas().resize();
            
            $.proxy(callback, this)();
            
            return this;
        },
        
        /**
         * 关闭实时预览
         * @returns {editormd}         返回editormd的实例对象
         */
        
        unwatch : function(callback) {
            callback  = callback || function() {};
            
            this.settings.watch = false;
            this.preview.hide();
            
            var watchIcon   = this.settings.toolbarIconsClass.watch;
            var unWatchIcon = this.settings.toolbarIconsClass.unwatch;
            
            var icon        = this.toolbar.find(".fa[name=watch]");
            icon.parent().attr("title", this.settings.lang.toolbar.unwatch);
            icon.removeClass(watchIcon).addClass(unWatchIcon);
            
            this.codeMirror.css("border-right", "none").width(this.editor.width());
            
            this.resize();
            
            $.proxy(callback, this)();
            
            return this;
        },
        
        /**
         * 显示编辑器
         * @param   {Function} [callback=function()] 回调函数
         * @returns {editormd}                       返回editormd的实例对象
         */
        show : function(callback) {
            callback  = callback || function() {};
            
            var _this = this;
            this.editor.show(function(){
                $.proxy(callback, _this)();
            });
            
            return this;
        },
        
        /**
         * 隐藏编辑器
         * @param   {Function} [callback=function()] 回调函数
         * @returns {editormd}                       返回editormd的实例对象
         */
        
        hide : function(callback) {
            callback  = callback || function() {};
            
            var _this = this;
            this.editor.hide(function(){
                $.proxy(callback, _this)();
            });
            
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
                toolbar.find(".fa[name=preview]").toggleClass("active");
            }
            
            codeMirror.toggle();

            if(codeMirror.css("display") === "none") // 为了兼容Zepto，而不使用codeMirror.is(":hidden")
            {
                this.state.preview = true;

                if(this.state.fullscreen) {
                    preview.css("background", "#fff");
                }
                
                editor.find("." + this.classPrefix + "preview-close-btn").show().bind(editormd.mouseOrTouch("click", "touchend"), function(){
                    _this.previewed();
                });
            
                if(!settings.watch)
                {
                    /*var codeEditor       = this.codeEditor;
                    var previewContainer = this.previewContainer;

                    codeEditor.save();

                    var markdownToC      = this.markdownToC   = [];
                    var newMarkdownDoc   = editormd.$marked(codeEditor.getValue(), {renderer : editormd.markedRenderer(markdownToC)});
                    previewContainer.html(newMarkdownDoc);

                    if (settings.toc) {
                        editormd.markdownToCRenderer(markdownToC, previewContainer, settings.tocStartLevel);
                    }*/
                    this.saveToTextareas();
                }

                preview.show().css({
                    position  : "static",
                    top       : 0,
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
            var previewCloseBtn  = editor.find("." + this.classPrefix + "preview-close-btn");

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
            
            previewCloseBtn.hide().bind(editormd.mouseOrTouch("click", "touchend"));
            
            preview.css({ 
                background : null,
                position   : "absolute",
                width      : editor.width() / 2,
                height     : editor.height() - toolbar.height(),
                top        : (settings.toolbar) ? toolbar.height() : 0
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

                this.resize();
    
                $.proxy(this.settings.onfullscreen, this)();            
            }
            else
            {                
                this.fullscreenExit();             
            }

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

            $("html,body").css("overflow", "");

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

            
            $.proxy(this.settings.onfullscreenExit, this)();

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
        var marked             = editormd.$marked;
        var markedRenderer     = new marked.Renderer();
        markdownToC            = markdownToC || [];
        
        markedRenderer.heading = function(text, level, raw) {
            var escapedText    = text.toLowerCase().replace(/[^\w]+/g, "-");
            var toc = {
                text : text,
                level : level,
                slug  : escapedText
            };
            
            var isChinese = /^[\u4e00-\u9fa5]+$/.test(text);
            var id = (isChinese) ? escape(text).replace(/\%/g, "") : text.toLowerCase().replace(/[^\w]+/g, "-");

            markdownToC.push(toc);

            return "<h" + level + " id=\"h"+ level + "-" + this.options.headerPrefix + id +"\">" +
                   "<a href=\"#" + text + "\" name=\"" + text + "\" class=\"anchor\"></a>" +
                   "<span class=\"header-link\"></span>" + text + "</h" + level + ">";
        };

        markedRenderer.paragraph = function(text) {
            var isTeXInline     = /\$\$(.*)\$\$/g.test(text);
            var isTeXLine       = /^\$\$(.*)\$\$$/.test(text);
            var isTeXAddClass   = (isTeXLine) ? " class=\"" + editormd.classNames.tex + "\"" : "";
            var isToC           = /^\[TOC\]$/.test(text);
            
            if (!isTeXLine && isTeXInline) 
            {
                text = text.replace(/(\$\$([^\$]*)\$\$)+/g, function($1, $2) {
                    return "<span class=\"" + editormd.classNames.tex + "\">" + $2.replace(/\$/g, "") + "</span>";
                });
            } 
            else 
            {
                text = (isTeXLine) ? text.replace(/\$/g, "") : text;
            }
            
            return (isToC) ? "<div class=\"markdown-toc\"><ul class=\"markdown-toc-list\">" + text + "</ul></div>" 
                           : "<p" + isTeXAddClass + ">" + text + "</p>\n";
        };

        markedRenderer.code = function (code, lang, escaped) { 

            if (lang === "seq" || lang === "sequence")
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
     * 生成TOC(Table of Contents)
     * @param   {Array}    toc             从marked获取的TOC数组列表
     * @param   {Element}  container       插入TOC的容器元素
     * @param   {Integer}  startLevel      Hx 起始层级
     * @returns {Object}   tocContainer    返回ToC列表容器层的jQuery对象元素
     */
    
    editormd.markdownToCRenderer = function(toc, container, startLevel) {
        
        var html       = "";    
        var lastLevel  = 0;
        startLevel     = startLevel || 1;
        
        for (var i = 0, len = toc.length; i < len; i++) 
        {
            var text  = toc[i].text;
            var level = toc[i].level;
            
            if (level < startLevel) {
                continue;
            }
            
            if (level > lastLevel) 
            {
                html += "";
            }
            else if (level < lastLevel) 
            {
                html += (new Array(lastLevel - level + 2)).join("</ul></li>");
            } 
            else 
            {
                html += "</ul></li>";
            }

            html += "<li><a class=\"toc-level-" + level + "\" href=\"#" + text + "\" level=\"" + level + "\">" + text + "</a><ul>";
            lastLevel = level;
        }
        
        var tocContainer = container.find('.markdown-toc');
        
        tocContainer.children('.markdown-toc-list').html("").html(html);
        
        return tocContainer;
    };
    
    /**
     * 将Markdown文档解析为HTML用于前台显示
     * @param   {String}   id            用于显示HTML的对象ID
     * @param   {Object}   [options={}]  配置选项，可选
     * @returns {Object}   div           返回jQuery对象元素
     */
    
    editormd.markdownToHTML = function(id, options) {
        options      = options || {};
        
        var defaults = {
            toc                  : true,
            tocStartLevel        : 2,
            markdown             : "",
            htmlDecode           : false,
            inRequirejs          : false,
            tex                  : false,
            flowChart            : false,
            sequenceDiagram      : false,
            previewCodeHighlight : true
        };
        
        editormd.$marked = marked;

        var div           = $("#" + id);
        var settings      = div.settings = $.extend(true, defaults, options);
        var saveTo        = div.find("textarea");
        var markdownDoc   = (settings.markdown === "") ? saveTo.val() : settings.markdown; 
        var markdownToC   = [];

        var markedOptions = {
            renderer    : editormd.markedRenderer(markdownToC),
            gfm         : true,
            tables      : true,
            breaks      : true,
            pedantic    : false,
            sanitize    : (settings.htmlDecode) ? false : true, // 是否忽略HTML标签，即是否开启HTML标签解析，为了安全性，默认不开启
            smartLists  : true,
            smartypants : true
        };
        
        var markdownParsed   = marked(markdownDoc, markedOptions);
        
        if (editormd.isIE8) 
        {
            saveTo.val(markdownDoc);
        }
        else 
        {
            saveTo.html(markdownDoc);
        }
        
        div.addClass("markdown-body " + this.classPrefix + "html-preview").append(markdownParsed);
         
        if (settings.toc) {
            div.tocContainer = this.markdownToCRenderer(markdownToC, div, settings.tocStartLevel);
        }
            
        if (settings.previewCodeHighlight) 
        {
            div.find("pre").addClass("prettyprint linenums");
            prettyPrint();
        }
        
        if (!editormd.isIE8) 
        {
            if (settings.flowChart) {
                div.find(".flowchart").flowChart(); 
            }

            if (settings.sequenceDiagram) {
                div.find(".sequence-diagram").sequenceDiagram({theme: "simple"});
            }
        }

        if (settings.tex)
        {
            var katexHandle = function() {
                div.find("." + editormd.classNames.tex).each(function(){
                    var tex  = $(this);
                    editormd.$katex.render(tex.html(), tex[0]);
                });
            };
            
            if (!settings.inRequirejs) {
                this.loadKaTeX(function(){
                    editormd.$katex = katex;
                    katexHandle();
                });
            } else {
                katexHandle();
            }
        }
        
        div.getMarkdown = function() {
            return (editormd.isIE8) ? saveTo.val() : saveTo.html();
        };
        
        return div;
    };
    
    // for CodeBlock dialog select
    editormd.codeLanguages = {
        asp           : "ASP",
        actionscript  : "ActionScript(3.0)/Flash/Flex",
        bash          : "Bash/Bat",
        css           : "CSS",
        c             : "C",
        cpp           : "C++",
        csharp        : "C#",
        coffeescript  : "CoffeeScript",
        d             : "D",
        dart          : "Dart",
        delphi        : "Delphi/Pascal",
        erlang        : "Erlang",
        go            : "Golang",
        groovy        : "Groovy",
        html          : "HTML",
        java          : "Java",
        json          : "JSON",
        javascript    : "Javascript",
        lua           : "Lua",
        less          : "LESS",
        markdown      : "Markdown",
        "objective-c" : "Objective-C",
        php           : "PHP",
        perl          : "Perl",
        python        : "Python",
        r             : "R",
        rst           : "reStructedText",
        ruby          : "Ruby",
        sql           : "SQL",
        sass          : "SASS/SCSS",
        shell         : "Shell",
        scala         : "Scala",
        swift         : "Swift",
        vb            : "VB/VBScript",
        xml           : "XML",
        yaml          : "YAML"
    };

    // for Requires.js and Gulpfile.js
    editormd.codeMirrorModules = {
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
            "jade"
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
    
    /**
     * 用于支持Require.js加载的方法，注入
     * @param {Function} CodeMirror  CodeMirror对象
     * @param {Function} marked      marked对象
     * @param {Function} prettyPrint prettyPrint函数
     */
    
    editormd.requirejsInit    = function(CodeMirror, marked, katex, prettyPrint) {
        editormd.$CodeMirror  = CodeMirror;
        editormd.$marked      = marked;
        editormd.$katex       = katex;
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
        
        modules.push(loadPath + "codemirror/codemirror.min");
        
        var codeMirrorModules = editormd.codeMirrorModules;
        
        for (var i = 0, len = codeMirrorModules.modes.length; i < len; i++) 
        {
            var modeName = codeMirrorModules.modes[i];
            modules.push(loadPath + "codemirror/mode/" + modeName + "/" + modeName);
        }   

        for (var i = 0, len = codeMirrorModules.addons.length; i < len; i++) 
        {
            var addonName = codeMirrorModules.addons[i];
            modules.push(loadPath + "codemirror/addon/" + addonName);
        }
        
        editormd.loadCSS(editormd.katexURL.css);

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
    
    editormd.isIE    = (navigator.appName == "Microsoft Internet Explorer");
    editormd.isIE8   = (editormd.isIE && navigator.appVersion.match(/8./i) == "8.");

    /**
     * 动态加载JS文件的方法
     * @param {String}   fileName              JS文件名
     * @param {Function} [callback=function()] 加载成功后执行的回调函数
     * @param {String}   [into="head"]         嵌入页面的位置
     */

    editormd.loadScript = function(fileName, callback, into) {
        
        into          = into     || "head";
        callback      = callback || function() {};
        
        var script    = null; 
        script        = document.createElement("script");
        script.id     = fileName.replace(/[\./]+/g, "-");
        script.type   = "text/javascript";        
        script.src    = fileName + ".js";
        
        if (editormd.isIE8) {
            
            script.onreadystatechange = function() {
                if(script.readyState) 
                {
                    if (script.readyState === "loaded" || script.readyState === "complete") 
                    {
                        script.onreadystatechange = null; 
                        callback();
                    }
                } 
            };
        }
        else
        {
            script.onload = function() {
                callback();
            };
        }

        if (into === "head") {
            document.getElementsByTagName("head")[0].appendChild(script);
        } else {
            document.body.appendChild(script);
        }
    };
    
    // 使用国外的CDN，加载速度有时会很慢，或者自定义URL
    editormd.katexURL  = {
        css : "//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.1.1/katex.min",
        js  : "//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.1.1/katex.min"
    };
    
    editormd.kaTeXLoaded = false;
    
    /**
     * 加载KaTex文件
     * @param {Function} [callback=function()]  加载成功后执行的回调函数
     */
    
    editormd.loadKaTeX = function (callback) {
        editormd.loadCSS(editormd.katexURL.css, function(){
            editormd.loadScript(editormd.katexURL.js, callback || function(){});
        });
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
                    var weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    datefmt = weekDays[weekDay];
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
        };

        return datefmt;
    };
    
    return editormd;
    
}));
