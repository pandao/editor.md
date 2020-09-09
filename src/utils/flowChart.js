const editorFlowChart = {
    /**
     * 解析和渲染流程图及时序图
     * FlowChart and SequenceDiagram Renderer
     * 
     * @returns {editormd}             返回editormd的实例对象
     */
    
    flowChartAndSequenceDiagramRender : function() {
        var $this            = this;
        var settings         = this.settings;
        var previewContainer = this.previewContainer;
        
        if (editormd.isIE8) {
            return this;
        }

        if (settings.flowChart) {
            if (flowchartTimer === null) {
                return this;
            }
            
            previewContainer.find(".flowchart").flowChart(); 
        }

        if (settings.sequenceDiagram) {
            previewContainer.find(".sequence-diagram").sequenceDiagram({theme: "simple"});
        }
                
        var preview    = $this.preview;
        var codeMirror = $this.codeMirror;
        var codeView   = codeMirror.find(".CodeMirror-scroll");

        var height    = codeView.height();
        var scrollTop = codeView.scrollTop();                    
        var percent   = (scrollTop / codeView[0].scrollHeight);
        var tocHeight = 0;

        preview.find(".markdown-toc-list").each(function(){
            tocHeight += $(this).height();
        });

        var tocMenuHeight = preview.find(".editormd-toc-menu").height(); 
        tocMenuHeight = (!tocMenuHeight) ? 0 : tocMenuHeight;

        if (scrollTop === 0) 
        {
            preview.scrollTop(0);
        } 
        else if (scrollTop + height >= codeView[0].scrollHeight - 16)
        { 
            preview.scrollTop(preview[0].scrollHeight);                        
        } 
        else
        {                  
            preview.scrollTop((preview[0].scrollHeight + tocHeight + tocMenuHeight) * percent);
        }

        return this;
    },
};