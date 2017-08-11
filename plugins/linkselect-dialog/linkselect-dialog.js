
/**
 *  资源引用插件
 *  在编辑区插入特定标签，从后台获取引用列表，可搜索，双击插入到光标区
 *  author:zarte
 *  date:2017.8.11
 * 此插件需在载入的editormd文件中修改executePlugin方法存入editormd对象
 */
(function() {

    var factory = function (exports) {

		var pluginName   = "linkselect-dialog";

		exports.fn.linkselectDialog = function() {


            var _this       = this;
            var cm          = this.cm;
            var lang        = this.lang;
            var editor      = this.editor;
            var settings    = this.settings;
            var cursor      = cm.getCursor();
            var selection   = cm.getSelection();
            var imageLang   = lang.dialog.image;
            var classPrefix = this.classPrefix;
            var iframeName  = classPrefix + "image-iframe";
			var dialogName  = classPrefix + pluginName, dialog;

			cm.focus();

            var loading = function(show) {
                var _loading = dialog.find("." + classPrefix + "dialog-mask");
                _loading[(show) ? "show" : "hide"]();
            };

            if (editor.find("." + dialogName).length < 1)
            {

                //此次调用存入的对象,marked用于解析
                var marked          = this.editormd.$marked;
                var markdownToC   = [];
                var rendererOptions = {
                    toc                  : this.settings.toc,
                    tocm                 : this.settings.tocm,
                    tocStartLevel        : this.settings.tocStartLevel,
                    taskList             : this.settings.taskList,
                    emoji                : this.settings.emoji,
                    tex                  : this.settings.tex,
                    pageBreak            : this.settings.pageBreak,
                    atLink               : this.settings.atLink,           // for @link
                    emailLink            : this.settings.emailLink,        // for mail address auto link
                    flowChart            : this.settings.flowChart,
                    sequenceDiagram      : this.settings.sequenceDiagram,
                    previewCodeHighlight : this.settings.previewCodeHighlight,
                };
                var markedOptions ={
                    renderer    : this.editormd.markedRenderer(markdownToC, rendererOptions),
                    gfm         : true,
                    tables      : true,
                    breaks      : true,
                    pedantic    : false,
                    sanitize    : (this.settings.htmlDecode) ? false : true,  // 关闭忽略HTML标签，即开启识别HTML标签，默认为false
                    smartLists  : true,
                    smartypants : true
                };
                marked.setOptions(markedOptions);

                var guid   = (new Date).getTime();

                //样式根据需求自行调整,插件图标未定义，在菜单栏末尾查看是否加载成功.
                var str = '';
                str += '';
                str += '';
                if(this.settings.linkSelectPreFlag){
                    str +='<div class="editormd-form"><input type="text" style="color: #999;padding: 8px;border: 1px solid #ddd;" class="solvelink-search"><button class=" solvelink-search-btn" style="margin-left:10px;    padding: 8px 10px;">搜索</button><div class="solvelink-list" style="display:inline-block;margin-top:10px;width: 50%;height: 300px;border: 1px solid #DDD;OVERFLOW-Y: auto; OVERFLOW-X:hidden;"></div><div id ="linkcontentpre" style="display:inline-block;width:50%;height: 300px;OVERFLOW-Y: auto;OVERFLOW-X: hidden;    border: 1px solid #dcdcdc;" class="markdown-body editormd-preview-container"></div></div>';

                }else{
                    str +='<div class="editormd-form"><input type="text" style="color: #999;padding: 8px;border: 1px solid #ddd;" class="solvelink-search"><button class=" solvelink-search-btn" style="margin-left:10px;    padding: 8px 10px;">搜索</button><div class="solvelink-list" style="display:inline-block;margin-top:10px;width: 100%;height: 300px;border: 1px solid #DDD;OVERFLOW-Y: auto; OVERFLOW-X:hidden;"></div></div>';

                }
                str +='';
                str +='';
                var dialogContent = ( str);

                //var imageFooterHTML = "<button class=\"" + classPrefix + "btn " + classPrefix + "image-manager-btn\" style=\"float:left;\">" + imageLang.managerButton + "</button>";

                dialog = this.createDialog({
                   // title      : imageLang.title,
                    title      : '添加引用',
                    width      :  _this.settings.linkSelectPreFlag ? 690 : 390 ,
                    height     : 470,
                    name       : dialogName,
                    content    : dialogContent,
                    mask       : settings.dialogShowMask,
                    drag       : settings.dialogDraggable,
                    lockScreen : settings.dialogLockScreen,
                    maskStyle  : {
                        opacity         : settings.dialogMaskOpacity,
                        backgroundColor : settings.dialogMaskBgColor
                    },
                    buttons : {
                        '确定':['确定', function() {
                            var id  = this.find(".linkitem.on").attr('data-id');
                            if (id)
                            {
                                cm.replaceSelection('<ZLK>'+id+'</ZLK>');
                            }
                            this.hide().lockScreen(false).hideMask();
                            return false;
                        }],

                        '取消':['取消', function() {
                            this.hide().lockScreen(false).hideMask();

                            return false;
                        }]
                    }
                });

                //事件绑定
                dialog.attr("id", classPrefix + "linkselect-dialog-" + guid);

				var fileInput  = dialog.find(".linkitem");

                $('body').on('dblclick ','.linkitem',function(){
                    cm.replaceSelection('<ZLK>'+$(this).attr('data-id')+'</ZLK>');
                    dialog.hide();
                    $("html,body").css("overflow", "");
                    editor.find("." + classPrefix + "mask").hide();
                });

                $('body').on('click ','.linkitem',function(){
                    $('.solvelink-list').find('.linkitem').removeClass('on');
                    $(this).addClass('on');
                    if(_this.settings.linkSelectPreFlag){
                        $.ajax({
                            url:'/test.php',
                            data:{
                                'id':$(this).attr('data-id')
                            },
                            dataType:'json',
                            type:'post',
                            success:function(data){
                                if(data.content){
                                    var newMarkdownDoc = _this.editormd.$marked(data.content, markedOptions);
                                    newMarkdownDoc = _this.editormd.filterHTMLTags(newMarkdownDoc, _this.settings.htmlDecode);
                                    $('#linkcontentpre').html(newMarkdownDoc);
                                    //console.log(newMarkdownDoc);
                                }

                            }
                        });
                    }
                });
                $('body').on('keydown','.solvelink-search',function(){
                    if(event.keyCode != "13") return ;
                    var name = $(this).val();
                    if(name){
                        $.ajax({
                            url:'/test.php',
                            data:{
                                'name':name
                            },
                            dataType:'json',
                            type:'post',
                            success:function(data){
                                str = '<ul>';
                                for(var i in data.list){
                                    str += '<li  class="linkitem" data-id ="'+data.list[i]["id"]+'">'+data.list[i]["id"]+'.'+data.list[i]["link_name"]+'</li>';
                                }
                                str += '<ul>';
                                $('.solvelink-list').html(str);
                            }
                        });
                    }
                    return false;
                });
                $('body').on('click','.solvelink-search-btn',function(){
                    var name = $('.solvelink-search').val();
                    if(name){
                        $.ajax({
                            url:'/test.php',
                            data:{
                                'name':name
                            },
                            dataType:'json',
                            type:'post',
                            success:function(data){
                                str = '<ul>';
                                for(var i in data.list){
                                    str += '<li  class="linkitem" data-id ="'+data.list[i]["id"]+'">'+data.list[i]["id"]+'.'+data.list[i]["link_name"]+'</li>';
                                }
                                str += '<ul>';
                                $('.solvelink-list').html(str);
                            }
                        });
                    }
                    return false;
                })


            //ajax
            $.ajax({
                url:'/test.php',
                dataType:'json',
                type:'post',
                success:function(data){
                    str = '<ul>';
                    for(var i in data.list){
                        str += '<li  class="linkitem" data-id ="'+data.list[i]["id"]+'">'+data.list[i]["id"]+'.'+data.list[i]["link_name"]+'</li>';
                    }
                    str += '<ul>';
                    $('.solvelink-list').html(str);
                }
            });

			dialog = editor.find("." + dialogName);
			dialog.find(".solvelink-search").val("");
            $('#linkcontentpre').html('');

			this.dialogShowMask(dialog);
			this.dialogLockScreen();
			dialog.show();

		};

	};

	// CommonJS/Node.js
	if (typeof require === "function" && typeof exports === "object" && typeof module === "object")
    {
        module.exports = factory;
    }
	else if (typeof define === "function")  // AMD/CMD/Sea.js
    {
		if (define.amd) { // for Require.js

			define(["editormd"], function(editormd) {
                factory(editormd);
            });

		} else { // for Sea.js
			define(function(require) {
                var editormd = require("./../../editormd");
                factory(editormd);
            });
		}
	}
	else
	{
        factory(window.editormd);
	}

})();
