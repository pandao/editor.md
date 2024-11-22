(function(){
    var factory = function (exports) {
        var lang = {
            name : "kr",
            description : "오픈소스 온라인 마크다운 에디터",
            tocTitle    : "Table of Contents",
            toolbar : {
                undo             : "되돌리기(Ctrl+Z)",
                redo             : "재실행(Ctrl+Y)",
                bold             : "볼드체",
                del              : "delete",
                italic           : "기울이기",
                quote            : "주석",
                ucwords          : "첫 문자를 대문자로",
                uppercase        : "선택한 문자 대문자로",
                lowercase        : "선택한 문자 소문자로",
                h1               : "제목",
                h2               : "소제목",
                h3               : "내용 1",
                h4               : "내용 2",
                h5               : "내용 3",
                h6               : "내용 4",
                "list-ul"        : "무작위 목록",
                "list-ol"        : "정렬된 목록",
                hr               : "수평 규칙",
                link             : "링크",
                "reference-link" : "참고",
                image            : "사진",
                code             : "코드",
                "preformatted-text" : "preformated text / Code block (탭 들여쓰기)",
                "code-block"     : "Code block (다중 언어)",
                table            : "표",
                datetime         : "일시",
                emoji            : "이모지",
                "html-entities"  : "HTML 입력",
                pagebreak        : "Page break",
                watch            : "Unwatch",
                unwatch          : "Watch",
                preview          : "HTML 미리보기 (Shift + ESC 누르면 나가기)",
                fullscreen       : "Fullscreen (Press ESC exit)",
                clear            : "Clear",
                search           : "검색",
                help             : "도움말",
                info             : "About" + exports.title
            },
            buttons : {
                enter  : "입력",
                cancel : "취소",
                close  : "닫기"
            },
            dialog : {
                link : {
                    title    : "링크",
                    url      : "url주소",
                    urlTitle : "url제목",
                    urlEmpty : "오류: 링크 주소 칸을 채워주세요."
                },
                referenceLink : {
                    title    : "참조 링크",
                    name     : "이름",
                    url      : "url주소",
                    urlId    : "urlID",
                    urlTitle : "url제목",
                    nameEmpty: "에러: 참조링크를 비워둘 수 없습니다.",
                    idEmpty  : "에러: 참조링크 id를 채워주세요.",
                    urlEmpty : "에러: 참조링크 url주소를 채워주세요."
                },
                image : {
                    title    : "이미지",
                    url      : "이미지url주소",
                    link     : "이미지링크",
                    alt      : "이미지제목",
                    uploadButton     : "업로드",
                    imageURLEmpty    : "에러: 이미지 url주소는 비워둘 수 없습니다.",
                    uploadFileEmpty  : "에러: 업로드 할 사진을 비워둘 수 없습니다.",
                    formatNotAllowed : "에러: 이미지 파일만 업로드 할 수 있습니다, 업로드 가능한 이미지 파일의 형식:"
                },
                preformattedText : {
                    title             : "Preformatted text / Codes", 
                    emptyAlert        : "Error: Please fill in the Preformatted text or content of the codes.",
                    placeholder       : "coding now...."
                },
                codeBlock : {
                    title             : "Code block",         
                    selectLabel       : "Languages: ",
                    selectDefaultText : "select a code language...",
                    otherLanguage     : "Other languages",
                    unselectedLanguageAlert : "Error: Please select the code language.",
                    codeEmptyAlert    : "Error: Please fill in the code content.",
                    placeholder       : "coding now...."
                },
                htmlEntities : {
                    title : "HTML Entities"
                },
                help : {
                    title : "Help"
                }
            }
        };
        
        exports.defaults.lang = lang;
    };
    
	// CommonJS/Node.js
	if (typeof require === "function" && typeof exports === "object" && typeof module === "object")
    { 
        module.exports = factory;
    }
	else if (typeof define === "function")  // AMD/CMD/Sea.js
    {
		if (define.amd) { // for Require.js

			define(["editormd"], function(editormd) {
                factory(editormd);
            });

		} else { // for Sea.js
			define(function(require) {
                var editormd = require("../editormd");
                factory(editormd);
            });
		}
	} 
	else
	{
        factory(window.editormd);
	}
    
})();
