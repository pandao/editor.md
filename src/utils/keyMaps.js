var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
var key = isMac ? "Cmd" : "Ctrl";

var editorKeyMaps = {
    keyMaps : {
        [key + "-1"]       : "h1",
        [key + "-2"]       : "h2",
        [key + "-3"]       : "h3",
        [key + "-4"]       : "h4",
        [key + "-5"]       : "h5",
        [key + "-6"]       : "h6",
        [key + "-B"]       : "bold",  // if this is string ==  editormd.toolbarHandlers.xxxx
        [key + "-D"]       : "datetime",
        
        [key + "Ctrl-E"]       : function() { // emoji
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();
            
            if (!this.settings.emoji)
            {
                alert("Error: settings.emoji == false");
                return ;
            }
    
            cm.replaceSelection(":" + selection + ":");
    
            if (selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 1);
            }
        },
        [key + "-Alt-G"]   : "goto-line",
        [key + "-H"]       : "hr",
        [key + "-I"]       : "italic",
        [key + "-K"]       : "code",
        
        "Ctrl-L"        : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();
            
            var title = (selection === "") ? "" : " \""+selection+"\"";
    
            cm.replaceSelection("[" + selection + "]("+title+")");
    
            if (selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 1);
            }
        },
        [key + "-U"]         : "list-ul",
        
        "Shift-Ctrl-A"   : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();
            
            if (!this.settings.atLink)
            {
                alert("Error: settings.atLink == false");
                return ;
            }
    
            cm.replaceSelection("@" + selection);
    
            if (selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 1);
            }
        },
        
        ["Shift" + key + "-C"]     : "code",
        ["Shift" + key + "Q"]     : "quote",
        ["Shift" + key + "S"]     : "del",
        ["Shift" + key + "K"]     : "tex",  // KaTeX
        
        "Shift-Alt-C"      : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();
            
            cm.replaceSelection(["```", selection, "```"].join("\n"));
    
            if (selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 3);
            } 
        },
        
        ["Shift-" + key + "-Alt-C"]      : "code-block",
        ["Shift-" + key + "-H"]          : "html-entities",
        "Shift-Alt-H"                    : "help",
        ["Shift-" + key + "-E"]          : "emoji",
        ["Shift-" + key + "-U"]          : "uppercase",
        "Shift-Alt-U"                    : "ucwords",
        ["Shift-" + key + "-Alt-U"]      : "ucfirst",
        "Shift-Alt-L"                    : "lowercase",
        
        ["Shift-" + key + "-I"]          : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();
            
            var title = (selection === "") ? "" : " \""+selection+"\"";
    
            cm.replaceSelection("![" + selection + "]("+title+")");
    
            if (selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 4);
            }
        },
        
        ["Shift-" + key + "-Alt-I"]     : "image",
        ["Shift-" + key + "-L"]         : "link",
        ["Shift-" + key + "-O"]         : "list-ol",
        ["Shift-" + key + "-P"]         : "preformatted-text",
        ["Shift-" + key + "-T"]         : "table",
        "Shift-Alt-P"                   : "pagebreak",
        "F9"                            : "watch",
        "F10"                           : "preview",
        "F11"                           : "fullscreen",
    }
};