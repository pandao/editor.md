/**
 *
 * 文件功能介绍
 *
 * @FileName: FileName.js
 * @Auther: Pandao
 * @E-mail: 272383090@qq.com
 * @CreateTime: 
 * @UpdateTime: 
 * Copyright@2013 版权所有
 */

//var icons = $$("#emoji-people .name");
//var icons = $$("#emoji-nature .name");
//var icons = $$("#emoji-objects .name");
//var icons = $$("#emoji-places .name");
//var icons = $$("#emoji-symbols .name");

var arr = [];

for (var i=0, len = icons.length; i<len; i++) 
{
	var icon = icons[i];

	arr.push(icon.textContent.trim());
}

console.log(JSON.stringify(arr));