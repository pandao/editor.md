####更新日志

#####v1.0.0 beta

基本功能完成；

#####v1.0.0 releases

主要更新：

- 新建分支 `mathjax-version`，但不打算继续对此分支进行开发；
- 移除MathJax，改用Katex，解析和预览响应速度大幅度提高；
    - 移除 `mathjax` 配置项；
    - 移除 `mathjaxURL` 属性；
    - 移除 `setMathJaxConfig()` 方法；
    - 移除 `loadMathJax()` 方法；
    - 移除MathJax的所有示例；
    - 新增 `tex` 配置项，表示是否开启支持科学公式TeX；
    - 新增 `katexURL` 属性；
    - 新增 `loadKaTex` 方法；
    - 新增KaTeX的示例；
- `setCodeEditor()`方法更名为`setCodeMirror()`；
- 合并CodeMirror使用到的多个JS模块文件，大幅减少HTTP请求，加快下载速度；
    - 新增合并后的两个模块文件：`./lib/codemirror/modes.min.js`、`./lib/codemirror/addons.min.js`；
    - `Gulpfile.js` 新增合并CodeMirror模块文件的任务方法`codemirror-mode`和`codemirror-addon`；
    - 另外在使用Require.js时，因为CodeMirror的严格模块依赖，不使用上述合并的模块文件；
- 更新 `README.md` 等相关文档和示例；
- 解决Sea.js环境下Raphael.js无法运行的问题，即必须先加载Raphael.js，后加载Sea.js；