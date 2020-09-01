var editorWatching = {
     /**
     * 开启实时预览
     * Enable real-time watching
     * 
     * @returns {editormd}         返回editormd的实例对象
     */
    
    watch : function(callback) {     
        var settings        = this.settings;
        
        if ($.inArray(settings.mode, ["gfm", "markdown"]) < 0)
        {
            return this;
        }
        
        this.state.watching = settings.watch = true;
        this.preview.show();
        
        if (this.toolbar)
        {
            var watchIcon   = settings.toolbarIconsClass.watch;
            var unWatchIcon = settings.toolbarIconsClass.unwatch;
            
            var icon        = this.toolbar.find(".fa[name=watch]");
            icon.parent().attr("title", settings.lang.toolbar.watch);
            icon.removeClass(unWatchIcon).addClass(watchIcon);
        }
        
        this.codeMirror.css("border-right", "1px solid #ddd").width(this.editor.width() / 2); 
        
        timer = 0;
        
        this.save().resize();
        
        if (!settings.onwatch)
        {
            settings.onwatch = callback || function() {};
        }
        
        $.proxy(settings.onwatch, this)();
        
        return this;
    },
    
    /**
     * 关闭实时预览
     * Disable real-time watching
     * 
     * @returns {editormd}         返回editormd的实例对象
     */
    
    unwatch : function(callback) {
        var settings        = this.settings;
        this.state.watching = settings.watch = false;
        this.preview.hide();
        
        if (this.toolbar) 
        {
            var watchIcon   = settings.toolbarIconsClass.watch;
            var unWatchIcon = settings.toolbarIconsClass.unwatch;
            
            var icon    = this.toolbar.find(".fa[name=watch]");
            icon.parent().attr("title", settings.lang.toolbar.unwatch);
            icon.removeClass(watchIcon).addClass(unWatchIcon);
        }
        
        this.codeMirror.css("border-right", "none").width(this.editor.width());
        
        this.resize();
        
        if (!settings.onunwatch)
        {
            settings.onunwatch = callback || function() {};
        }
        
        $.proxy(settings.onunwatch, this)();
        
        return this;
    },
}