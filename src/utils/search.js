var editorSearch = {
    /**
     * 搜索替换
     * Search & replace
     * 
     * @param   {String}     command    CodeMirror serach commands, "find, fintNext, fintPrev, clearSearch, replace, replaceAll"
     * @returns {editormd}              return this
     */
    
    search : function(command) {
        var settings = this.settings;
        
        if (!settings.searchReplace)
        {
            alert("Error: settings.searchReplace == false");
            return this;
        }
        
        if (!settings.readOnly)
        {
            this.cm.execCommand(command || "find");
        }
        
        return this;
    },
    
    searchReplace : function() {            
        this.search("replace");
        
        return this;
    },
    
    searchReplaceAll : function() {          
        this.search("replaceAll");
        
        return this;
    }
}