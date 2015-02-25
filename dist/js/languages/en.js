/*
 * Editor.md
 * @file        languages\en.js 
 * @version     v1.1.5 
 * @description A simple online markdown editor.
 * @license     MIT License
 * @author      Pandao
 * {@link       https://github.com/pandao/editor.md}
 * @updateTime  2015-02-26
 */

(function(){
    var factory = function (exports) {
        var lang = {
            name : "en",
            description : "A simple markdown doucment online editor.",
            toolbar : {
                undo             : "Undo(Ctrl+Z)",
                redo             : "Redo(Ctrl+Y)",
                bold             : "Bold",
                del              : "Strikethrough",
                italic           : "Italic",
                quote            : "Block quote",
                h1               : "Heading 1",
                h2               : "Heading 2",
                h3               : "Heading 3",
                h4               : "Heading 4",
                h5               : "Heading 5",
                h6               : "Heading 6",
                "list-ul"        : "Unordered list",
                "list-ol"        : "Ordered list",
                hr               : "Horizontal line",
                link             : "Link",
                anchor           : "Anchor",
                image            : "Image",
                code             : "Code inline",
                "code-block-tab" : "Preformatted text / Code block (Tab indent)",
                "code-block"     : "Code block (Multi-languages)",
                datetime         : "Datetime",
                watch            : "Unwatch",
                unwatch          : "Watch",
                preview          : "HTML Preview (Enter ESC exit)",
                fullscreen       : "Fullscreen (Enter ESC exit)",
                clear            : "Clear",
                info             : "About " + exports.title
            },
            buttons : {
                enter  : "Enter",
                cancel : "Cancel"
            },
            dialog : {
                link : {
                    title    : "Link",
                    url      : "Address",
                    urlTitle : "Title",
                    urlEmpty : "Error: Please fill in the link address.",
                    titleEmpty : "Error: Please fill in the link title."
                },
                anchor : {
                    title    : "Anchor link",
                    name     : "Name",
                    url      : "Address",
                    urlTitle : "Title",
                    nameEmpty: "Error: anchor name can't be empty.",
                    titleEmpty : "Error: Please fill in anchor link title.",
                    urlEmpty : "Error: Please fill in anchor link."
                },
                image : {
                    title    : "Image",
                    url      : "Address",
                    link     : "Link",
                    alt      : "Title",
                    uploadButton     : "Upload",
                    imageURLEmpty    : "Error: picture url address can't be empty.",
                    uploadFileEmpty  : "Error: upload pictures cannot be empty!",
                    formatNotAllowed : "Error: only allows to upload pictures file, upload allowed image file format:"
                },
                tabCodeBlock : {
                    title             : "Preformatted text / Codes", 
                    codeEmptyAlert    : "Error: Please fill in the Preformatted text or content of the codes."
                },
                codeBlock : {
                    title             : "Code block",                    
                    selectLabel       : "Languages: ",
                    selectDefaultText : "select a code language...",
                    otherLanguage     : "Other languages",
                    unselectedLanguageAlert : "Error: Please select the code language.",
                    codeEmptyAlert    : "Error: Please fill in the code content."
                }
            }
        };
        
        exports.defaults.lang = lang;
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
                var editormd = require("../editormd");
                factory(editormd);
            });
		}
	} 
	else
	{
        factory(window.editormd);
	}
    
})();