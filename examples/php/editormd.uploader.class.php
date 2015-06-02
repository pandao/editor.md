<?php

   /**
    *
    * Editor.md PHP简易上传类（仅供演示用，生产环境使用还需谨慎考虑）
    *
    * @FileName: editormd.uploader.class.php
    * @Auther: Pandao
    * @E-mail: pandao@vip.qq.com
    * @CreateTime: 2015-02-13 23:31:32
    * @UpdateTime: 2015-06-02 15:36:23
    * Copyright@2015 Editor.md all right reserved.
    */

    class EditorMdUploader
    {
        public $files;                          // $_FILES数组
        public $fileExit;                       // 文件扩展名
        public $saveName;                       // 最终保存的文件名
        public $saveURL;                        // 最终保存URL地址
        public $savePath;                       // 保存本地文件路径
        public $randomLength   = '';            // 生成随机文件名的长度，当为日期时为日期的格式
        public $randomNameType = 1;             // 生成随机的形式, NULL为保留原文件名, 1生成随机字符串, 2生成日期文件名
        public $formats = array(                // 允许上传的文件格式
            'gif', 'jpg', 'jpeg', 'png', 'bmp'
        );
        public $maxSize        = 1024;          // 最大上传文件大小，单位KB
        public $cover          = true;          // 是否覆盖同名文件, 1覆盖,0不覆盖
        public $redirect       = false;         // 是否进行URL跳转
        public $redirectURL    = "";            // 上传成功或出错后要转到的URL        
        public $errors = array(                 // 错误信息
            'empty'      => '上传文件不能为空',
            'format'     =>'上传的文件格式不符合规定',
            'maxsize'    => '上传的文件太大',
            'unwritable' => '保存目录不可写，请更改权限',
            'not_exist'  => '保存目录不存在',
            'same_file'  => '已经有相同的文件存在'
        );

        /**
         * 构造函数，初始化对象
         *
         * @access  public
         * @param   string          $savePath       最终保存的本地路径
         * @param   string          $saveURL        最终保存的URL地址
         * @param   string          $formats        允许上传的文件格式
         * @param   Number          $randomNameType 是否生成随机文件名及形式
         * @param   Intiger/string  $randomLength   生成随机文件名字符的长度
         * @param   boolean         $cover          是否覆盖相同文件
         * @param   Intiger         $maxSize        允许最大的上传文件大小，以KB为单位
         * @return  viod
         */
        
        public function __construct($savePath, $saveURL, $formats, $randomNameType = 1, $randomLength = '', $cover = true, $maxSize = 1024)
        {
            $this->savePath       = $savePath;
            $this->saveURL        = $saveURL;
            $this->formats        = $formats;
            $this->maxSize        = $maxSize;
            $this->cover          = $cover;
            $this->randomNameType = $randomNameType;
            $this->randomLength   = $randomLength;
        }

        /**
         * 配置参数函数
         *
         * @access  public
         * @param   array           $configs        配置项数组
         * @return  void
         */
        
        public function config($configs) 
        {
            foreach($configs as $key => $value)
            {
                $this->$key = $value;
            }       
        }

        /**
         * 执行文件上传
         *
         * @access  public
         * @param   string          $name           fileInput's name
         * @return  boolean                         返回是否上传成功的布尔值
         */

        public function upload($name)
        {            
            if(empty($_FILES[$name]['name'])) //上传文件为空时
            {
               $this->message($this->errors['empty']);
                
                return false;
            }
            
            $this->files = $_FILES[$name];
            
            if(!file_exists($this->savePath)) //目录不存在
            {
                $this->message($this->errors['not_exist']);
                
                return false;
            }

            if(!is_writable($this->savePath)) //目录不可写
            {
                $this->message($this->errors['unwritable']);
                
                return false;
            }

            $this->fileExt  = $this->getFileExt($this->files["name"]); //取得扩展名
            
            $this->setSeveName();
            
            return $this->moveFile();
        }

        /**
         * 检查并移动上传文件
         *
         * @access  private
         * @return  boolean
         */

        private function moveFile()
        {
            $files = $this->files;
            
            if ($this->formats != "" && !in_array($this->fileExt, $this->formats))
            {
                $formats = implode(',', $this->formats);
                $message = "您上传的文件" . $files["name"] . "是" . $this->fileExt . "格式的，系统不允许上传，您只能上传" . $formats . "格式的文件。";
                $this->message($message);
                
                return false;
            }

            if ($files["size"] / 1024 > $this->maxSize)
            {
                $message = "您上传的 " . $files["name"] . "，文件大小超出了系统限定值" . $this->maxSize . " KB，不能上传。";
                $this->message($message);
                
                return false;
            }

            if (!$this->cover) //当不能覆盖时
            {
                if(file_exists($this->savePath.$this->saveName)) //有相同的文件存在
                {
                    $this->message($this->saveName . $this->errors['same_file']);
                    
                    return false;
                }
            }

            if (!@move_uploaded_file($files["tmp_name"], iconv("utf-8", "gbk", $this->savePath . $this->saveName)))
            {                
                switch($files["errors"])
                {
                    case '0':
                        $message = "文件上传成功";
                        break;
                    
                    case '1':
                        $message = "上传的文件超过了 php.ini 中 upload_max_filesize 选项限制的值";
                        break;
                    
                    case '2':
                        $message = "上传文件的大小超过了 HTML 表单中 MAX_FILE_SIZE 选项指定的值";
                        break;
                    
                    case '3':
                        $message = "文件只有部分被上传";
                        break;
                    
                    case '4':
                        $message = "没有文件被上传";
                        break;
                    
                    case '6':
                        $message = "找不到临时目录";
                        break;
                    
                    case '7':
                        $message = "写文件到硬盘时出错";
                        break;
                    
                    case '8':
                        $message = "某个扩展停止了文件的上传";
                        break;
                    
                    case '999':
                    default:
                        $message = "未知错误，请检查文件是否损坏、是否超大等原因。";
                        break;
                }

                $this->message($message);
                
                return false;
            }
            
            @unlink($files["tmp_name"]); //删除临时文件
            
            return true;
        }

        /**
         * 生成随机文件名函数
         *
         * @access  private
         * @return  string         $fileName      返回生成的文件名字符串
         */

        private function randomFileName()
        {
            if ($this->randomNameType == 1)        // 生成时间格式文件名
            {
                date_default_timezone_set('PRC');  //设置时区
                
                $date     = date($this->randomLength);
                $fileName = $date . "_" . mt_rand(10000, 99999);
            }
            elseif ($this->randomNameType == 2)    // 生成随机字符文件名
            {
                $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
                $max   = strlen($chars) - 1;
                mt_srand((double)microtime() * 1000000);
                
                for($i = 0; $i < $this->randomLength; $i++)
                {
                    $fileName .= $chars[mt_rand(0, $max)];
                }
            }
            else
            {
                $fileName = '';
            }

            return $fileName;
        }

        /**
         * 组成最终保存的完整路径及文件名
         *
         * @access  private
         * @return  void
         */
        
         private function setSeveName()
         {             
            $this->saveName = $this->randomFileName();
             
            if($this->saveName == '') //如果没生成随机文件名，就保留原文件名
            {
                $this->saveName = $this->files['name'];
            }
         }

        /**
         * 取得保存的文件名，用于数据库存储
         *
         * @access  public
         * @return  string
         */
        
         public function getSeveName()
         {
             return $this->saveName;
         }

        /**
         * 获取文件后缀名函数
         *
         * @access  public
         * @return  string
         */
        
         public function getFileExt($fileName)
         {
             return trim(strtolower(substr(strrchr($fileName, '.'), 1)));
         }

        /**
         * 上传成功或出错后跳转
         *
         * @access  public
         * @param   array           $configs        配置项数组
         * @return  void
         */
        
        public function redirect() 
        {            
            header('location: ' . $this->redirectURL);
        }

        /**
         * 错误提示函数
         *
         * @access  public
         * @return  void
         */

        public function message($message, $success = 0)
        {
            $array = array(
                'success' => $success
            );
            
            $url = $this->saveURL . $this->saveName;

            // 适用于跨域上传时，跳转到中介页面等
            if ($this->redirect) 
            {
                $this->redirectURL .= "&success=" . $success . "&message=" . $message;
                
                if ($success == 1)
                {
                    $this->redirectURL .= '&url=' . $url;
                }
                
                $this->redirect();
            }
            else
            {
                if ($success == 1)
                {
                    $array['url']    = $url;
                }
                else
                {
                    $array['message'] = $message; 
                }
                
                echo json_encode($array);
            }
        }
    }
