<?php

	/*
	 * PHP cross-domain upload demo for Editor.md
     *
     * @FileName: upload.php
     * @Auther: Pandao
     * @E-mail: pandao@vip.qq.com
     * @CreateTime: 2015-02-15 19:12:11  
     * @UpdateTime: 2015-02-15 20:47:52  
     * Copyright@2015 Editor.md all right reserved.
	 */

    header("Content-Type:text/html; charset=utf-8");
    header("Access-Control-Allow-Origin: *");

    require("editormd.uploader.class.php");

    error_reporting(E_ALL & ~E_NOTICE);
	
	$path     = __DIR__ . DIRECTORY_SEPARATOR;
	$url      = dirname($_SERVER['PHP_SELF']) . '/';
	$savePath = realpath($path . '../uploads/') . DIRECTORY_SEPARATOR;
	$saveURL  = '//'. $_SERVER['SERVER_NAME'] . $url . '../uploads/';   // 本例是演示跨域上传所以加上$_SERVER['SERVER_NAME']
    
	$formats  = array(		
		'image' => array('gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp')
	);

    $name        = 'editormd-image-file'; // file input name
    $callbackUrl = $_GET['callback'];

    if (isset($_FILES[$name]))
    {        
        $imageUploader = new EditorMdUploader($savePath, $saveURL, $formats['image'], false);  // Ymdhis表示按日期生成文件名，利用date()函数
        
        $imageUploader->config(array(
            'maxSize' => 1024,        // 允许上传的最大文件大小，以KB为单位，默认值为1024
            'cover'   => true         // 是否覆盖同名文件，默认为true
        ));
        
        $imageUploader->redirect    = true;
        $imageUploader->redirectURL = $callbackUrl . (empty(parse_url($callbackUrl)['query']) ? '?' : '&') . 'dialog_id=' . $_GET['dialog_id'] . '&temp=' . date('ymdhis');
        
        if ($imageUploader->upload($name))
        {
            $imageUploader->message('上传成功！', 1);
        }
        else
        {
            $imageUploader->message('上传失败！', 0);
        }
    }
?>