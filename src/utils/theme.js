// var editorTheme = function(){
//     return new editorTheme();
// }

var editorTheme = function(){};
// editorTheme.prototype  = editorTheme.fn = {
    /**
 * 设置 Editor.md 的整体主题，主要是工具栏
 * Setting Editor.md theme
 * 
 * @returns {editormd}  返回editormd的实例对象
 */

editorTheme.prototype.setTheme = function(theme) {
    var editor      = this.editor;
    var oldTheme    = this.settings.theme;
    var themePrefix = this.classPrefix + "theme-";
    
    editor.removeClass(themePrefix + oldTheme).addClass(themePrefix + theme);
    
    this.settings.theme = theme;
    
    return this;
};
    
/**
 * 设置 CodeMirror（编辑区）的主题
 * Setting CodeMirror (Editor area) theme
 * 
 * @returns {editormd}  返回editormd的实例对象
 */

editorTheme.prototype.setEditorTheme = function(theme) {  
    var settings   = this.settings;  
    settings.editorTheme = theme;  
    
    if (theme !== "default")
    {
        editormd.loadCSS(settings.path + "codemirror/theme/" + settings.editorTheme);
    }
    
    this.cm.setOption("theme", theme);
    
    return this;
}
// };