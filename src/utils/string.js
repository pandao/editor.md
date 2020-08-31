 /**
 * 所有单词首字母大写
 * Words first to uppercase
 * 
 * @param   {String}    str            string
 * @returns {String}                   string
 */

var ucwords = function (str) {
    return str.toLowerCase().replace(/\b(\w)|\s(\w)/g, function($1) {  
        return $1.toUpperCase();
    });
};

 /**
 * 字符串首字母大写
 * Only string first char to uppercase
 * 
 * @param   {String}    str            string
 * @returns {String}                   string
 */

var firstUpperCase = function(str) {        
    return str.toLowerCase().replace(/\b(\w)/, function($1){
        return $1.toUpperCase();
    });
};


var editorString = {
    ucwords: ucwords,
    wordsFirstUpperCase : ucwords,

    firstUpperCase: firstUpperCase,
    ucfirst : firstUpperCase,

    /**
     * 清除字符串两边的空格
     * Clear the space of strings both sides.
     * 
     * @param   {String}    str            string
     * @returns {String}                   trimed string    
     */
    trim : function(str) {
        return (!String.prototype.trim) ? str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "") : str.trim();
    }
};