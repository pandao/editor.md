const editorEmojiRenderer = function(text) {
            
    const emojiReg        = regexConst.emoji;
    text = text.replace(editormd.regexs.emojiDatetime, function($1) {           
        return $1.replace(/:/g, "&#58;");
    });
    
    var matchs = text.match(emojiReg);

    console.log(`-----`,{editormd});
    console.trace();
    if (!matchs || !settings.emoji) {
        return text;
    }

    for (var i = 0, len = matchs.length; i < len; i++)
    {            
        if (matchs[i] === ":+1:") {
            matchs[i] = ":\\+1:";
        }

        text = text.replace(new RegExp(matchs[i]), function($1, $2){
            var faMatchs = $1.match(faIconReg);
            var name     = $1.replace(/:/g, "");

            if (faMatchs)
            {                        
                for (var fa = 0, len1 = faMatchs.length; fa < len1; fa++)
                {
                    var faName = faMatchs[fa].replace(/:/g, "");
                    
                    return "<i class=\"fa " + faName + " fa-emoji\" title=\"" + faName.replace("fa-", "") + "\"></i>";
                }
            }
            else
            {
                var emdlogoMathcs = $1.match(editormdLogoReg);
                var twemojiMatchs = $1.match(twemojiReg);

                if (emdlogoMathcs)                                        
                {                            
                    for (var x = 0, len2 = emdlogoMathcs.length; x < len2; x++)
                    {
                        var logoName = emdlogoMathcs[x].replace(/:/g, "");
                        return "<i class=\"" + logoName + "\" title=\"Editor.md logo (" + logoName + ")\"></i>";
                    }
                }
                else if (twemojiMatchs) 
                {
                    for (var t = 0, len3 = twemojiMatchs.length; t < len3; t++)
                    {
                        var twe = twemojiMatchs[t].replace(/:/g, "").replace("tw-", "");
                        return "<img src=\"" + editormd.twemoji.path + twe + editormd.twemoji.ext + "\" title=\"twemoji-" + twe + "\" alt=\"twemoji-" + twe + "\" class=\"emoji twemoji\" />";
                    }
                }
                else
                {
                    var src = (name === "+1") ? "plus1" : name;
                    src     = (src === "black_large_square") ? "black_square" : src;
                    src     = (src === "moon") ? "waxing_gibbous_moon" : src;

                    return "<img src=\"" + editormd.emoji.path + src + editormd.emoji.ext + "\" class=\"emoji\" title=\"&#58;" + name + "&#58;\" alt=\"&#58;" + name + "&#58;\" />";
                }
            }
        });
    }

    return text;
}