(function(){
    var factory = function (exports) {
        var lang = {
            name : "de",
            description : "Quelloffener Online-Editor für Markdown.",
            tocTitle    : "Inhaltsverzeichnis",
            toolbar : {
                undo             : "Rückgängig(Strg+Z)",
                redo             : "Wiederholen(Strg+Y)",
                bold             : "Fett",
                del              : "Durchgestrichen",
                italic           : "Kursiv",
                quote            : "Block Zitat",
                ucwords          : "Wörter mit erstem Buchstaben in Großbuchstaben umwandeln",
                uppercase        : "Auswahltext in Großbuchstaben umwandeln",
                lowercase        : "Auswahltext in Kleinbuchstaben umwandeln",
                h1               : "Überschrift 1",
                h2               : "Überschrift 2",
                h3               : "Überschrift 3",
                h4               : "Überschrift 4",
                h5               : "Überschrift 5",
                h6               : "Überschrift 6",
                "list-ul"        : "Ungeordnete Liste",
                "list-ol"        : "Geordnete Liste",
                hr               : "Horizontal rule",
                link             : "Link",
                "reference-link" : "Referenz-Link",
                image            : "Bild",
                code             : "Inline-Code",
                "preformatted-text" : "Vorformatierter Text / Codeblock (Tabulatoreinzug)",
                "code-block"     : "Codeblock (Mehrsprachig)",
                table            : "Tabellen",
                datetime         : "Datumsangabe",
                emoji            : "Emoji",
                "html-entities"  : "HTML-Elemente",
                pagebreak        : "Seitenwechsel",
                watch            : "Unbeobachten",
                unwatch          : "Beobachten",
                preview          : "HTML-Vorschau (Umschalttaste + ESC-Exit drücken)",
                fullscreen       : "Vollbild (drücke ESC zum Verlassen)",
                clear            : "Leeren",
                search           : "Suchen",
                help             : "Hilfe",
                info             : "Über " + exports.title
            },
            buttons : {
                enter  : "Eingabe",
                cancel : "Abbrechen",
                close  : "Schließen"
            },
            dialog : {
                link : {
                    title    : "Link",
                    url      : "Addresse",
                    urlTitle : "Titel",
                    urlEmpty : "Fehler: Bitte gib die Linkadresse ein."
                },
                referenceLink : {
                    title    : "Reference link",
                    name     : "Name",
                    url      : "Addresse",
                    urlId    : "ID",
                    urlTitle : "Titel",
                    nameEmpty: "Fehler: Der Referenzname kann nicht leer sein.",
                    idEmpty  : "Fehler: Bitte gib die Referenzlink-ID ein.",
                    urlEmpty : "Fehler: Bitte gib die Adresse des Referenzlinks ein."
                },
                image : {
                    title    : "Bild",
                    url      : "Addresse",
                    link     : "Link",
                    alt      : "Titel",
                    uploadButton     : "Hochladen",
                    imageURLEmpty    : "Fehler: Die Bildurl-Adresse kann nicht leer sein.",
                    uploadFileEmpty  : "Fehler: Bilder hochladen kann nicht leer sein!",
                    formatNotAllowed : "Fehler: erlaubt nur das Hochladen von Bilddateien, Upload erlaubtes Bilddateiformat:"
                },
                preformattedText : {
                    title             : "Vorformatierter Text / Codes", 
                    emptyAlert        : "Fehler: Bitte gib den vorformatierten Text oder den Inhalt der Codes ein.",
                    placeholder       : "Jetzt codieren...."
                },
                codeBlock : {
                    title             : "Code block",         
                    selectLabel       : "Languages: ",
                    selectDefaultText : "select a code language...",
                    otherLanguage     : "Other languages",
                    unselectedLanguageAlert : "Error: Please select the code language.",
                    codeEmptyAlert    : "Error: Please fill in the code content.",
                    placeholder       : "Jetzt codieren...."
                },
                htmlEntities : {
                    title : "HTML-Elemente"
                },
                help : {
                    title : "Hilfe"
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