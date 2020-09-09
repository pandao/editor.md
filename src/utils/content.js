const editorContent = {
    /**
     * 在当前光标处插入新字符
     * Insert a new character at the current cursor position
     *
     * 同replaceSelection()方法
     * With the replaceSelection() method
     * 
     * @param   {String}    value  要插入的字符值
     * @returns {editormd}         返回editormd的实例对象
     */
    
    insertValue : function(value) {
        this.replaceSelection(value);

        return this;
    },
    
    /**
     * 追加markdown
     * append Markdown to editor
     * 
     * @param   {String}    md     要追加的markdown源文档
     * @returns {editormd}         返回editormd的实例对象
     */
    
    appendMarkdown : function(md) {
        var settings = this.settings;
        var cm       = this.cm;
        
        cm.setValue(cm.getValue() + md);
        
        return this;
    },
    
    /**
     * 设置和传入编辑器的markdown源文档
     * Set Markdown source document
     * 
     * @param   {String}    md     要传入的markdown源文档
     * @returns {editormd}         返回editormd的实例对象
     */
    
    setMarkdown : function(md) {
        this.cm.setValue(md || this.settings.markdown);
        
        return this;
    },
    
    /**
     * 获取编辑器的markdown源文档
     * Set Editor.md markdown/CodeMirror value
     * 
     * @returns {editormd}         返回editormd的实例对象
     */
    
    getMarkdown : function() {
        return this.cm.getValue();
    },
    
    /**
     * 获取编辑器的源文档
     * Get CodeMirror value
     * 
     * @returns {editormd}         返回editormd的实例对象
     */
    
    getValue : function() {
        return this.cm.getValue();
    },
    
    /**
     * 设置编辑器的源文档
     * Set CodeMirror value
     * 
     * @param   {String}     value   set code/value/string/text
     * @returns {editormd}           返回editormd的实例对象
     */
    
    setValue : function(value) {
        this.cm.setValue(value);
        
        return this;
    },
    
    /**
     * 清空编辑器
     * Empty CodeMirror editor container
     * 
     * @returns {editormd}         返回editormd的实例对象
     */
    
    clear : function() {
        this.cm.setValue("");
        
        return this;
    },
    
    /**
     * 获取解析后存放在Textarea的HTML源码
     * Get parsed html code from Textarea
     * 
     * @returns {String}               返回HTML源码
     */
    
    getHTML : function() {
        if (!this.settings.saveHTMLToTextarea)
        {
            alert("Error: settings.saveHTMLToTextarea == false");

            return false;
        }
        
        return this.htmlTextarea.val();
    },
    
    /**
     * getHTML()的别名
     * getHTML (alias)
     * 
     * @returns {String}           Return html code 返回HTML源码
     */
    
    getTextareaSavedHTML : function() {
        return this.getHTML();
    },
    
    /**
     * 获取预览窗口的HTML源码
     * Get html from preview container
     * 
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
};