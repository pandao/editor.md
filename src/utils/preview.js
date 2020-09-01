var editorPreview = {
    /**
     * 隐藏编辑器部分，只预览HTML
     * Enter preview html state
     * 
     * @returns {editormd}         返回editormd的实例对象
     */
    
    previewing : function() {
        
        var _this            = this;
        var editor           = this.editor;
        var preview          = this.preview;
        var toolbar          = this.toolbar;
        var settings         = this.settings;
        var codeMirror       = this.codeMirror;
        var previewContainer = this.previewContainer;
        
        if ($.inArray(settings.mode, ["gfm", "markdown"]) < 0) {
            return this;
        }
        
        if (settings.toolbar && toolbar) {
            toolbar.toggle();
            toolbar.find(".fa[name=preview]").toggleClass("active");
        }
        
        codeMirror.toggle();
        
        var escHandle = function(event) {
            if (event.shiftKey && event.keyCode === 27) {
                _this.previewed();
            }
        };

        if (codeMirror.css("display") === "none") // 为了兼容Zepto，而不使用codeMirror.is(":hidden")
        {
            this.state.preview = true;

            if (this.state.fullscreen) {
                preview.css("background", "#fff");
            }
            
            editor.find("." + this.classPrefix + "preview-close-btn").show().bind(editormd.mouseOrTouch("click", "touchend"), function(){
                _this.previewed();
            });
        
            if (!settings.watch)
            {
                this.save();
            } 
            else 
            {
                previewContainer.css("padding", "");
            }
            
            previewContainer.addClass(this.classPrefix + "preview-active");

            preview.show().css({
                position  : "",
                top       : 0,
                width     : editor.width(),
                height    : (settings.autoHeight && !this.state.fullscreen) ? "auto" : editor.height()
            });
            
            if (this.state.loaded)
            {
                $.proxy(settings.onpreviewing, this)();
            }

            $(window).bind("keyup", escHandle);
        } 
        else 
        {
            $(window).unbind("keyup", escHandle);
            this.previewed();
        }
    },
    
    /**
     * 显示编辑器部分，退出只预览HTML
     * Exit preview html state
     * 
     * @returns {editormd}         返回editormd的实例对象
     */
    
    previewed : function() {
        
        var editor           = this.editor;
        var preview          = this.preview;
        var toolbar          = this.toolbar;
        var settings         = this.settings;
        var previewContainer = this.previewContainer;
        var previewCloseBtn  = editor.find("." + this.classPrefix + "preview-close-btn");

        this.state.preview   = false;
        
        this.codeMirror.show();
        
        if (settings.toolbar) {
            toolbar.show();
        }
        
        preview[(settings.watch) ? "show" : "hide"]();
        
        previewCloseBtn.hide().unbind(editormd.mouseOrTouch("click", "touchend"));
            
        previewContainer.removeClass(this.classPrefix + "preview-active");
            
        if (settings.watch)
        {
            previewContainer.css("padding", "20px");
        }
        
        preview.css({ 
            background : null,
            position   : "absolute",
            width      : editor.width() / 2,
            height     : (settings.autoHeight && !this.state.fullscreen) ? "auto" : editor.height() - toolbar.height(),
            top        : (settings.toolbar)    ? toolbar.height() : 0
        });

        if (this.state.loaded)
        {
            $.proxy(settings.onpreviewed, this)();
        }
        
        return this;
    },
    
    /**
     * 编辑器全屏显示
     * Fullscreen show
     * 
     * @returns {editormd}         返回editormd的实例对象
     */
    
    fullscreen : function() {
        
        var _this            = this;
        var state            = this.state;
        var editor           = this.editor;
        var preview          = this.preview;
        var toolbar          = this.toolbar;
        var settings         = this.settings;
        var fullscreenClass  = this.classPrefix + "fullscreen";
        
        if (toolbar) {
            toolbar.find(".fa[name=fullscreen]").parent().toggleClass("active"); 
        }
        
        var escHandle = function(event) {
            if (!event.shiftKey && event.keyCode === 27) 
            {
                if (state.fullscreen)
                {
                    _this.fullscreenExit();
                }
            }
        };

        if (!editor.hasClass(fullscreenClass)) 
        {
            state.fullscreen = true;

            $("html,body").css("overflow", "hidden");
            
            editor.css({
                width    : $(window).width(),
                height   : $(window).height()
            }).addClass(fullscreenClass);

            this.resize();

            $.proxy(settings.onfullscreen, this)();

            $(window).bind("keyup", escHandle);
        }
        else
        {           
            $(window).unbind("keyup", escHandle); 
            this.fullscreenExit();
        }

        return this;
    },
    
    /**
     * 编辑器退出全屏显示
     * Exit fullscreen state
     * 
     * @returns {editormd}         返回editormd的实例对象
     */
    
    fullscreenExit : function() {
        
        var editor            = this.editor;
        var settings          = this.settings;
        var toolbar           = this.toolbar;
        var fullscreenClass   = this.classPrefix + "fullscreen";  
        
        this.state.fullscreen = false;
        
        if (toolbar) {
            toolbar.find(".fa[name=fullscreen]").parent().removeClass("active"); 
        }

        $("html,body").css("overflow", "");

        editor.css({
            width    : editor.data("oldWidth"),
            height   : editor.data("oldHeight")
        }).removeClass(fullscreenClass);

        this.resize();
        
        $.proxy(settings.onfullscreenExit, this)();

        return this;
    },
};