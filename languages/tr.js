(function(){
    var factory = function (exports) {
        var lang = {
            name : "tr",
            description : "Açık kaynak çevrimiçi Markdown editörü.",
            tocTitle    : "İçindekiler",
            toolbar : {
                undo             : "Geri Al(Ctrl+Z)",
                redo             : "İleri Al(Ctrl+Y)",
                bold             : "Kalın",
                del              : "Üstü Çizili",
                italic           : "İtalik",
                quote            : "Alıntıyı Engelle",
                ucwords          : "Kelimelerde ilk harfi büyük harfe dönüştür",
                uppercase        : "Seçilen metni büyük harflere dönüştür",
                lowercase        : "Seçilen metni küçük harflere dönüştür",
                h1               : "Başlık 1",
                h2               : "Başlık 2",
                h3               : "Başlık 3",
                h4               : "Başlık 4",
                h5               : "Başlık 5",
                h6               : "Başlık 6",
                "list-ul"        : "Sırasız Liste",
                "list-ol"        : "Sıralı Liste",
                hr               : "Yatay Çizgi",
                link             : "Bağlantı",
                "reference-link" : "Referans Bağlantı",
                image            : "Resim",
                code             : "Satır İçi Kod",
                "preformatted-text" : "Önceden biçimlendirilmiş metin / Kod bloğu (Sekme girintisi)",
                "code-block"     : "Kod bloğu (Çoklu dil)",
                table            : "Tablolar",
                datetime         : "Tarih saat",
                emoji            : "Emoji",
                "html-entities"  : "HTML Varlıkları",
                pagebreak        : "Sayfa sonu",
                watch            : "İzleme",
                unwatch          : "İzle",
                preview          : "HTML Önizleme (Çıkmak için Shift + ESC basın.)",
                fullscreen       : "Tam ekran (Çıkmak için ESC basın.)",
                clear            : "Temizle",
                search           : "Ara",
                help             : "Yardım",
                info             : "Hakkında " + exports.title
            },
            buttons : {
                enter  : "Giriş",
                cancel : "Vazgeç",
                close  : "Kapat"
            },
            dialog : {
                link : {
                    title    : "Bağlantı",
                    url      : "Adres",
                    urlTitle : "Başlık",
                    urlEmpty : "Hata: Lütfen bağlantı adresini doldurun."
                },
                referenceLink : {
                    title    : "Referans Bağlantısı",
                    name     : "Ad",
                    url      : "Adres",
                    urlId    : "ID",
                    urlTitle : "Başlık",
                    nameEmpty: "Hata: Referans adı boş olamaz.",
                    idEmpty  : "Hata: Lütfen referans bağlantı kimliğini doldurun.",
                    urlEmpty : "Hata: Lütfen referans bağlantı URL adresini girin."
                },
                image : {
                    title    : "Resim",
                    url      : "Adres",
                    link     : "Bağlantı",
                    alt      : "Başlık",
                    uploadButton     : "Upload",
                    imageURLEmpty    : "Hata: resim URL adresi boş olamaz.",
                    uploadFileEmpty  : "Hata: resim yükleme alanı boş olamaz!",
                    formatNotAllowed : "Hata: sadece resim dosyası yüklemenize izin verir, izin verilen resim dosyası formatını yükleyin:"
                },
                preformattedText : {
                    title             : "Önceden biçimlendirilmiş metin / Kodlar", 
                    emptyAlert        : "Hata: Lütfen önceden biçimlendirilmiş metni veya kodların içeriğini doldurun.",
                    placeholder       : "şimdi yazın...."
                },
                codeBlock : {
                    title             : "Kod bloğu",         
                    selectLabel       : "Diller: ",
                    selectDefaultText : "bir kod dili seçin...",
                    otherLanguage     : "Diğer diller",
                    unselectedLanguageAlert : "Hata: Lütfen kod dilini seçin.",
                    codeEmptyAlert    : "Hata: Lütfen kod içeriğini doldurun.",
                    placeholder       : "şimdi yazın...."
                },
                htmlEntities : {
                    title : "HTML Varlıkları"
                },
                help : {
                    title : "Yardım"
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
