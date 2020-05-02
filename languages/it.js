(function(){
    var factory = function (exports) {
        var lang = {
            name : "it",
            description : "Editor Markdown Open Source.",
            tocTitle    : "Sommario",
            toolbar : {
                undo             : "Annulla(Ctrl+Z)",
                redo             : "Riapplica(Ctrl+Y)",
                bold             : "Grassetto",
                del              : "Sbarrato",
                italic           : "Italico",
                quote            : "Quotato",
                ucwords          : "Converti a prima lettera miuscola resto minuscolo",
                uppercase        : "Converti a tutto maiuscolo",
                lowercase        : "Converti a tutto minuscolo",
                h1               : "Titolo 1",
                h2               : "Titolo 2",
                h3               : "Titolo 3",
                h4               : "Titolo 4",
                h5               : "Titolo 5",
                h6               : "Titolo 6",
                "list-ul"        : "Lista",
                "list-ol"        : "Lista numerica",
                hr               : "Linea orizzontale",
                link             : "Link",
                "reference-link" : "Ancora",
                image            : "Immagine",
                code             : "Codice in linea",
                "preformatted-text" : "Testo pre-formattato / Blocco di codice sorgente (indentazione con Tab)",
                "code-block"     : "Blocco di codice sorgente (Linguaggi multipli)",
                table            : "Tabella",
                datetime         : "Data ora",
                emoji            : "Emoji",
                "html-entities"  : "Entità HTML",
                pagebreak        : "Interruzione di pagina",
                watch            : "Disattiva anteprima",
                unwatch          : "Attiva anteprima",
                preview          : "Anteprima HTML (Per uscire premi Shif+ESC)",
                fullscreen       : "Schermo intero (Per uscire premi ESC)",
                clear            : "Cancella",
                search           : "Cerca",
                help             : "Aiuto",
                info             : "Informazioni " + exports.title
            },
            buttons : {
                enter  : "Salva",
                cancel : "Annulla",
                close  : "Chiudi"
            },
            dialog : {
                link : {
                    title    : "Link",
                    url      : "Indirizzo",
                    urlTitle : "Titolo",
                    urlEmpty : "Errore: per favore inserisci l'indirizzo del link."
                },
                referenceLink : {
                    title    : "Ancora",
                    name     : "Nome",
                    url      : "Indirizzo",
                    urlId    : "ID",
                    urlTitle : "Titolo",
                    nameEmpty: "Errore: il riferimento non può essere vuoto.",
                    idEmpty  : "Errore: per favore inserisci l'ID del riferimento del link.",
                    urlEmpty : "Errore: per favore inserisci l'indirizzo del link."
                },
                image : {
                    title    : "Immagine",
                    url      : "Indirizzo",
                    link     : "Link",
                    alt      : "Titolo",
                    uploadButton     : "Upload",
                    imageURLEmpty    : "Errore: l'url dell'immagine non può essere vuoto.",
                    uploadFileEmpty  : "Errore: le immagini caricate non possono essere vuote!",
                    formatNotAllowed : "Errore: è supportato unicamente il caricamento di file immagine, i formati di file immagine supportati sono:"
                },
                preformattedText : {
                    title             : "Testo pre-formattato / Codice",
                    emptyAlert        : "Errore: perfavore inserisci il testo pre-formtatto o il codice sorgente.",
                    placeholder       : "scrivi qui il codice sorgente...."
                },
                codeBlock : {
                    title             : "Blocco di codice sorgente",
                    selectLabel       : "Linguaggi: ",
                    selectDefaultText : "scegli un liguaggio...",
                    otherLanguage     : "Altri liguaggi",
                    unselectedLanguageAlert : "Errore: perfavore scegli un linguaggio.",
                    codeEmptyAlert    : "Error: perfavore inserisci il codice sorgente.",
                    placeholder       : "scrivi qui il codice sorgente...."
                },
                htmlEntities : {
                    title : "Entità HTML"
                },
                help : {
                    title : "Aiuto"
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