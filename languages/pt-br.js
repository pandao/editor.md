(function(){
    var factory = function (exports) {
        var lang = {
            name : "pt-br",
            description : "Editor Markdown online de código aberto.",
            tocTitle    : "Índice",
            toolbar : {
                undo             : "Desfazer(Ctrl+Z)",
                redo             : "Refazer(Ctrl+Y)",
                bold             : "Negrito",
                del              : "Riscar",
                italic           : "Italico",
                quote            : "Citação",
                ucwords          : "Primeira letra maiúscula",
                uppercase        : "Selecione o texto para converter em maiúsculo",
                lowercase        : "Selecione o texto para converter em minúsculo",
                h1               : "Cabeçalho 1",
                h2               : "Cabeçalho 2",
                h3               : "Cabeçalho 3",
                h4               : "Cabeçalho 4",
                h5               : "Cabeçalho 5",
                h6               : "Cabeçalho 6",
                "list-ul"        : "Lista desordenada",
                "list-ol"        : "Lista ordenada",
                hr               : "Linha horizontal",
                link             : "Link",
                "reference-link" : "Link de referência",
                image            : "Imagem",
                code             : "Código embutido",
                "preformatted-text" : "Texto pré-formatado / Bloco de código (identado)",
                "code-block"     : "Bloco de código (Multi-linguagens)",
                table            : "Tabelas",
                datetime         : "Data e hora",
                emoji            : "Emoji",
                "html-entities"  : "Símbolos HTML",
                pagebreak        : "Quebra de página",
                watch            : "Fechar pré-visualização",
                unwatch          : "Abrir pré-visualização",
                preview          : "Pré-visualizar HTML (Aperte Shift + ESC para sair)",
                fullscreen       : "Tela cheia (Aperte ESC para sair)",
                clear            : "Limpar",
                search           : "Localizar",
                help             : "Ajuda",
                info             : "Sobre " + exports.title
            },
            buttons : {
                enter  : "Enter",
                cancel : "Cancelar",
                close  : "Fechar"
            },
            dialog : {
                link : {
                    title    : "Link",
                    url      : "URL",
                    urlTitle : "Mensagem",
                    urlEmpty : "Erro: por favor, adicione uma URL."
                },
                referenceLink : {
                    title    : "Link de referência",
                    name     : "Nome",
                    url      : "URL",
                    urlId    : "ID",
                    urlTitle : "Mensagem",
                    nameEmpty: "Erro: O nome não pode estar em branco.",
                    idEmpty  : "Erro: Adicione um id para a referência.",
                    urlEmpty : "Erro: por favor, adicione uma URL."
                },
                image : {
                    title    : "Imagem",
                    url      : "URL",
                    link     : "Link",
                    alt      : "Texto alternativo",
                    uploadButton     : "Enviar",
                    imageURLEmpty    : "Erro: a URL da imagem não pode estar em branco.",
                    uploadFileEmpty  : "Erro: a imagem não pode estar vazia!",
                    formatNotAllowed : "Erro: somente é permitido o envio das imagens dos seguintes formatos:"
                },
                preformattedText : {
                    title             : "Texto pré-formatado / Códigos", 
                    emptyAlert        : "Erro: Por favor, insira um texto pré formatado ou um código.",
                    placeholder       : "escreva seu código...."
                },
                codeBlock : {
                    title             : "Bloco de código",         
                    selectLabel       : "Linguagens: ",
                    selectDefaultText : "selecione a linguagem do código...",
                    otherLanguage     : "Outras linguagens",
                    unselectedLanguageAlert : "Erro: Por favor selecione uma linguagem.",
                    codeEmptyAlert    : "Erro: Por favor insira um código válido.",
                    placeholder       : "escreva seu código...."
                },
                htmlEntities : {
                    title : "Símbolos HTML"
                },
                help : {
                    title : "Ajuda"
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
