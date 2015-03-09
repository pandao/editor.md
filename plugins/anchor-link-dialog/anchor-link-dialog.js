/*!
 * Anchor link dialog plugin for Editor.md
 *
 * @file        anchor-link-dialog.js
 * @author      pandao
 * @version     1.2.0
 * @updateTime  2015-03-07
 * {@link       https://github.com/pandao/editor.md}
 * @license     MIT
 */

(function() {

    var factory = function (exports) {

		var pluginName   = "anchor-link-dialog";

		exports.fn.anchorLinkDialog = function() {

            var _this       = this;
            var cm          = this.cm;
            var lang        = this.lang;
			var editor      = this.editor;
            var settings    = this.settings;
            var cursor      = cm.getCursor();
            var selection   = cm.getSelection();
            var anchorLang  = lang.dialog.anchor;
            var classPrefix = this.classPrefix;
			var dialogName  = classPrefix + pluginName, dialog;

			cm.focus();

            if (editor.find("." + dialogName).length > 0)
            {
                dialog = editor.find("." + dialogName);
                dialog.find("[data-name]").val("");
                dialog.find("[data-url]").val("http://");
                dialog.find("[data-title]").val(selection);

                this.dialogShowMask(dialog);
                this.dialogLockScreen();
                dialog.show();
            }
            else 
            {      
                var dialogHTML = "<div class=\"" + classPrefix + "form\">" +
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

                dialog = this.createDialog({   
                    name   : dialogName,
                    title  : anchorLang.title,
                    width  : 380,
                    height : 250,
                    content : dialogHTML,
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
