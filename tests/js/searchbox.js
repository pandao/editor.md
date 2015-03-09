/* global CodeMirror */
/* global define */

(function(mod) {
    'use strict';
    
    if (typeof exports === 'object' && typeof module === 'object') // CommonJS
        mod(require('../../lib/codemirror'));
    else if (typeof define === 'function' && define.amd) // AMD
        define(['../../lib/codemirror'], mod);
    else
        mod(CodeMirror);
})(function(CodeMirror) {
    'use strict';
    
    var Search;
    
    CodeMirror.defineOption('searchbox', false, function(cm) {
        cm.addKeyMap({
            'Ctrl-F': function() {
                if (!Search)
                    Search  = new SearchBox(cm);
                
                Search.show();
            },
            
            'Esc': function() {
                if (Search && Search.isVisible()) {
                    Search.hide();
                    
                    if (typeof event !== 'undefined')
                        event.stopPropagation();
                }
                
                return false;
            },
            
            'Cmd-F': function() {
                if (!Search)
                    Search  = new SearchBox(cm);
                
                Search.show();
            }
        });
    });
    
    function SearchBox(cm) {
        var self = this;
        
        init();
        
        function initElements(el) {
            self.searchBox              = el.querySelector('.ace_search_form');
            self.replaceBox             = el.querySelector('.ace_replace_form');
            self.searchOptions          = el.querySelector('.ace_search_options');
            
            self.regExpOption           = el.querySelector('[action=toggleRegexpMode]');
            self.caseSensitiveOption    = el.querySelector('[action=toggleCaseSensitive]');
            self.wholeWordOption        = el.querySelector('[action=toggleWholeWords]');
            
            self.searchInput            = self.searchBox.querySelector('.ace_search_field');
            self.replaceInput           = self.replaceBox.querySelector('.ace_search_field');
        }
        
        function init() {
            var el = self.element = addHtml();
            
            addStyle();
            
            initElements(el);
            bindKeys();
            
            el.addEventListener('mousedown', function(e) {
                setTimeout(function(){
                    self.activeInput.focus();
                }, 0);
                
                e.stopPropagation();
            });
            
            el.addEventListener('click', function(e) {
                var t = e.target || e.srcElement;
                var action = t.getAttribute('action');
                if (action && self[action])
                    self[action]();
                else if (self.commands[action])
                    self.commands[action]();
                
                e.stopPropagation();
            });
            
            self.searchInput.addEventListener('input', function() {
                self.$onChange.schedule(20);
            });
            
            self.searchInput.addEventListener('focus', function() {
                self.activeInput = self.searchInput;
            });
            
            self.replaceInput.addEventListener('focus', function() {
                self.activeInput = self.replaceInput;
            });
            
            self.$onChange = delayedCall(function() {
                self.find(false, false);
            });
        }
        
        function bindKeys() {
            var sb  = self,
                obj = {
                    'Ctrl-F|Cmd-F|Ctrl-H|Command-Alt-F': function() {
                        var isReplace = sb.isReplace = !sb.isReplace;
                        sb.replaceBox.style.display = isReplace ? '' : 'none';
                        sb[isReplace ? 'replaceInput' : 'searchInput'].focus();
                    },
                    'Ctrl-G|Cmd-G': function() {
                        sb.findNext();
                    },
                    'Ctrl-Shift-G|Cmd-Shift-G': function() {
                        sb.findPrev();
                    },
                    'Esc': function() {
                        setTimeout(function() { sb.hide();});
                    },
                    'Enter': function() {
                        if (sb.activeInput === sb.replaceInput)
                            sb.replace();
                        sb.findNext();
                    },
                    'Shift-Enter': function() {
                        if (sb.activeInput === sb.replaceInput)
                            sb.replace();
                        sb.findPrev();
                    },
                    'Alt-Enter': function() {
                        if (sb.activeInput === sb.replaceInput)
                            sb.replaceAll();
                        sb.findAll();
                    },
                    'Tab': function() {
                        if (self.activeInput === self.replaceInput)
                            self.searchInput.focus();
                        else
                            self.replaceInput.focus();
                    }
                };
            
            self.element.addEventListener('keydown', function(event) {
                Object.keys(obj).some(function(name) {
                    var is = key(name, event);
                    
                    if (is) {
                        event.stopPropagation();
                        event.preventDefault();
                        obj[name](event);
                    }
                    
                    return is;
                });
            });
        }
        
        this.commands   = {
            toggleRegexpMode: function() {
                self.regExpOption.checked = !self.regExpOption.checked;
                self.$syncOptions();
            },
            
            toggleCaseSensitive: function() {
                self.caseSensitiveOption.checked = !self.caseSensitiveOption.checked;
                self.$syncOptions();
            },
            
            toggleWholeWords: function() {
                self.wholeWordOption.checked = !self.wholeWordOption.checked;
                self.$syncOptions();
            }
        };
        
        this.$syncOptions = function() {
            setCssClass(this.regExpOption, 'checked', this.regExpOption.checked);
            setCssClass(this.wholeWordOption, 'checked', this.wholeWordOption.checked);
            setCssClass(this.caseSensitiveOption, 'checked', this.caseSensitiveOption.checked);
            
            this.find(false, false);
        };
        
        this.find = function(skipCurrent, backwards) {
            var value   = this.searchInput.value,
                options = {
                    skipCurrent: skipCurrent,
                    backwards: backwards,
                    regExp: this.regExpOption.checked,
                    caseSensitive: this.caseSensitiveOption.checked,
                    wholeWord: this.wholeWordOption.checked
                };
            
            find(value, options, function(searchCursor) {
                var current = searchCursor.matches(false, searchCursor.from());
                cm.setSelection(current.from, current.to);
            });
        };
        
        function find(value, options, callback) {
            var done,
                noMatch, searchCursor, next, prev, matches, cursor,
                position,
                o               = options,
                is              = true,
                caseSensitive   = o.caseSensitive,
                regExp          = o.regExp,
                wholeWord       = o.wholeWord;
            
            if (regExp || wholeWord) {
                if (options.wholeWord)
                    value   = '\\b' + value + '\\b';
                
                value   = RegExp(value);
            }
            
            if (o.backwards)
                position = o.skipCurrent ? 'from': 'to';
            else
                position = o.skipCurrent ? 'to' : 'from';
                
            cursor          = cm.getCursor(position);
            searchCursor    = cm.getSearchCursor(value, cursor, !caseSensitive);
            
            next            = searchCursor.findNext.bind(searchCursor),
            prev            = searchCursor.findPrevious.bind(searchCursor),
            matches         = searchCursor.matches.bind(searchCursor);
            
            if (o.backwards && !prev()) {
                is = next();
                
                if (is) {
                    cm.setCursor(cm.doc.size - 1, 0);
                    find(true, true, callback);
                    done = true;
                }
            } else if (!o.backwards && !next()) {
                is = prev();
                
                if (is) {
                    cm.setCursor(0, 0);
                    find(true, false, callback);
                    done = true;
                }
            }
            
            noMatch             = !is && self.searchInput.value;
            setCssClass(self.searchBox, 'ace_nomatch', noMatch);
            
            if (!done && is)
                callback(searchCursor);
        }
        
        this.findNext = function() {
            this.find(true, false);
        };
        
        this.findPrev = function() {
            this.find(true, true);
        };
        
        this.findAll = function(){
            /*
            var range = this.editor.findAll(this.searchInput.value, {
                regExp: this.regExpOption.checked,
                caseSensitive: this.caseSensitiveOption.checked,
                wholeWord: this.wholeWordOption.checked
            });
            */
            
            var value   = this.searchInput.value,
                range,
                noMatch = !range && this.searchInput.value;
            
            setCssClass(this.searchBox, 'ace_nomatch', noMatch);
            
            if (cm.showMatchesOnScrollbar)
                cm.showMatchesOnScrollbar(value);
            
            this.hide();
        };
        
        this.replace = function() {
            if (!cm.getOption('readOnly'))
                cm.replaceSelection(this.replaceInput.value, 'start');
        };
        
        this.replaceAndFindNext = function() {
            if (!cm.getOption('readOnly')) {
                this.editor.replace(this.replaceInput.value);
                this.findNext();
            }
        };
        
        this.replaceAll = function() {
            var value,
                cursor,
                from    = this.searchInput.value,
                to      = this.replaceInput.value,
                reg     = RegExp(from, 'g');
            
            if (!cm.getOption('readOnly')) {
                cursor  = cm.getCursor();
                value   = cm.getValue();
                value   = value.replace(reg, to);
                
                cm.setValue(value);
                cm.setCursor(cursor);
            }
        };
        
        this.hide = function() {
            this.element.style.display = 'none';
            cm.focus();
        };
        
        this.isVisible = function() {
            var is = this.element.style.display === '';
            
            return is;
        };
        
        this.show = function(value, isReplace) {
            this.element.style.display = '';
            this.replaceBox.style.display = isReplace ? '' : 'none';
            
            this.isReplace = isReplace;
            
            if (value)
                this.searchInput.value = value;
            
            this.searchInput.focus();
            this.searchInput.select();
        };
        
        this.isFocused = function() {
            var el = document.activeElement;
            return el === this.searchInput || el === this.replaceInput;
        };
        
        function addStyle() {
            var style   = document.createElement('style'),
                css     = [
                    '.ace_search {',
                        'background-color: #ddd;',
                        'border: 1px solid #cbcbcb;',
                        'border-top: 0 none;',
                        'max-width: 325px;',
                        'overflow: hidden;',
                        'margin: 0;',
                        'padding: 4px;',
                        'padding-right: 6px;',
                        'padding-bottom: 0;',
                        'position: absolute;',
                        'top: 0px;',
                        'z-index: 99;',
                        'white-space: normal;',
                    '}',
                    '.ace_search.left {',
                        'border-left: 0 none;',
                        'border-radius: 0px 0px 5px 0px;',
                        'left: 0;',
                    '}',
                    '.ace_search.right {',
                        'border-radius: 0px 0px 0px 5px;',
                        'border-right: 0 none;',
                        'right: 0;',
                    '}',
                    '.ace_search_form, .ace_replace_form {',
                        'border-radius: 3px;',
                        'border: 1px solid #cbcbcb;',
                        'float: left;',
                        'margin-bottom: 4px;',
                        'overflow: hidden;',
                    '}',
                    '.ace_search_form.ace_nomatch {',
                        'outline: 1px solid red;',
                    '}',
                    '.ace_search_field {',
                        'background-color: white;',
                        'border-right: 1px solid #cbcbcb;',
                        'border: 0 none;',
                        '-webkit-box-sizing: border-box;',
                        '-moz-box-sizing: border-box;',
                        'box-sizing: border-box;',
                        'float: left;',
                        'height: 22px;',
                        'outline: 0;',
                        'padding: 0 7px;',
                        'width: 214px;',
                        'margin: 0;',
                    '}',
                    '.ace_searchbtn,',
                    '.ace_replacebtn {',
                        'background: #fff;',
                        'border: 0 none;',
                        'border-left: 1px solid #dcdcdc;',
                        'cursor: pointer;',
                        'float: left;',
                        'height: 22px;',
                        'margin: 0;',
                        'padding: 0;',
                        'position: relative;',
                    '}',
                    '.ace_searchbtn:last-child,',
                    '.ace_replacebtn:last-child {',
                        'border-top-right-radius: 3px;',
                        'border-bottom-right-radius: 3px;',
                    '}',
                    '.ace_searchbtn:disabled {',
                        'background: none;',
                        'cursor: default;',
                    '}',
                    '.ace_searchbtn {',
                        'background-position: 50% 50%;',
                        'background-repeat: no-repeat;',
                        'width: 27px;',
                    '}',
                    '.ace_searchbtn.prev {',
                        'background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFCAYAAAB4ka1VAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADFJREFUeNpiSU1NZUAC/6E0I0yACYskCpsJiySKIiY0SUZk40FyTEgCjGgKwTRAgAEAQJUIPCE+qfkAAAAASUVORK5CYII=);    ',
                    '}',
                    '.ace_searchbtn.next {',
                        'background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFCAYAAAB4ka1VAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADRJREFUeNpiTE1NZQCC/0DMyIAKwGJMUAYDEo3M/s+EpvM/mkKwCQxYjIeLMaELoLMBAgwAU7UJObTKsvAAAAAASUVORK5CYII=);    ',
                    '}',
                    '.ace_searchbtn_close {',
                        'background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAcCAYAAABRVo5BAAAAZ0lEQVR42u2SUQrAMAhDvazn8OjZBilCkYVVxiis8H4CT0VrAJb4WHT3C5xU2a2IQZXJjiQIRMdkEoJ5Q2yMqpfDIo+XY4k6h+YXOyKqTIj5REaxloNAd0xiKmAtsTHqW8sR2W5f7gCu5nWFUpVjZwAAAABJRU5ErkJggg==) no-repeat 50% 0;',
                        'border-radius: 50%;',
                        'border: 0 none;',
                        'color: #656565;',
                        'cursor: pointer;',
                        'float: right;',
                        'font: 16px/16px Arial;',
                        'height: 14px;',
                        'margin: 5px 1px 9px 5px;',
                        'padding: 0;',
                        'text-align: center;',
                        'width: 14px;',
                    '}',
                    '.ace_searchbtn_close:hover {',
                        'background-color: #656565;',
                        'background-position: 50% 100%;',
                        'color: white;',
                    '}',
                    '.ace_replacebtn.prev {',
                        'width: 54px',
                    '}',
                    '.ace_replacebtn.next {',
                        'width: 27px',
                    '}',
                    '.ace_button {',
                        'margin-left: 2px;',
                        'cursor: pointer;',
                        '-webkit-user-select: none;',
                        '-moz-user-select: none;',
                        '-o-user-select: none;',
                        '-ms-user-select: none;',
                        'user-select: none;',
                        'overflow: hidden;',
                        'opacity: 0.7;',
                        'border: 1px solid rgba(100,100,100,0.23);',
                        'padding: 1px;',
                        '-moz-box-sizing: border-box;',
                        'box-sizing:    border-box;',
                        'color: black;',
                    '}',
                    '.ace_button:hover {',
                        'background-color: #eee;',
                        'opacity:1;',
                    '}',
                    '.ace_button:active {',
                        'background-color: #ddd;',
                    '}',
                    '.ace_button.checked {',
                        'border-color: #3399ff;',
                        'opacity:1;',
                    '}',
                    '.ace_search_options{',
                        'margin-bottom: 3px;',
                        'text-align: right;',
                        '-webkit-user-select: none;',
                        '-moz-user-select: none;',
                        '-o-user-select: none;',
                        '-ms-user-select: none;',
                        'user-select: none;',
                    '}'
                ].join('');
            
            style.setAttribute('data-name', 'js-searchbox');
            
            style.textContent = css;
            
            document.head.appendChild(style);
        }
        
        function addHtml() {
            var elSearch,
                el      = document.querySelector('.CodeMirror'),
                div     = document.createElement('div'),
                html    = [
                    '<div class="ace_search right">',
                        '<button type="button" action="hide" class="ace_searchbtn_close"></button>',
                        '<div class="ace_search_form">',
                            '<input class="ace_search_field" placeholder="Search for" spellcheck="false"></input>',
                            '<button type="button" action="findNext" class="ace_searchbtn next"></button>',
                            '<button type="button" action="findPrev" class="ace_searchbtn prev"></button>',
                            '<button type="button" action="findAll" class="ace_searchbtn" title="Alt-Enter">All</button>',
                        '</div>',
                        '<div class="ace_replace_form">',
                            '<input class="ace_search_field" placeholder="Replace with" spellcheck="false"></input>',
                            '<button type="button" action="replaceAndFindNext" class="ace_replacebtn">Replace</button>',
                            '<button type="button" action="replaceAll" class="ace_replacebtn">All</button>',
                        '</div>',
                        '<div class="ace_search_options">',
                            '<span action="toggleRegexpMode" class="ace_button" title="RegExp Search">.*</span>',
                            '<span action="toggleCaseSensitive" class="ace_button" title="CaseSensitive Search">Aa</span>',
                            '<span action="toggleWholeWords" class="ace_button" title="Whole Word Search">\\b</span>',
                        '</div>',
                    '</div>'
                ].join('');
            
            div.innerHTML = html;
            
            elSearch = div.firstChild;
            
            el.parentElement.appendChild(elSearch);
            
            return elSearch;
        }
    }
    
    function setCssClass(el, className, condition) {
        var list = el.classList;
        
        list[condition ? 'add' : 'remove'](className);
    }
    
    function delayedCall(fcn, defaultTimeout) {
        var timer,
            callback = function() {
                timer = null;
                fcn();
            },
            
            _self = function(timeout) {
                if (!timer)
                    timer = setTimeout(callback, timeout || defaultTimeout);
            };
        
        _self.delay = function(timeout) {
            timer && clearTimeout(timer);
            timer = setTimeout(callback, timeout || defaultTimeout);
        };
        _self.schedule = _self;
        
        _self.call = function() {
            this.cancel();
            fcn();
        };
        
        _self.cancel = function() {
            timer && clearTimeout(timer);
            timer = null;
        };
        
        _self.isPending = function() {
            return timer;
        };
    
        return _self;
    }
    
    /* https://github.com/coderaiser/key */
    function key(str, event) {
        var right,
            KEY = {
                BACKSPACE   : 8,
                TAB         : 9,
                ENTER       : 13,
                ESC         : 27,
                
                SPACE       : 32,
                PAGE_UP     : 33,
                PAGE_DOWN   : 34,
                END         : 35,
                HOME        : 36,
                UP          : 38,
                DOWN        : 40,
                
                INSERT      : 45,
                DELETE      : 46,
                
                INSERT_MAC  : 96,
                
                ASTERISK    : 106,
                PLUS        : 107,
                MINUS       : 109,
                
                F1          : 112,
                F2          : 113,
                F3          : 114,
                F4          : 115,
                F5          : 116,
                F6          : 117,
                F7          : 118,
                F8          : 119,
                F9          : 120,
                F10         : 121,
                
                SLASH       : 191,
                TRA         : 192, /* Typewritten Reverse Apostrophe (`) */
                BACKSLASH   : 220
            };
        
        keyCheck(str, event);
        
        right = str.split('|').some(function(combination) {
            var wrong;
            
            wrong = combination.split('-').some(function(key) {
                var right;
                
                switch(key) {
                case 'Ctrl':
                    right = event.ctrlKey;
                    break;
                
                case 'Shift':
                    right = event.shiftKey;
                    break;
                
                case 'Alt':
                    right = event.altKey;
                    break;
                
                case 'Cmd':
                    right = event.metaKey;
                    break;
                
                default:
                    if (key.length === 1)
                        right = event.keyCode === key.charCodeAt(0);
                    else
                        Object.keys(KEY).some(function(name) {
                            var up = key.toUpperCase();
                            
                            if (up === name)
                                right = event.keyCode === KEY[name];
                        });
                    break;
                }
                
                return !right;
            });
            
            return !wrong;
        });
        
        return right;
    }
    
    function keyCheck(str, event) {
        if (typeof str !== 'string')
            throw(Error('str should be string!'));
        
        if (typeof event !== 'object')
            throw(Error('event should be object!'));
    }

});
