(function(){
    var factory = function (exports) {
        var lang = {
            name : "de",
            description : "Markdown Editor",
            tocTitle    : "Inhaltsverzeichnis",
            toolbar : {
                undo             : "Rückgängig machen (Ctrl+Z)",
                redo             : "Wiederherstellen (Ctrl+Y)",
                bold             : "Fett",
                del              : "Druchgestrichen",
                italic           : "Kurisv",
                quote            : "Zitat",
                ucwords          : "Anfangsbuchstaben in Großbuchstaben umwandeln",
                uppercase        : "Ausgewählter Text in Großbuchstaben umwandeln",
                lowercase        : "Ausgewählter Text in Kleinbuchstaben umwandeln",
                h1               : "Überschrift h1",
                h2               : "Überschrift h2",
                h3               : "Überschrift h3",
                h4               : "Überschrift h4",
                h5               : "Überschrift h5",
                h6               : "Überschrift h6",
                "list-ul"        : "Aufzählung",
                "list-ol"        : "Nummerierung",
                hr               : "Horizontale Linie",
                link             : "Link Verknüpfung einfügen",
                "reference-link" : "Anker Link einfügen",
                image            : "Bild als Verknüpfung einfügen",
                code             : "Text ohne Formatierung einfügen",
                "preformatted-text" : "Vorvormatierter Text",
                "code-block"     : "Quelltext (Programmiersprachen)",
                datetime         : "Datum/Uhrzeit einfügen",
                emoji            : "Emoji hinzufügen",
                "html-entities"  : "HTML Sonderzeichen hinzufügen",
                pagebreak        : "Seitenumbruch",
                "goto-line"      : "Gehe zu Zeile",
                table            : "Tabelle einfügen",
                watch            : "Vorschau ausschalten",
                unwatch          : "Vorschau einschalten",
                preview          : "HTML Vorschau (Drücke Shift + ESC um zu beenden)",
                fullscreen       : "Vollbildschirm (Drücke ESC um zu beenden)",
                clear            : "Alles löschen",
                search           : "Suche",
                help             : "Hilfe",
                info             : "Über " + exports.title
            },
            buttons : {
                enter  : "Bestätigen",
                cancel : "Abbrechen",
                close  : "Beenden"
            },
            dialog : {
                link : {
                    title    : "Verknüpfung anlegen",
                    url      : "Adresse",
                    urlTitle : "Titel",
                    urlEmpty : "Fehler: Bitte gebe eine gültige URL Adresse an."
                },
                referenceLink : {
                    title    : "Anker Link",
                    name     : "Name",
                    url      : "Adresse",
                    urlId    : "ID",
                    urlTitle : "Titel",
                    nameEmpty: "Fehler: Ein Anker Name muss eingetragen werden.",
                    idEmpty  : "Fehler: Bitte setze eine Sprungzielmarke (ID).",
                    urlEmpty : "Fehler: Bitte gebe einen gültigen Refenzlink an."
                },
                image : {
                    title    : "Bild hinzufügen",
                    url      : "Adresse",
                    link     : "Link",
                    alt      : "Titel",
                    uploadButton     : "Upload",
                    imageURLEmpty    : "Fehler: Eine Bildadresse muss angegeben werden.",
                    uploadFileEmpty  : "Fehler: Es wurde keine Verknüpfung zu einem Bild angegeben!",
                    formatNotAllowed : "Fehler: Es werden nur gültige Bilddateiformate erlaubt:"
                },
                preformattedText : {
                    title             : "Vorvormatierter Text mit Tabulatoreinzug hinzufügen",
                    emptyAlert        : "Fehler: Bitte füge deinen Quelltext ein.",
                    placeholder       : "Quelltext hier einfügen..."
                },
                codeBlock : {
                    title             : "Quelltext mit Tabulatoreinzug hinzufügen",
                    selectLabel       : "Sprachen: ",
                    selectDefaultText : "Wähle eine Sprache aus",
                    otherLanguage     : "andere Sprachen",
                    unselectedLanguageAlert : "Fehler: Bitte wähle eine Sprache aus.",
                    codeEmptyAlert    : "Fehler: Bitte füge deinen Quelltext ein.",
                    placeholder       : "Quelltext hier einfügen..."
                },
                htmlEntities : {
                    title : "HTML Sonderzeichen hinzufügen"
                },
                help : {
                    title : "Hilfe"
                },
                table : {
                    title      : "Tabelle",
                    cellsLabel : "Zellen",
                    alignLabel : "Ausrichtung",
                    rows       : "Reihen",
                    cols       : "Spalten",
                    aligns     : ["Default", "Linksbündig", "Mittig ausgerichtet", "Rechtsbündig"]
               },
               emoji : {
                    title : "Emoji"
               },
               "goto-line" : {
                   title  : "Gehe zu Zeile",
                   label  : "Gebe eine Zeilennummer ein.",
                   error  : "Fehler: keine Zeilennummer angegeben"
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
