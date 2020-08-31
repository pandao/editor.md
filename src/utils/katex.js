var editorKatex = {
    kaTeXLoaded : false, 

    // 使用国外的CDN，加载速度有时会很慢，或者自定义URL
    // You can custom KaTeX load url.
    katexURL : {
        css : "http://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.11.1/katex.min",
        js  : "http://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.11.1/katex.min"
    },
    
    /**
     * 加载KaTeX文件
     * load KaTeX files
     * 
     * @param {Function} [callback=function()]  加载成功后执行的回调函数
     */
    
    loadKaTeX : function(callback){
        editormd.loadCSS(editormd.katexURL.css, function(){
            editormd.loadScript(editormd.katexURL.js, callback || function(){});
        });
    }
};