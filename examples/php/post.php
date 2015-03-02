<?php
    header("Content-Type:text/html; charset=utf-8");
    header("Access-Control-Allow-Origin: *");

    if (isset($_POST['submit'])) {
        echo "<pre>";
        echo htmlspecialchars($_POST["test-editormd-markdown-doc"]);
        
        if(isset($_POST["test-editormd-html-code"])) {
            echo "<br/><br/>";
            echo htmlspecialchars($_POST["test-editormd-html-code"]);
        }
        
        echo "</pre>";
    }

    exit;
?>