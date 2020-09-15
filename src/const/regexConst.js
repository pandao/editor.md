const regexConst = {
    atLink        : /@(\w+)/g,
    email         : /(\w+)@(\w+)\.(\w+)\.?(\w+)?/g,
    emailLink     : /(mailto:)?([\w\.\_]+)@(\w+)\.(\w+)\.?(\w+)?/g,
    emoji         : /:([\w\+-]+):/g,
    emojiDatetime : /(\d{1,2}:\d{1,2}:\d{1,2})/g,
    twemoji       : /:(tw-([\w]+)-?(\w+)?):/g,
    fontAwesome   : /:(fa-([\w]+)(-(\w+)){0,}):/g,
    editormdLogo  : /:(editormd-logo-?(\w+)?):/g,
    pageBreak     : /^\[[=]{8,}\]$/
};