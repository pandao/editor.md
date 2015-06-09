## 更新日志

### v1.0.x

##### v1.0.0 beta

预览版：基本功能完成；

##### v1.0.0 releases

发布 v1.0.0 正式版。

主要更新：

- 新建分支 `mathjax-version`，但不打算继续对此分支进行开发；

- 移除 MathJax，改用 KaTeX [#2](https://github.com/pandao/editor.md/issues/2)，解析和预览响应速度大幅度提高 [#3](https://github.com/pandao/editor.md/issues/3)；
    - 移除 `mathjax` 配置项；
    - 移除 `mathjaxURL` 属性；
    - 移除 `setMathJaxConfig()` 方法；
    - 移除 `loadMathJax()` 方法；
    - 移除MathJax的所有示例；
    - 新增 `tex` 配置项，表示是否开启支持科学公式 TeX ，基于 KaTeX；
    - 新增 `katexURL` 属性；
    - 新增 `loadKaTeX` 方法；
    - 新增 KaTeX 的示例；
    
- `setCodeEditor()` 方法更名为 `setCodeMirror()`；

- 合并 CodeMirror 使用到的多个 JS 模块文件，大幅减少 HTTP 请求，加快下载速度；
    - 新增合并后的两个模块文件：`./lib/codemirror/modes.min.js`、`./lib/codemirror/addons.min.js` ；
    - `Gulpfile.js` 新增合并 CodeMirror 模块文件的任务方法 `codemirror-mode` 和 `codemirror-addon` ；
    - 另外在使用 Require.js 时，因为 CodeMirror 的严格模块依赖的限制，不能使用上述合并的模块文件，仍然采用动态加载多个模块文件；
    
- 更新 `README.md` 等相关文档和示例；

- 解决 Sea.js 环境下 Raphael.js 无法运行导致不支持流程图和时序图的问题，即必须先加载 Raphael.js ，后加载 Sea.js ；

### v1.1.x

##### v1.1.0

主要更新：

- 设计并更换了 Logo；
- 新增添加图片、链接、锚点链接、代码块、预格式文本等操作弹出对话框层及示例；
- 新增支持图片(跨域)上传；
- 改用 `<textarea>` 来存放 Markdown 源文档；
- 新增支持自定义工具栏；
- 新增支持多语言；
- 新增支持 Zepto.js；
- 新增支持多个 Editor.md 并存和动态加载 Editor.md 及示例；
- 新增支持智能识别和解析 HTML 标签及示例；
- 新增多个外部操作方法接口及示例；
- 修复了一些大大小小的 Bug；

具体更新如下：

- 更换 Logo，建立基础 VI；
    - 创建了全系列 WebFont 字体 `dist/fonts/editormd-logo.*` ；
    - 新增样式类 `editormd-logo` 等；

- 改用 `<textarea>` 来存放 Markdown 源文档；
    - 原先使用 `<script type="text/markdown"></script>` 来存放 Markdown 源文档；
    - 创建 Editor.md 只需要写一个 `<div id="xxxx"></div>` ，如果没有添加 `class="editormd"` 属性会自动添加，另外如果不存在 `<textarea>` 标签，则也会自动添加 `<textarea>` ；

- 新增支持智能识别和解析 HTML 标签，增强了 Markdown 语法的扩展性，几乎无限，例如：插入视频等等；
    - 新增配置项 `htmlDecode` ，表示是否开启 HTML 标签识别和解析，但是为了安全性，默认不开启；
    - 新增识别和解析 HTML 标签的示例；
    
- 新增插入链接、锚点链接、预格式文本和代码块的弹出对话框层；
    - 弹出层改为使用固定定位；
    - 新增动态创建对话框的方法 `createDialog()`；
    - 新增静态属性 `editormd.codeLanguages` ，用于存放代码语言列表；

- 开始支持图片上传；
    - 新增添加图片（上传）弹出对话框层；
    - 支持基于 iframe 的跨域上传，并添加相应的示例（ PHP 版）；
    
- 开始支持自定义工具栏图标及操作处理；
    - 配置项 `toolbarIcons` 类型由数组更改为函数，返回一个图标按钮列表数组；
    - 新增配置项 `toolbarHandlers` 和 `toolbarIconsTexts` ，分别用于自定义按钮操作处理和按钮内容文本；
    - 新增方法 `getToolbarHandles()` ，用于可在外部使用默认的操作方法；
    - 新增成员属性 `activeIcon` ，可获取当前或上次点击的工具栏图标的 jQuery 实例对象；
    
- 新增表单取值、自定义工具栏、图片上传、多个 Editor.md 并存和动态加载 Editor.md 等多个示例；

- 新增插入锚点按钮和操作处理；

- 新增预览 HTML 内容窗口的关闭按钮，之前只能按 ESC 才能退出 HTML 全窗口预览；

- 新增多语言（ l18n ）及动态加载语言包支持；
    - 新增英语 `en` 和繁体中文 `zh-tw` 语言包模块；
    - 修改一些方法的内部实现以支持动态语言加载:
        - `toolbarHandler()` 更为 `setToolbarHandler()` ；
        - `setToolbar()` 方法包含 `setToolbarHandler()` ；
        - 新建 `createInfoDialog()` 方法；
	    - 修改 `showInfoDialog()` 和 `hideInfoDialog()` 方法的内部实现等；

- 修改多次 Bug ，并优化触摸事件，改进对 iPad 的支持；

- 工具栏新增清空按钮和清空方法 `clear()` ，解决工具栏文本会被选中出现蓝底的问题;

- 配置项 `tocStartLevel` 的默认值由 2 改为 1，表示默认从 H1 开始生成 ToC；

- 解决 IE8 下加载出错的问题；
    - 新增两个静态成员属性 `isIE` 和 `isIE8` ，用于判断 IE8；
    - 由于 IE8 不支持 FlowChart 和 SequenceDiagram，默认在 IE8 下不加载这两个组件，无论是否开启；

- 新增 Zepto.js 的支持；
	- 为了兼容 Zepto.js ，某些元素在操作处理上不再使用 `outerWidth()` 、 `outerHeight()` 、`hover()` 、`is()` 等方法；
	- 为了避免修改 flowChart.js 和 sequence-diagram.js 的源码，所以想支持 flowChart 或 sequenceDiagram 得加上这一句： `var jQuery = Zepto;`；

- 新增 `editormd.$name` 属性，修改 `editormd.homePage` 属性的新地址；

- `editormd.markdownToHTML()` 新增方法返回一个 jQuery 实例对象；
    - 该实例对象定义了一个 `getMarkdown()`方法，用于获取 Markdown 源代码；
    - 该实例对象定义了一个 `tocContainer` 成员属性，即 ToC 列表的父层的 jQuery 实例对象；

- 新增只读模式；
    - 新增配置项 `readOnly` ，默认值为 `false` ，即可编辑模式；
    - 其他相关改动；

- 新增方法 `focus()` 、 `setCursor()` 、 `getCursor()` 、`setSelection()` 、`getSelection()` 、 `replaceSelection()` 和 `insertValue()` 方法，并增加对应的示例；

- 新增配置项 `saveHTMLToTextarea` ，用于将解析后的 HTML 保存到 Textarea，以供提交到后台程序；
    - `getHTML()` 方法必须在 `saveHTMLToTextarea == true` 的情况下才能使用；
    - 新增 `getHTML()` 方法的别名 `getTextareaSavedHTML()` 方法；
    - 新增方法 `getPreviewedHTML()` ，用于获取预览窗口的 HTML ；

- 修复了一些大大小小的 Bugs；

##### v1.1.1

- 接受一个 pull 请求，修复了 `getHTML ()` 和 `getPreviewedHTML()` 方法中的 ３ 处错误；

##### v1.1.2

- 修复 Bug [＃10](https://github.com/pandao/editor.md/issues/10)；
- 修复 Bug [＃12](https://github.com/pandao/editor.md/issues/12)；

##### v1.1.3

- 修复 Bug [＃14](https://github.com/pandao/editor.md/issues/14)；
- 修复 Bug [＃15](https://github.com/pandao/editor.md/issues/15)；

##### v1.1.4

- 修复 Bug [＃17](https://github.com/pandao/editor.md/issues/17)；
    - 修改了 `getToolbarHandles()` 和 `setToolbarHandler()` 方法；
- 从 `editormd.scss` 中分离出 `editormd.logo.scss` ，并生成 `editormd.logo.css` ，以便单独使用；
    - 同时修改了 `Gulpfile.js` 的相应任务；
    
##### v1.1.5

- 修复 Bug [＃18](https://github.com/pandao/editor.md/issues/18)；
    - 修改了 `showInfoDialog()` 和 `createInfoDialog()` 方法；
    - 新增 `infoDialogPosition()` 方法；
    
- 修复 Bug [＃20](https://github.com/pandao/editor.md/issues/20)；
    - 修改了引用的处理函数；
    - 插入的 headers 的 `#` 号后面都加上了一个空格；

##### v1.1.6

修复多处 Bug，具体如下：
    
- 修复 Bug [#23](https://github.com/pandao/editor.md/issues/23)，即 Headers 的 id 属性的重复及中文问题；
    - 修改了 `editormd.markedRenderer()` 方法；

- 修复 Bug [#24](https://github.com/pandao/editor.md/issues/24)；
    - 修改了 `setMarkdown()` 、 `clear()` 和 `loadedDisplay()` 方法的内部实现；
    - 新增了 `katexRender()` 、 `flowChartAndSequenceDiagramRender()` 、 `previewCodeHighlight()` 方法；
    
- 修复有些情况下无法保存 Markdown 源文档到 textarea 的问题；
    - 修改了 `setCodeMirror()` 、 `recreateEditor()` 等方法；

- 修改了以上 Bug 及部分相关示例文件；

##### v1.1.7

修复多处 Bug，具体如下：

- 修复 Bug [#25](https://github.com/pandao/editor.md/issues/25)；
    - 修改了 `loadedDisplay()` 方法，将 `settings.onload` 移动了 `CodeMirror.on("change")` 事件注册后再触发；

- 修复 Bug [#26](https://github.com/pandao/editor.md/issues/26)；
    - 修改了 `saveToTextareas()` 方法；
    - 新增 `state.loaded` 和 `state.watching` 两个属性；

- 修改了以上 Bug 相关示例文件；

##### v1.1.8

改进功能，具体如下：

- 改进 [#27](https://github.com/pandao/editor.md/issues/27)；
    - 新增配置项 `matchWordHighlight` ，可选值有： `true, false, "onselected"` ，默认值为 `true` ，即开启自动匹配和标示相同单词；

- 改进 [#28](https://github.com/pandao/editor.md/issues/28)；
    - 将 `jquery.min.js` 、 `font-awesome.min.css` 、 `github-markdown.css` 移除（这是一个疏忽，它们不是动态加载的依赖模块或者不需要的，避免不必要的硬盘空间占用）；

- 修改了所有相关的示例文件；

##### v1.1.9

- 修复无法解析 heading link 的 Bug [#29](https://github.com/pandao/editor.md/issues/29)；

    - 修改了 `editormd.markedRenderer()` 方法的内部实现；
    - 新增了 `editormd.trim()` ，用于清除字符串两边的空格；
    - 修改了所有相关的示例文件和测试用例 `marked-heading-link-test.html` ；
    
- 修改了 `README.md` ，添加了 `Shields.io` 图标；

### v1.2

##### v1.2.0

v1.2.0 主要更新：

- 新增代码折叠、搜索替换、自定义样式主题和自定义快捷键等功能；
- 新增 Emoji 表情、@Link 、GFM Task Lists 支持；
- 新增表格插入、Emoji 表情插入、HTML 实体字符插入、使用帮助等对话框；
- 新增插件扩展机制；
- 新增手动加载依赖模块方式；
- 改用 `Prefixes.css` 作 CSS 前缀预处理；
- 改进和增强工具栏自定义功能，完善事件监听和处理方法；
- 部分功能改进（更加方便的预格式文本/代码插入、自动闭合标签等）、新增多个方法、改进 Require.js 支持和修复多个 Bug 等等；

**具体更新如下：**

- 新建 v1.1.x 分支；
    - v1.2 文件结构变动较大；

- 新增代码折叠、自动闭合标签和搜索替换功能；
    - 搜索快捷键 `Ctrl + F / Command + F` ；
    - 替换快捷键 `Ctrl + Shift + F / Command + Option + F` ；
    - 折叠快捷键 `Ctrl + Q / Command + Q` ；

- 新增自定义主题支持；
    - 新增 3 个成员方法 `setTheme()` 、 `setCodeMirrorOption()` 和 `getCodeMirrorOption()` ；

- 新增 @Link 支持；

- 新增 GFM Task Lists 支持；

- 新增 Emoji 表情支持；
    - 支持 Github emoji `:emoji-name:` 、FontAwesome icons（`:fa-xxx:`）、Twitter emoji (twemoji) （ `:tw-xxxx:` ）、Editor.md logo icons（ `:editormd-logo:` ）形式的 Emoji；
    - 新增属性 `editormd.emoji` 、 `editormd.twemoji` 、 `editormd.urls` 和 `editormd.regex`；
    
- 新增 HTML 实体字符插入、插入表格和使用帮助对话框；
    - 修改了 `createDialog()` 等方法；
    - 新增 `mask` 成员属性和锁屏方法 `editormd.lockScreen()` 、 `editormd.fn.lockScreen()` ；

- 改进插入预格式文本和代码对话框；
    - 将 `<textarea>` 改为 `CodeMirror` ，输入更加方便和直观；

- 新增自定义键盘快捷键功能；
    - 新增 2 个方法： `addKeyMap()` 和 `removeKayMap()`；

- 改用 `Prefixes.css` 作CSS前缀预处理；
    - SCSS前缀预处理mixins改用 [Prefixes.scss](https://github.com/pandao/prefixes.scss "Prefixes.scss")；

- 改进和增强工具栏自定义功能；
	- 新增配置项 `toolbarCustomIcons` ，用于增加自定义工具栏的功能，可以直接插入 HTML 标签，不使用默认的元素创建图标；
    - 新增工具栏列表预设值属性 `editormd.toolbarModes` ；
    - 移除成员属性 `toolbarIconHandlers` ；

- 完善和新增事件处理方法；
	- 新增事件回调注册方法 `on()` ；
	- 新增事件回调移除方法 `off()` ；
	- 新增事件回调处理配置项： `onresize` 、 `onscroll` 、`onpreviewscroll` 、 `onpreviewing` 、 `onpreviewed` 、`onwatch` 和 `onunwatch` ；

- 新增手动加载依赖模块方式，以便可同步使用成员方法；
    - 新增属性 `autoLoadModules` ，默认值为 `true` ；

- 新增插件及扩展机制；
    
    - 新增插件自定义机制，改变整体结构(包括文件结构)，以便更加方便地实现插件扩展；
	- 新增对象扩展方法 `extends()` 、 `set()` ；

- 新增成员方法和属性：

    - 新增两个方法： `setValue()` 、`getValue()`；
	- 新增 `config()` 方法，用于加载后重新配置；
	- 增加两个属性 `cm` ，是 `codeEditor` 的简写， `cmElement` 是 `codeMirror` 的别名;

- 成员方法的改进：

	- 改进： `showToolbar()` 和 `hideToolbar()` 方法增加一个 `callback` 函数，用于直接回调操作；
	- 改进：修改了 `previewCodeHighlight()` 方法；
	- 更名： `recreateEditor()` 更名为 `recreate()` ；
    - 移除 `setMarked()` 方法；
    
- 新增 HTML 标签解析过滤机制；
    - 通过设置 `settings.htmlDecode = "style,script,iframe"` 来实现过滤指定标签的解析；

- 改进 Require.js 支持；
    - 修复 Require.js 下 CodeMirror 编辑器的代码无法高亮的问题；
    - 更新 `underscore` 版本至 `1.8.2` ；
    - 移除 `editormd.requirejsInit()` 和 `editormd.requireModules()` 方法；
    - 新增 `Require.js/AMD` 专用版本文件 `editormd.amd.js` ；
    - 新建 Gulp 任务 `amd` ；

- 修改和新增以上改进等相关示例；

### v1.3

#### v1.3.0

主要更新：

- 预设键盘快捷键处理（粗体等），插入 Markdown 更加方便；
- 更新 CodeMirror 版本为 `5.0` ；
- 更新 Marked 版本为 `0.3.3`；
- 新增自动高度和工具栏固定定位功能；
- 改进表格插入对话框；
- 工具栏新增三个按钮，分别是将所选文本首字母转成大写、转成小写、转成大写；
- 修改使用帮助文档；
- 修复多个 Bug；

具体更新如下：

- 新增常用键盘快捷键预设处理；
    - 新增属性 `editormd.keyMaps` ，预设一些常用操作，例如插入粗体等；
    - 新增成员方法 `registerKeyMaps()` ；
    - 退出HTML全屏预览快捷键更改为 `Shift + ESC`；
    - 新增配置项 `disabledKeyMaps` ，用于屏蔽一些快捷键操作；
- 更新 CodeMirror 版本为 `5.0`；
    - 修改无法输入 `/` 的问题；
- 更新 Marked 版本为 `0.3.3`；
- 新增自动高度和工具栏固定定位（滚动条拖动时）模式；
    - 新增配置项 `settings.autoHeight` ；
    - 新增配置项 `settings.toolbarAutoFixed` ；
    - 新增方法 `setToolbarAutoFixed(true|false)` ；
- 新增邮箱地址自动添加链接功能；
    - 新增配置项 `emailLink` ，默认为 `true` ; 
- 改进表格插入对话框；
- 工具栏新增三个按钮，分别是将所选文本首字母转成大写、转成小写、转成大写；
    - 新增方法 `editormd.ucwords()` ，别名 `editormd.wordsFirstUpperCase()` ；
    - 新增方法 `editormd.ucfirst()` ，别名 `editormd.firstUpperCase()` ；
    - 新增两个成员方法 `getSelections()` 和 `getSelections()` ；

- 修复 Font awesome 图标 emoji 部分无法解析的 Bug，[#39](https://github.com/pandao/editor.md/issues/39)
- 改进 @link 功能 [#40](https://github.com/pandao/editor.md/issues/40)；
    - 新增配置项 `atLink` ，默认为 `true` ; 
- 修复无法输入 `/` 的问题 [#42](https://github.com/pandao/editor.md/issues/42)；
- 修改使用帮助说明的错误 [#43](https://github.com/pandao/editor.md/issues/43)；
- 新增配置项 `pluginPath`，默认为空时，等于 `settings.path + "../plugins/"` ；

### v1.4

#### v1.4.0

主要更新：

- 新增延迟解析机制，预览更即时；
- 新增跳转到指定行的功能和对话框；
- 新增 ToC 下拉菜单、自定义 ToC 容器的功能；
- 新增跳转到行、搜索的工具栏按钮；
- 新增支持插入和解析（打印）分页符；
- 改进快捷键功能和自动高度模式等；
- 改进：将锚点链接改名为引用链接；
- 改进编辑器重建和重配置功能；
- 修复多个 Bug；

具体更新：

- 新增延迟解析预览的机制，解决输入太多太快出现的 “延迟卡顿” 问题；
    - 新增配置项 `delay` ，默认值为 `300`；
    - 修复当输入速度太快时，解析Flowchart会抛出错误的问题；
- 修改 iPad 等移动终端的浏览器无法上传图片的问题 [#48](https://github.com/pandao/editor.md/issues/48)；
- 修复单独引用 `editormd.preview.css` 时无法显示 Font Awesome 和 Editor.md logo 字体的问题；
- 更新和修改 Gulp 构建；
    - 修改了 `Gulpfile.js` ，并且 `gulp-ruby-sass` 升级到最新版本 `1.0.0-alpha.3` ; 
    - 编辑 SCSS 时，不再生成 CSS 的 Source map 文件；
- 执行 jshint 和更正一些 JS 写法的不规范，精简了代码；
- 新增配置项 `appendMarkdown` 和 `appendMarkdown()` 方法，用于(初始化前后)追加 Markdown 到 Textarea ；
- 改进部分预设快捷键功能，包括 F9 (watch)、F10 (preview)、F11 (fullscreen)等;
- 修复自动高度模式下出现的几个问题；
    - 全屏退出时高度不正确的问题：修改了 `fullscreenExit()` 方法的内部实现；
    - 当解析预览后的 HTML 内容高度高于 Markdown 源码编辑器高度时，无法正确预览的问题 [#49](https://github.com/pandao/editor.md/issues/49)；
- 修改 `onscroll` 和 `onpreviewscroll` 无法访问 `this` 的问题；
- 修改 `init()` 方法，可以只设置一个参数；
- 新增插入 TeX (KaTeX) 公式的快捷键 `Ctrl + Shift + K` 和插入方法 `tex()` ；
- 将锚点链接改为引用链接，引用的链接改为插入到页尾；
    - 工具栏的名称 `anchor` 改为 `reference-link`；
    - 工具栏的名称 `htmlEntities` 改名为 `html-entities`；
- 改进编辑器重建和重配置功能；
    - 修改了 `loadedDisplay()` 方法；
    - 修改了 `config()` 和 `recreate()` 方法；
- 新增跳转到指定行的功能；
    - 新增方法 `gotoLine()` ；
    - 新增跳转到行对话框插件 `goto-line-dialog` ；
    - 新增快捷键 `Ctrl + Alt + G` ；
    - 改进 `executePlugin()` 方法；
    - 修改了 `help-dialog/help.md` ；
- 新增搜索工具栏按钮；
    - 新增方法 `search()` 、`searchReplace()` 和 `searchReplaceAll()` ；
    - 原全屏预览 HTML 按钮的图标改为 `fa-desktop`；
    - 改为默认开启搜索替换功能；
- 更换了关于 Editor.md 的标语（ slogan ）；
- 标题按钮 `h` 改为大写的 `H`；
- `saveToTextareas()` 方法更名为 `save()`；
- 新增 ToC 下拉菜单、自定义 ToC 容器的功能；
    - 新增 Markdown 扩展语法 `[TOCM]` ，自动生成 ToC 下拉菜单；
    - 新增配置项 `tocm` ，默认为 `true`，即可以使用 `[TOCM]` ；
    - 新增配置项 `tocDropdown` 和 `tocTitle` ；
    - 新增方法 `editormd.tocDropdownMenu()` ；
    - 新增配置项 `tocContainer` ，值为 jQuery 选择器，默认为空；
- 修改了配置项 `placeholder` 的默认值；
- 改进对 IE8 的兼容支持；
- 修复 Firefox 下因为 `Object.watch()` 而出现的问题；
- 新增支持插入和解析（打印）分页符；
    - 新增配置项 `pageBreak` ，默认值为 `true`；
    - 新增语法 `[========]` ，即括号内至少 8 个等号；
    - 新增插入分页符的工具栏图标和方法 `pagebreak()` ；
    - 新增插入分页符的快捷键 `Shift + Alt + P`；
- 修复一些 Bug，包括 [#51](https://github.com/pandao/editor.md/issues/51) 等；
- 新增和修改以上更新的相关示例；

#### v1.4.1

- 新增配置项 `syncScrolling`，即是否开启同步滚动预览，默认值为 `false` ； 
- 修复 Bug [＃64](https://github.com/pandao/editor.md/issues/64)；
    - 更新 `editormd.katexURL` 资源地址的默认值，即更新版本为 `0.3.0` ； 
    - 新增测试用例`tests/katex-tests.html`；
    - 修改示例文件`examples/katex.html`； 
- 修复 Bug [＃66](https://github.com/pandao/editor.md/issues/66)；
- 修复编辑器工具栏按钮 `:hover` CSS3 transition 无效的问题； 
- 修改了 `README.md`；

#### v1.4.2

- 改进和增强自定义工具栏功能，支持图标按钮右对齐 [#69](https://github.com/pandao/editor.md/issues/69)；
- 改进和增强 HTML 标签的解析过滤功能，支持过滤指定的属性等 [#70](https://github.com/pandao/editor.md/issues/70)；
- 删除分支 `mathjax-version` 和 `v1.1.9`；

#### v1.4.3

- 改进：可配置是否自动聚焦编辑器 [#74](https://github.com/pandao/editor.md/issues/74)；
	- 新增配置项 `autoFocus`，默认值为 `true`; 
- 修复 Bug [#77](https://github.com/pandao/editor.md/issues/77)；
- 改进：帮助对话框里的链接改为新窗口打开，避免直接跳转到链接，导致编辑内容丢失的问题 [#79](https://github.com/pandao/editor.md/issues/79)；
- 改进和完善编辑器配置项；
	- 新增配置项 `tabSize`、`indentUnit` 和 `lineWrapping`；
	- 新增配置项 `autoCloseBrackets` 和 `showTrailingSpace` ；
	- 新增配置项 `matchBrackets`、`indentWithTabs` 和 `styleSelectedText`；
- 改进：修改 CSS `font-family`，改进跨平台中英文字体显示；
- 修改了 `README.md`；

#### v1.4.4

- 修复 Bug [#81](https://github.com/pandao/editor.md/issues/81)，即不支持 `:+1:` 的问题；
- 修复 Bug [#85](https://github.com/pandao/editor.md/issues/85)，即图片上传返回结果不支持 `Content-Type=application/json` 的问题；
- 修复图片上传无法显示 loading 的问题；

#### v1.4.5

- 规范项目的中英文混排；
- 新增配置项 `name`，用于指定 Markdown textarea 的 `name="xxxx"` 属性；
- 修复 Bug，即无法正确解析公式的 `<` 和 `>` 的问题 [#87](https://github.com/pandao/editor.md/issues/87);
- 修复 Bug，即 `getHTML()` 无效的问题 [#95](https://github.com/pandao/editor.md/issues/95);
- 修复 Bug，即火狐上传图片后无法返回值的问题 [#96](https://github.com/pandao/editor.md/issues/96);
    - 修改了图片上传插件；
    - 修改 PHP 上传类及示例；
- 方法更名：`extends()` 更名为 `extend()`，以兼容 IE8；
- 修复 IE8 下 Emoji 正则表达式字符集越界的问题；
- 更新了 `README.md` 和 `CHANGE.md` 等相关文档文件；


### v1.5

#### v1.5.0

主要更新：

- 新增：编辑器黑色主题 Dark，改进自定义主题功能（即工具栏、编辑区、预览区可分别设置主题样式）；
- 新增：多行公式支持；
- 新增：支持非编辑状态下的 ToC 自定义容器；
- 新增：支持设置为单向同步滚动；
- 改进：编辑器样式美化，更换了滚动条样式; 
- 改进：提高同步滚动定位的精确度；
- 改进：修复和改进 HTML 标签及属性过滤功能；
- 改进：修复在 Bootstrap 下的兼容性问题；
- 修复多处 Bug；

具体更新：

- 新增：解析后的代码块自动换行；

- 新增：支持多行公式；
    - 新增：新增语法：\`\`\`math | latex | katex；
    - 改进：美化 KaTeX 公式，即加大字号等；

- 新增：支持设置为单向同步滚动，即只是编辑区单向同步滚动，配置项 `syncScrolling : "single"`；
    - 新增：配置同步滚动示例文件 `sync-scrolling.html`；

- 新增：增加了编辑器样式主题 Dark，即工具栏和预览区各自有一个暗黑色主题；
    - 变更：自 `v1.5.0` 开始，配置项 `theme` 改为指定 Editor.md 本身的主题；
    - 新增配置项 `editorTheme` ，用于指定编辑区的主题，即 CodeMirror 的主题；
    - 新增配置项 `previewTheme` ，用于指定预览区的主题；
    - 新增方法 `setEditorTheme()`，别名： `setCodeMirror()`；
    - 新增方法 `setPreviewTheme()`；
    - 修改了方法 `setTheme()` ；
    - 更换了滚动条样式，Only Webkit；
    - 改进全屏状态下的样式显示，去掉 JS 操作的部分，改为通过 CSS 样式类 `.editormd-fullscreen` 控制；
    - 修改和增加相关的方法、SCSS 文件及示例文件 `themes.html`；

- 新增：非编辑状态下 ToC 自定义容器支持；
    - 新增配置项 `markdownSourceCode`，即解析后是否保留源码，默认为不保留 `false`；
    - 新增配置项 `tocContainer`，值为自定义 ToC 容器的 ID 选择器 `#xxxxx`，默认为空；
    - 新增和修改了相关示例文件；

- 新增：新增加了 CSS 样式类 `editormd-preview-active`，可以控制全屏HTML预览时的内容层样式；
    - 修改了 `previewing()` 和 `previewed()` 方法；
    - 相关 issues [#103](https://github.com/pandao/editor.md/issues/103)；
    - 另外也调整了关闭按钮的位置；

- 改进：修复插入 Emoji `:moon:` 无法显示的问题，修改为其是 `:waxing_gibbous_moon:` 的别名 [#94](https://github.com/pandao/editor.md/pull/94)；

- 改进：修改了 CodeMirror 代码行的左右内间距，使其不会挨着左边的行号层；
    - 相关 issues [#97](https://github.com/pandao/editor.md/issues/97)；

- 改进：修改了同步滚动的定位算法，提高精确度；
    - 修正问题 [#99](https://github.com/pandao/editor.md/issues/99)；
    - 修改了 `bindScrollEvent()` 方法；

- 改进：完善 HTML 标签过滤功能，即代码块、`<pre>` 预格式文本和行内代码里的标签及属性不会被过滤；
    - 修复 Bug [#105](https://github.com/pandao/editor.md/issues/105)；
- 改进：当不显示行号时 `settings.lineNumbers == false`，CodeMirror 行号层去掉右边框； 
- 改进：根据指针在当前行的位置更合理插入标题和水平线 [#104](https://github.com/pandao/editor.md/pull/104)；
- 改进：调整了字体，优先显示 `"YaHei Consolas Hybrid", Consolas`；
- 改进：修复在 Bootstrap 下的兼容性问题，即因为 box-sizing 写错位置导致的弹出层宽度等错位问题 [#107](https://github.com/pandao/editor.md/issues/107)；