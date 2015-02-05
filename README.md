# Editor.md

A simple online markdown editor.

**Editor.md** 是一个基于jQuery和CodeMirror构建的在线Markdown文档编辑器。

![editormd-screenshot](https://pandao.github.io/editor.md/examples/images/editormd-screenshot.png "editormd-screenshot")

####主要特性

- 支持Markdown标准和Github风格；
- 支持实时预览和多语言语法高亮；
- 支持AMD/CMD模块化加载（支持 [Require.js](https://pandao.github.io/editor.md/examples/use-requirejs.html) & [Sea.js](https://pandao.github.io/editor.md/examples/use-seajs.html)）；
- 兼容主流的浏览器（IE8+），且支持iPad等平板设备；
- 支持流程图 `flowchart` 和时序图 `sequenceDiagram`;

####在线演示

[https://pandao.github.io/editor.md/examples/index.html](https://pandao.github.io/editor.md/examples/index.html)

####下载和安装

通过Github下载安装，或者通过bower安装：

	bower install editor.md

####使用方法

HTML：

    <div class="editormd" id="test-editormd">
        <script type="text/markdown">###Hello world!</script>
    </div>

javascript:

    <link rel="stylesheet" href="../dist/css/editormd.css" />
    <script src="../lib/jquery.min.js"></script>
    <script src="../src/js/editormd.js"></script>
    <script type="text/javascript">
        $(function() {
            var testEditor = editormd("test-editormd", {
                    path : '../lib/'
                });
            });
		});
	</script>

> Require.js的使用方法：[https://github.com/pandao/editor.md/tree/master/examples/use-requirejs.html](https://github.com/pandao/editor.md/tree/master/examples/use-requirejs.html)

> Sea.js的使用方法：[https://github.com/pandao/editor.md/tree/master/examples/use-seajs.html](https://github.com/pandao/editor.md/tree/master/examples/use-seajs.html)

####依赖项目及感谢

- [CodeMirror](http://codemirror.net/ "CodeMirror")
- [marked](https://github.com/chjj/marked "marked")
- [jQuery](http://jquery.com/ "jQuery")
- [FontAwesome](http://fontawesome.io/ "FontAwesome")
- [github-markdown.css](https://github.com/sindresorhus/github-markdown-css "github-markdown.css")
- [prettify.js](http://code.google.com/p/google-code-prettify/ "prettify.js")
- [flowchart.js](http://adrai.github.io/flowchart.js/ "flowchart.js")
- [sequence-diagram.js](http://bramp.github.io/js-sequence-diagrams/ "sequence-diagram.js")

####更新日志

[查看更新日志](https://github.com/pandao/editor.md/blob/master/CHANGE.md)

####License

The MIT License.

Copyright (c) 2015 Pandao