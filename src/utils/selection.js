const editorSelection = {
    /**
         * 设置光标选中的范围
         * Set cursor selected ranges
         * 
         * @param   {Object}    from   开始位置的光标键值对象，例：{line:1, ch:0}
         * @param   {Object}    to     结束位置的光标键值对象，例：{line:1, ch:0}
         * @returns {editormd}         返回editormd的实例对象
         */
        
        setSelection : function(from, to) {
        
            this.cm.setSelection(from, to);
        
            return this;
        },
        
        /**
         * 获取光标选中的文本
         * Get the texts from cursor selected
         * 
         * @returns {String}         返回选中文本的字符串形式
         */
        
        getSelection : function() {
            return this.cm.getSelection();
        },
        
        /**
         * 设置光标选中的文本范围
         * Set the cursor selection ranges
         * 
         * @param   {Array}    ranges  cursor selection ranges array
         * @returns {Array}            return this
         */
        
        setSelections : function(ranges) {
            this.cm.setSelections(ranges);
            
            return this;
        },
        
        /**
         * 获取光标选中的文本范围
         * Get the cursor selection ranges
         * 
         * @returns {Array}         return selection ranges array
         */
        
        getSelections : function() {
            return this.cm.getSelections();
        },
        
        /**
         * 替换当前光标选中的文本或在当前光标处插入新字符
         * Replace the text at the current cursor selected or insert a new character at the current cursor position
         * 
         * @param   {String}    value  要插入的字符值
         * @returns {editormd}         返回editormd的实例对象
         */
        
        replaceSelection : function(value) {
            this.cm.replaceSelection(value);

            return this;
        },
};