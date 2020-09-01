var editorDialog = {
    /**
     * 工具栏图标事件处理对象序列
     * Get toolbar icons event handlers
     * 
     * @param   {Object}   cm    CodeMirror的实例对象
     * @param   {String}   name  要获取的事件处理器名称
     * @returns {Object}         返回处理对象序列
     */
        
    dialogLockScreen : function() {
        $.proxy(editormd.dialogLockScreen, this)();
        
        return this;
    },

    dialogShowMask : function(dialog) {
        $.proxy(editormd.dialogShowMask, this)(dialog);
        
        return this;
    },
    
     /**
     * 动态创建对话框
     * Creating custom dialogs
     * 
     * @param   {Object} options  配置项键值对 Key/Value
     * @returns {dialog}          返回创建的dialog的jQuery实例对象
     */
    
    createDialog : function(options) {            
        return $.proxy(editormd.createDialog, this)(options);
    },
    
    /**
     * 创建关于Editor.md的对话框
     * Create about Editor.md dialog
     * 
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
            "<p style=\"margin: 10px 0 20px 0;\"><a href=\"" + editormd.homePage + "\" target=\"_blank\">" + editormd.homePage + " <i class=\"fa fa-external-link\"></i></a></p>",
            "<p style=\"font-size: 0.85em;\">Copyright &copy; 2015 <a href=\"https://github.com/pandao\" target=\"_blank\" class=\"hover-link\">Pandao</a>, The <a href=\"https://github.com/pandao/editor.md/blob/master/LICENSE\" target=\"_blank\" class=\"hover-link\">MIT</a> License.</p>",
            "</div>",
            "<a href=\"javascript:;\" class=\"fa fa-close " + classPrefix + "dialog-close\"></a>",
            "</div>"
        ].join("\n");

        editor.append(infoDialogHTML);
        
        var infoDialog  = this.infoDialog = editor.children("." + classPrefix + "dialog-info");

        infoDialog.find("." + classPrefix + "dialog-close").bind(editormd.mouseOrTouch("click", "touchend"), function() {
            _this.hideInfoDialog();
        });
        
        infoDialog.css("border", (editormd.isIE8) ? "1px solid #ddd" : "").css("z-index", editormd.dialogZindex).show();
        
        this.infoDialogPosition();

        return this;
    },
    
    /**
     * 关于Editor.md对话居中定位
     * Editor.md dialog position handle
     * 
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
     * Display about Editor.md dialog
     * 
     * @returns {editormd}  返回editormd的实例对象
     */
    
    showInfoDialog : function() {

        $("html,body").css("overflow-x", "hidden");
        
        var _this       = this;
        var editor      = this.editor;
        var settings    = this.settings;         
        var infoDialog  = this.infoDialog = editor.children("." + this.classPrefix + "dialog-info");
        
        if (infoDialog.length < 1)
        {
            this.createInfoDialog();
        }
        
        this.lockScreen(true);
        
        this.mask.css({
                    opacity         : settings.dialogMaskOpacity,
                    backgroundColor : settings.dialogMaskBgColor
                }).show();

        infoDialog.css("z-index", editormd.dialogZindex).show();

        this.infoDialogPosition();

        return this;
    },
    
    /**
     * 隐藏关于Editor.md
     * Hide about Editor.md dialog
     * 
     * @returns {editormd}  返回editormd的实例对象
     */
    
    hideInfoDialog : function() {            
        $("html,body").css("overflow-x", "");
        this.infoDialog.hide();
        this.mask.hide();
        this.lockScreen(false);

        return this;
    },
    
};