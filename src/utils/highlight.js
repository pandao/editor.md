const editorHighlight = {
    /**
     * 高亮预览HTML的pre代码部分
     * highlight of preview codes
     * 
     * @returns {editormd}             返回editormd的实例对象
     */
    
    previewCodeHighlight : function() {    
        var settings         = this.settings;
        var previewContainer = this.previewContainer;
        
        if (settings.previewCodeHighlight) 
        {
            previewContainer.find("pre").addClass("prettyprint linenums");
            
            if (typeof prettyPrint !== "undefined")
            {                    
                prettyPrint();
            }
        }

        return this;
    },
};