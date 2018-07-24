/*!
 * Test plugin for Editor.md
 *
 * @file        test-plugin.js
 * @author      pandao
 * @version     1.2.0
 * @updateTime  2015-03-07
 * {@link       https://github.com/pandao/editor.md}
 * @license     MIT
 */

(function () {

  var factory = function (exports) {
    var $ = jQuery; // if using module loader(Require.js/Sea.js).
    var pluginName = "7dtime";

    // exports.fn.testMind = function(p1, p2) {
    //     console.log("testMind");
    // }
    
    $.fn.draw7dtime = function (mdValue, renderCode) {
      try {
        var parsed = parseTlog(mdValue);
      } catch (err) {
        console.log("Woops! Error parsing",err);
        return;
      }
      
      if(!renderCode){
        var html = new drawFragment(new fragment(parsed));
      }else{
        var html = $(renderCode).clone();
      }

      
      
      this.empty().append(html);
      return html;
      
    };

    
    //组合成碎片图数组并返回
    var fragment = function(data){
        var fragmentData = [];
        for(var i=0; i<24*6; i++){
            var title = parseInt(i/6)+':'+(i%6*10);
            fragmentData.push({time:0,item:[], title:title, tags:{}, count:0});
        }
        
        //获取清单标签
        this.getTag = function(tags){
            var tag = '';
            var tagArr = ['critical', 'high', 'low', 'minor', 'life'];
            for(var i=0;i<tagArr.length; i++){
                if(tags[tagArr[i]] !== undefined)
                return tagArr[i];
            }

        }
        //填充多个小碎片
        this.fillItems = function(tags){
            var started = tags['started'], done = tags['done'];
            var startItemKey = this.getIndex(started);
            var endItemKey = this.getIndex(done);
            var start=moment(started).minute()%10, end;
            
            for(var ItemKey=startItemKey; ItemKey<=endItemKey; ItemKey++){
                end = 9;                
            
                if(ItemKey==endItemKey) end=moment(done).minute()%10;
                fragmentData[ItemKey] = this.fillItem(fragmentData[ItemKey], start, end, this.getTag(tags));

                start = 0;
            }
        }
                
        //填充每个小碎片
        this.fillItem = function(item, start, end, tag){
            var begin = Math.max(0,start);
            end = Math.min(9,end);
            if(!item['tags'][tag]) item['tags'][tag] = 0;
            item['tags'][tag] += (end-begin);
            item['count'] +=1;
            

            if(item['item'].length >= 10) return item;
            for(var i=begin; i<=end; i++){
                if(item['item'].indexOf(i)>=0) continue;
                item['item'].push(i);
            }
            item['time'] = item['item'].length*10;
            return item;
        };
        
        //根据时间返回对应数组下标
        this.getIndex = function(time){
            var h = moment(time).hour();
            var m = moment(time).minute();
            var index = h*6 + parseInt(m/10);
            return index;
        }

        for(tskey in data){
            var tasks = data[tskey]['tasks'];
            for(tkey in tasks){
                var task = tasks[tkey];
                var tags = task['tags'];
                if(!(tags['started'] && tags['done'])){
                    continue;
                } 
                this.fillItems(tags);
            }
        }
        //整理成按小时的数组
        var fragmentData1 = [];
        var group = [];
        var i = 0;
        do{
            if(i%6 == 0){
                group = [];
            }
            if(i%6 == 5){
                fragmentData1.push(group);
            }
            group.push(fragmentData[i]);
            i++;
        }while(i<fragmentData.length);

        return fragmentData1;

    };


    //画出碎片图html
    var drawFragment = function(data){

        var FLAG_SYSTEM = ["critical", "high", "low", "minor", "life"];
        var FLAG_COLOR = ["#1ba4ff", "#72c7ff", "#FF6666", "red", "orange"];  // 浅蓝#72c7ff 天蓝#1ba4ff green yellowgreen orange red

        //获取同一碎片内重叠标签数
        this.isMulti = function(item){
            return item['count']>1;
        }
        //取时间占比最多的标签颜色
        this.getTagColor = function(item){
            var tag = {};
            for(var i in item['tags']){
                if(!tag['key']) tag = {key:i, val:item['tags'][i]};
                if(item['tags'][i] > tag['val']) tag = {key:i, val:item['tags'][i]};
            }
            if(!tag['key']) return '';
            
            return FLAG_COLOR[FLAG_SYSTEM.indexOf(tag['key'])];
        }

        

        var html = $('<div class="fragment"></div>');
        for(var i in data){
            var item = data[i];
            var _item = $('<dl class="fragment-item"></dl>');
            for(k in item ){
                var multi = this.isMulti(item[k])?' multi':'';
                var inner = $('<dt class="fragment-item-inner" title="'+item[k]['title']+'"><div class="fragment-item-inner-progress'+multi+'"><div class="fragment-item-inner-progress-item" style="height:'+item[k]['time']+'%;background-color:'+this.getTagColor(item[k])+';"></div></div></dt>');
                _item.append(inner);
            }
            html.append(_item);
        }

        return html;

    }
    

    /**
     * 解析一个目录中的tlog文件
     * @param  {[type]} tlogdir [description]
     * @return {[type]}         [description]
     */
    function parseTlogFileDir(tlogdir) {
      var tlogFiles = fs.readdirSync(tlogdir);
      if (!fs.existsSync(path.join(tlogdir, 'json'))) {
        fs.mkdirSync(path.join(tlogdir, 'json'));
      }
      var temp = [];
      for (var i = 0; i < tlogFiles.length; i++) {
        if (tlogFiles[i].endsWith(".tlog")) {
          temp = temp.concat(parseTlogFile(path.join(tlogdir, tlogFiles[i])));
        }
      }
      return temp;
    }
    /**
     * 解析一个tlog文件
     * @param  {[type]} fname [description]
     * @return {[type]}       [description]
     */
    function parseTlogFile(fname, returnType) {
      var content = fs.readFileSync(fname, "UTF-8");
      // console.log(fname);
      return parseTlog(content, returnType);
    }

    /**
     * 解析tlog内容
     * @param  {[String]} content [tlog文件内容]
     * @param  {[String]} returnType [返回类型,默认js数组对象]
     * @return {[type]}         [description]
     */
    function parseTlog(content, returnType) {
      returnType = returnType || "array";

      var projectList = parseTlogProjs(content);

      projectList = clearProject(projectList);
      projectList = postProcess(projectList);
      projectList = stripProjectList(projectList);
      projectList = addCreatedDay(projectList);
      projectList = addDueUseTime(projectList);
      projectList = changeTagTime(projectList);

      if (returnType == 'array') {
        return projectList;
      } else if (returnType == 'object') {
        return { projectList: projectList };
      } else if (returnType == 'json') {
        var result = { projectList: projectList };
        return JSON.stringify(result);
      } else if (returnType == 'file') {
        var result = { projectList: projectList };
        var outname = path.join(path.dirname(fname), path.parse(fname).name + ".json");

        fs.writeFileSync(outname, JSON.stringify(result));
        return outname;
      } else {
        throw new Error('You must specify return format[array, object, json or file]');
      }
    }

    function printDoneTasks(doneTasks) {
      var result = [];
      doneTasks.forEach(function (task) {
        result.push(task.done + ' ' + task.task.title);
      });
      return result.join("\n");
    }
    /**
     * 返回已完成任务, 返回二级完成任务包含一级任务. 不包含3级.
     * @param  {[type]} projectList [description]
     * @return {[type]}             [description]
     */
    function getDoneTasks(projectList) {
      var doneTaskList = [];
      if (projectList.projectList != undefined) {
        projectList = projectList.projectList;
      }
      for (var i = 0; i < projectList.length; i++) {
        if (projectList[i].type == 'project') {
          for (var j = 0; j < projectList[i].tasks.length; j++) {
            var hasDone = false;
            if (projectList[i].tasks[j].tags["done"] != undefined) {
              doneTaskList.push({ done: projectList[i].tasks[j].tags["done"], task: projectList[i].tasks[j] });
              hasDone = true;
            }
            if (!hasDone && projectList[i].tasks[j].tasks) {
              var subhasDone = false;
              for (var k = 0; k < projectList[i].tasks[j].tasks.length; k++) {
                if (projectList[i].tasks[j].tasks[k].tags["done"] != undefined) {
                  doneTaskList.push({ done: projectList[i].tasks[j].tasks[k].tags["done"], task: projectList[i].tasks[j] });
                  subhasDone = true;
                  break;
                }
              }
              //projectList[i].tasks[j].tags.push({notDone: ""});
            }
          }
        }
      }

      doneTaskList.sort(function (t1, t2) {
        return t1.done > t2.done;
      });

      return doneTaskList;
    };
    /**
     * 返回各种类型任务
     * @param  {[type]} projectList [description]
     * @param  {[type]} type [任务类型]
     * @return {[type]}             [description]
     */

    /**
     * 清空修改逻辑出现的空白项目.
     * @param  {[type]} projectList [description]
     * @return {[type]}             [description]
     */
    function clearProject(projectList) {
      var list = [];
      var pro;
      for (var i = projectList.length - 1; i >= 0; i--) {
        pro = projectList[i];
        if (pro != null && pro.tasks != null && pro.tasks.length > 0) {
          list.push(pro);
          // console.log(pro.key);
        }
      };
      return list;
    }
    /**
     * 清除多余字段
     * @param  {[type]} projectList [description]
     * @return {[type]}             [description]
     */
    function stripProjectList(projectList) {
      var unproject = null;
      for (var i = 0; i < projectList.length; i++) {
        projectList[i] = stripProject(projectList[i]);
        if (projectList[i].key == 'unproject') {
          // console.log("find unproject");
          if (unproject == null) {
            unproject = projectList[i];
          } else {
            unproject.tasks = unproject.tasks.concat(projectList[i].tasks);
          }
          projectList[i] = null;
        }
      }

      for (var i = 0; i < projectList.length; i++) {
        if (projectList[i] == null) {
          projectList.splice(i, 1);
          i--;
        }
      }
      var i;
      for (i = 0; i < projectList; i++) {
        if (projectList[i].type != 'project') {
          break;
        }
      }
      if (unproject != null) {
        for (var j = 0; j < unproject.tasks.length; j++) {
          for (var k = 0; k < unproject.tasks[j].tags.length; k++) {
            if (unproject.tasks[j].tags[k].p != undefined) {
              var hasProj = false;
              var h = 0;
              for (h = 0; h < projectList.length; h++) {
                if (projectList[h].type == 'project' && projectList[h].key == unproject.tasks[j].tags[k].p) {
                  hasProj = true;
                  break;
                }
              }
              delete unproject.tasks[j].tags[k].p;
              if (hasProj) {
                projectList[h].tasks.push(unproject.tasks[j]);
              } else {
                var newProject = {
                  type: 'project',
                  key: unproject.tasks[j].tags[k].p,
                  desc: "",
                  tags: [],
                  tasks: unproject.tasks[j]
                };

                projectList.splice(i + 1, 0, newProject);
                i++;
              }
              unproject.tasks.splice(j, 1);

              break;
            }
          }
        }
        projectList.splice(i + 1, 0, unproject);
      }



      return projectList;
    }

    function stripProject(project) {
      if (project.type == 'project' && project.tasks.length > 0) {
        if (project.key == '') {
          project.key = 'unproject';
        }
        for (var i = 0; i < project.tasks.length; i++) {
          project.tasks = stripTaskFields(project.tasks);
        }
      }

      return project;
    }

    function stripTaskFields(tasks) {
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].tasks.length > 0) {
          tasks[i].tasks = stripTaskFields(tasks[i].tasks);
        }
        delete tasks[i].spaceLen;
      }

      return tasks;
    }
    /**
     * 
     * 从项目描述中提取标签并赋值给下面的所有任务. 起到批量添加标签作用.
     * 已经有区域标签.项目批量标签基本无用.
     * @param  {[type]} projectList [description]
     * @return {[type]}             [description]
     */
    function postProcess(projectList) {
      var pattern = /^(\s*)(.+)\s*/;
      var descMatch;
      var currPro;
      for (var i = 0; i < projectList.length; i++) {
        currPro = projectList[i];
        if (currPro.key != 'unproject' && currPro.key != '') {
          if (descMatch = currPro.desc.match(pattern)) {
            //console.log(descMatch);
            currPro.desc = descMatch[2].replace(/\s$/, '');
            var titleTag = getTitleAndTags(currPro.desc.replace(/\r\n|\n/, ''));
            var tags = titleTag.tags;
            for (var k = 0; k < currPro.tasks.length; k++) {
              var item = currPro.tasks[k];
              tags.forEach(function (tagObj, index, arr) {
                for (var key in tagObj) {
                  item.tags[key] = tagObj[key];
                  // console.log("item tag", key);
                }
              })
            }
          } else {
            //console.log("not match");
          }
        }
      }

      return projectList;
    }

    /**
     * 解析 tlog project
     * @param  {[type]} content [description]
     * @return {[type]}         [description]
     */
    function parseTlogProjs(content) {
      var lines = content.split(/\n|\r\n/);

      return parseTLogAProj(lines, 0);
    }

    var areaBegin = false;
    var areaTags = [];
    var descBegin = false; //描述开始
    var descSpace = ''; //描述前面的空格,
    var areaBeginStr = "--- > -----------------------";

    function parseTLogAProj(lines, start) {
      var taskPattern = /^(\s*)(\[[ x\-]\])\s+(.+)/;
      var projPattern = /^(\s*)([^@:：]+)[ :：]\s*(@p=\w+)\s*(.*)/;
      var refPattern = /^\[([^\]]+)\][:：]\s*(https?:\/\/.+)/; // [txt]: http:url

      var projectList = [];
      var taskLen = 0;
      var lastItem = {};
      var lastIndent = 0;
      var currentProject = null;
      var currTask = null;

      for (var i = start; i < lines.length; i++) {
        var trimedLine;
        if (lines[i] == '' || (trimedLine = lines[i].replace(/^\s+/, '').replace(/\s+$/, '')) == '') {
          continue;
        }
        //lines[i] += '\n';
        var obj = null;
        var matches = lines[i].match(projPattern);
        if (matches) {
          areaBegin = false;
          descBegin = false;
          //console.log(matches);
          if (currentProject != null) {
            projectList.push(currentProject);
            //console.log("begin another");
            return projectList.concat(parseTLogAProj(lines, i));
          }

          currentProject = {
            key: '',
            type: "project",
            title: matches[2].replace(/^\s*\[.\]\s*$/, ''),
            desc: '',
            tags: matches[3],
            tasks: [],
          };
          // parse project
          var projectName = matches[3].match(/@p=(\w+)/);
          currentProject.key = projectName[1];
          var titleTag = getTitleAndTags(matches[4]);
          //currentProject.title = titleTag.title;
          // currentProject.tags = titleTag.tags;
          currentProject.tags = arr2obj(titleTag.tags);
          continue;
        } else if (matches = lines[i].match(taskPattern)) {
          areaBegin = false;
          descBegin = false;
          //console.log(matches);
          //process.exit();
          if (currentProject == null) {
            currentProject = {
              key: '',
              type: "project",
              desc: i >= 1 ? lines[i - 1].replace(/^\s+/, '') : '',
              tags: [],
              tasks: [],
            };
            //throw new Error("before a task must appear a project!");
          } else {
            // console.log("just in", lines, i);
            if (i >= 2 && lines[i - 2].replace(/^\s+/, '').replace(/\s+$/, '') == areaBeginStr) {
              // console.log(lines);
              projectList.push(currentProject);
              // console.log("begin another");
              return projectList.concat(parseTLogAProj(lines, i));
            }
          }

          // parse task
          obj = {
            type: 'task',
            spaceLen: matches[1].length,
            //tag: matches[2],
            title: matches[3],
            desc: '',
            state: '',
            tags: matches[4],
            tasks: []
          };
          if (matches[2] == '[ ]') {
            obj.state = ''; //没开始
          } else if (matches[2] == '[x]') {
            obj.state = 'done';
          } else if (matches[2] == '[-]') {
            obj.state = 'cancelled';
          }

          var titleTag = getTitleAndTags(matches[3]);
          obj.title = titleTag.title.replace(/\s+$/, '');
          obj.tags = titleTag.tags;
          // obj.tags = obj.tags.concat(areaTags); //区域下的所有任务添加标签
          obj.tags = arr2obj(obj.tags.concat(areaTags)); //区域下的所有任务添加标签 
          currTask = obj;
          //console.log(currentProject.tasks);
          //console.log("len=", taskLen);
          if (currentProject.tasks.length == 0) {
            currentProject.tasks.push(obj);
            taskLen++;
          } else if (currentProject.tasks[taskLen - 1].spaceLen == obj.spaceLen) {
            currentProject.tasks.push(obj);
            taskLen++;
          } else if (currentProject.tasks[taskLen - 1].tasks.length == 0) {
            currentProject.tasks[taskLen - 1].tasks.push(obj);
            //taskLen++;
          } else {
            var subResult = currentProject.tasks[taskLen - 1].tasks;
            var lastIndex = subResult.length - 1;
            for (; subResult.length > 0;) {
              if (subResult[lastIndex].spaceLen == obj.spaceLen) {
                subResult.push(obj);
                // taskLen++;
                break;
              } else {
                subResult = subResult[lastIndex].tasks;
                lastIndex = subResult.length - 1;
              }
            }
          }
        } else if ((matches = lines[i].match(refPattern))) {
          areaBegin = false;
          descBegin = false;
          var refList = [];
          refList.push({ title: matches[1], url: matches[2] });
          while (++i < lines.length) {
            // console.log(lines[i]);
            if (lines[i].replace(/^\s+/, '').replace(/\s+$/, '') == '') {
              continue;
            }
            if (matches = lines[i].match(refPattern)) {
              refList.push({ title: matches[1], url: matches[2] });
            } else {
              break;
            }
          }
          if (currentProject != null) {
            projectList.push(currentProject);
          }

          projectList.push({ type: 'references', refList: refList });
          return projectList;
        } else {
          // console.log(lines[i], i);
          if (areaBegin) {
            areaTags = getTitleAndTags(lines[i]).tags;
            // console.log("areaTag", areaTags);
          }
          if (lines[i] == areaBeginStr) {
            areaBegin = true;
            areaTags = [];
            projectList.push(currentProject);
            if (currentProject != null) {
              // console.log("areaBegin");
              currentProject = {
                key: '',
                type: "project",
                desc: '',
                tags: [],
                tasks: [],
              };
              taskLen = 0;
            }

          } else {
            areaBegin = false;
          }
          if (currentProject == null) {
            continue;
          } else if (false && lines[i].substr(0, lastIndent) == ' '.repeat(lastIndent)) {
            continue;
          }
          // task desc or project desc
          obj = {
            type: 'text',
            desc: lines[i]
          };
          //lines[i].replace(/\r\n|\n$/, '');
          if (!descBegin) {
            descBegin = true;
            var matched = lines[i].match(/^(\s{4,})/);
            descSpace = matched && matched[0] ? matched[0] : '';
            // console.log("descSpace:", descSpace);
          }
          if (currentProject.tasks.length == 0) {
            currentProject.desc += ((currentProject.desc == '' ? '' : '\n') + lines[i].replace(descSpace, '')) + "r\n";
            // currentProject.desc += ((currentProject.desc == '' ? '' : '\n') + lines[i].replace(/^\s+/, '')) + "r\n";
            //console.log(currentProject.desc);
          } else {
            var spaceLen = currentProject.tasks[taskLen - 1].spaceLen;
            if (lines[i].substr(0, spaceLen) == ' '.repeat(spaceLen)) {
              currTask.desc += lines[i].replace(descSpace, '') + "\r\n";
              // currTask.desc += lines[i].replace(/^\s+/, '') + "\r\n";
              // currentProject.tasks[taskLen - 1].desc += lines[i].replace(/^\s+/, '');
            } else {
              //console.log(lines[i]);
            }
          }
        }
      }

      projectList.push(currentProject);

      return projectList;
    }

    function getTitleAndTags(str) {
      var rules = [
        [/\(([^\>\)]+)\->([^\>\)]+)\)/g, /\(([^\>\)]+)\->([^\>\)]+)\)/, 2],
        [/\(\->([^\>\)]+)\)/g, /\(\->([^\>\)]+)\)/, 1],
        [/@(\w+)\s*\(([^\)]+)\)/g, /@(\w+)\s*\(([^\)]+)\)/, 2],
        [/@(\w+)=([^\s\)\>]+)/g, /@(\w+)=([^\s\)\>]+)/, 2],
        [/@(\w+)/g, /@(\w+)/, 1]
      ];

      var tags = [];
      var tagStart = 65535;
      for (var i = 0; i < rules.length; i++) {
        var gMatchArr = null;

        if (gMatchArr = str.match(rules[i][0])) {
          //console.log(gMatchArr);
          var attrMatch = null;

          for (var j = 0; j < gMatchArr.length; j++) {
            attrMatch = gMatchArr[j].match(rules[i][1]);
            var xindex = str.indexOf(gMatchArr[j]);
            if (xindex < tagStart) {
              tagStart = xindex;
            }

            var attr = {};
            if (i == 0) {
              tags.push({ need: attrMatch[1] });
              tags.push({ used: attrMatch[2] });
            } else if (i == 1) {
              tags.push({ used: attrMatch[1] });
            } else if (i == 4) {
              var hasAttr = false;
              for (var k = 0; k < tags.length; k++) {
                if (tags[k][attrMatch[1]] != undefined) {
                  hasAttr = true;
                  break;
                }
              }
              if (!hasAttr) {
                attr[attrMatch[1]] = "";
                tags.push(attr);
              }
            } else {
              if (rules[i][2] == 2) {
                //console.log(attrMatch);
                attr[attrMatch[1]] = attrMatch[2];
              } else {
                attr[attrMatch[1]] = "";
              }
              //console.log("attr=", attr);
              tags.push(attr);
            }
            //console.log("j=",j, tags);
          }
          //console.log("i=",i, tags);
        }
      }

      var title = str.substr(0, tagStart);

      return { title: title, tags: tags };
    }

    function getProject(name, projectList) {
      name = name || "unproject";
      var item, pro;
      for (var key in projectList) {
        pro = projectList[key];
        if (pro.key == name) {
          item = pro;
        }
      }
      return item;
    }

    /**
     * tags数组转换成对象. 便于浏览和使用.
     * @param  {[type]} tags [description]
     * @return {[type]}      [description]
     */
    function arr2obj(tags) {
      var obj = {};
      for (var i = tags.length - 1; i >= 0; i--) {
        var tag = tags[i];
        for (var key in tag) {
          if (obj[key] == undefined) {
            obj[key] = tag[key];
          } else {
            obj[key] += ' ' + tag[key]; //toggle 用字符链接.
          }
        }
      };
      return obj;
    }

    /**
     * 已完成或未完成任务中都不需要包含 FLAG_FILTER中的标签;
     * 这里做过滤判断;  true: 不包含flags  false: 包含.
     * @param  {[type]} task [description]
     * @param  {[type]} flags [过滤检查标签]
     * @return {[type]}      [description]
     */
    function checkTaskNeed(task, flags) {
      if (task == null || task.length == 0) {
        return false;
      }
      var bool = false;
      var keys = _.keys(task.tags);
      var temp = _.intersection(keys, flags);
      if (temp.length == 0) { //没有交集,不是需要过滤的任务.
        bool = true;
      }
      // console.log("bool", bool);
      return bool;
    }
    var FLAG_FILTER = ["summary", "solution", "view", "talk", "think", "feel", "way", "rule"];
    var FLAG_LIFE = ["life", "wakeup", "getup", "wash1", "bath", "wc", "breakfast", "tape", "study", "gowork", "workStart", "workReady", "health", "lunch", "cartoon", "dinner", "workEnd", "gohome", "wash2", "sleep"]; //每个人生活标签不一样,需要修改.
    var FLAG_VIEW = ["view"];
    var FLAG_THINK = ["think"];
    var FLAG_TITLE = ["title"];
    var FLAG_TASK = ["timeDiff", "need", "used", "usedCalc", "created", "started", "done", "toggle", "cancelled", "due"];
    var FLAG_SYSTEM = ["critical", "high", "low", "minor"];
    var FLAG_ERROR = ["error", "waste", "bug", "cancelled", "new", "bad"];
    var FLAG_COOL = ["better", "merit", "way", "solution", "summary"];
    // 默认 自定义浅蓝, 系统橙色，任务绿色、浅绿  好的天蓝，坏的红色.
    // 浅蓝#72c7ff 天蓝#1ba4ff green yellowgreen orange red
    var FLAG_COLOR = ["72c7ff", "1ba4ff", "green", "yellowgreen", "orange", "red"];


    // 计算任务消耗时间.
    function calcTime(item) {
      var task = item.task;
      if (task == null || task == undefined) { //&& item.type == "task"
        task = item;
      }
      var tags = task.tags;
      if (tags["done"] != undefined) {
        task.need = task.need || task.evaluate;
        var temp = 0;

        if (task.tasks && task.tasks.length > 0) {
          var need1 = false;
          _.each(task.tasks, function (itask) {

          });
        } else {
          if (tags["toggle"] == undefined) {
            if (tags["done"] && tags["started"]) {
              var tdone = tags["done"];
              var tstart = tags["started"];
              temp = new Date(tdone) - new Date(tstart);
              tags.used = (temp / 1000).formatTime4();
            }
          } else {

          }
        }
      }
      var used = "";
      if (tags) used = tags.usedCalc || tags.used || "";
      if (used.length > 0 && tags.need != undefined && tags.timeDiff == undefined) {
        var nc = getSecond(tags.need);
        var uc = getSecond(used);
        var tt = uc - nc; //parsetlog
        var abst = Math.abs(tt);
        var diff = abst.formatTime4();
        var diffType = tt > 0 ? "c" : "a"; // c超时 b准时 a提前
        if (abst / nc < 0.15) diffType = "b";
        tags.timeDiff = (tt > 0 ? diff : "-" + diff) + "_" + diffType;
        // console.log("timeDiff:", task.tags.timeDiff, t, task.tags.need, used);
      }
    }

    // 计算消耗时间,返回时间格式数据.用以修复tlog数据,添加used标签使用
    // s:14:00 t:14:10 t:14:20 t:14:35 t:14:50 d:15:00
    // s:14:00 t:14:10 t:14:20 t:14:35         d:15:00
    function calcUsed(task) {
      var tags = task.tags || {};
      var res = 0;
      if (tags.done == undefined || tags.started == undefined) return res;
      if (tags.toggle != undefined) {
        var temp = tags.toggle.sort();
        var len = temp.length;
        res += moment(temp[0]).diff(tags.started).valueOf();
        for (var i = 2; i <= len - 1; i += 2) {
          res += moment(temp[i]).diff(temp[i - 1]).valueOf();
        }
        if (len % 2 == 0) res += moment(tags.done).diff(temp[len - 1]).valueOf();
        res = res / 1000;
      } else {
        res = moment(tags.done).diff(tags.started).valueOf() / 1000;
      }
      res = formatTimeHM(res, true);
      return res;
    }

    function calcTimeYHM(timestr, second) {
      var arr = timestr.split("+");
      var timeres = 0;
      var timeTemp = 0;
      if (arr.length > 1) {
        for (var i = arr.length - 1; i >= 0; i--) {
          timeres += getSecond(arr[i]);
          // console.log("timeitem:", arr[i], ms(arr[i]));
        };
        // console.log("timeTemp:", timeTemp);
      } else {
        timeres = getSecond(timestr);
        // console.log("timeTemp:", timestr, timeTemp, timeres);
      }
      if (!second) timeres = formatTimeHM(timeres);
      return timeres;
    }
    // 从时分格式的时间字符串获取秒数
    function getSecond(str) {
      str = str || 0;
      if (!isNaN(str)) {
        if (typeof (str) == "string") str = parseInt(str);
        return str;
      }
      var res = 0;
      var arr = str.split(":");
      if (arr.length > 1) {
        res = parseInt(arr[0]) * 3600 + parseInt(arr[1]) * 60 + parseInt(arr[2] || 0);
      } else {
        res = str2second(str);
      }
      return res;
    }

    // 把时间字符串转换为秒 ,如 1.5h-->4800, 20m-->1200.
    function str2second(str) {
      var res = 0;
      var m, h, d;
      if (str.indexOf("m") != -1) {
        m = parseInt(str);
        res = m * 60;
      } else if (str.indexOf("h") != -1) {
        h = parseFloat(str);
        res = h * 3600;
      } else if (str.indexOf("d") != -1) {
        d = parseFloat(str);
        res = d * 3600 * 24;
      } else {
        res = parseInt(str);
      }
      return res;
    }

    // 格式化秒数到时间格式
    Number.prototype.formatTime4 = function () {
      // 计算
      var h = 0,
        i = 0,
        s = parseInt(this);
      if (s > 60) {
        i = parseInt(s / 60);
        s = parseInt(s % 60);
        if (i > 60) {
          h = parseInt(i / 60);
          i = parseInt(i % 60);
        }
      }
      // 补零
      var zero = function (v) {
        return (v >> 0) < 10 ? "0" + v : v;
      };
      if (h > 0) {
        return [h, zero(i)].join(":");
      } else {
        return i + 'm';
      }
    };

    // 反馈md文件的object 方便添加到数据库.
    function getDayMDobj(projectList, showDay, isPtitle) {
      return getDayMD(projectList, showDay, isPtitle, true);
    }

    /**
     * 获取md文件内存形式的日报.
     * @param  {[type]} projectList 项目列表,包含所有任务.
     * @param  {[Bool]} showDay 显示日期.
     * @param  {[Bool]} isPtitle 是否以项目名为标题.
     * @param  {[Bool]} returnObj 返回object
     * @return {[type]}             日报md文件格式
     */
    function getDayMD(projectList, showDay, isPtitle, returnObj) {
      var tableStr = "";
      var logStr = "";
      var undoStr = "";
      var viewStr = "";
      var mdStr = "";
      var allStr = "";
      var titleStr = "";
      var titleTask = null,
        titleMaxDur = 0;

      var donelist = getDoneTasks(projectList);
      var doneTlist = [];
      var doneDic = {};
      var loglist = [];
      var summarylist = [];
      var addCount = function (item) {
        var keys = _.keys(item.tags);
        for (var index in keys) {
          var tag = keys[index];
          if (doneDic[tag] == undefined) {
            doneDic[tag] = 0;
          }
          doneDic[tag]++;
        }
      }
      _.each(donelist, function (item) {
        doneTlist.push(item.task);
        var need = checkTaskNeed(item.task, FLAG_FILTER);
        var keys = _.keys(item.task.tags);
        if (need) { //过滤不需要的任务
          calcTime(item.task);
          item.task.tasks = item.task.tasks || [];
          if (item.task.tasks.length > 0) {
            var hasdone = false,
              need1 = false;
            _.each(item.task.tasks, function (itask) {
              need1 = checkTaskNeed(itask, FLAG_FILTER);
              if (need1) {
                hasdone = true;
                addCount(itask);
              }
              need1 = checkTaskNeed(itask, ["summary"]);
              if (!need1) {
                summarylist.push(itask);
              }
            });
            if (hasdone) {
              loglist.push(item);
            }
          } else {
            addCount(item.task);
            loglist.push(item);
          }
        }
      });
      loglist = _.sortBy(loglist, function (obj) {
        return obj.done;
      });

      // console.log(donelist);
      // console.log(doneDic);
      // console.log(loglist);

      var lifelist = findNeedTask(doneTlist, FLAG_LIFE, true);
      var viewlist = findNeedTask(doneTlist, FLAG_VIEW, true);

      calcDayFromTask(lifelist, true);
      // console.log(today, dayDic);
      // console.log(lifelist);
      // console.log(viewlist);  
      today = setDay || today || moment().format("YYYY-MM-DD"); // 特殊情况下 today为undefined 就不显示.

      var undoAlllist = [],
        allTaskList = [];
      var undolist;
      var doubtlist;
      var pro, task, tag;
      for (var i = projectList.length - 1; i >= 0; i--) {
        pro = projectList[i];
        for (var j = pro.tasks.length - 1; j >= 0; j--) {
          task = pro.tasks[j];
          if (task.tags["done"] == undefined) {
            undoAlllist.push(task);
          }
          allTaskList.push(task);
          if (titleStr == "" && task.tags["title"] != undefined) {
            titleStr = "# " + task.title + " " + today + "\r\n";
            titleTask = task;
          }
          if (isPtitle) {
            titleStr = "# " + pro.title + "\r\n";
            titleStr += pro.desc ? (pro.desc + "\r\n") : "";
          }
        };
      };
      if (titleStr == '') {
        _.each(donelist, function (item) {
          var task = item.task;
          if (task.tags["used"] != undefined) {
            var currDur = parseInt(task.tags["used"]); //tlog中可以把时间全部转换成分钟数,便于比较.
            if (currDur > titleMaxDur) {
              titleTask = task;
              titleMaxDur = currDur;
              titleStr = "# " + task.title + " " + today + "\r\n";
            }
          }
        })
        if (titleTask == null && undoAlllist && undoAlllist.length > 0) { //如果没有完成任务则取第一个未完成任务.
          titleTask = undoAlllist[0];
        }
      }
      titleStr = getTaskTitle(titleTask);
      titleStr = titleStr || ("#" + " " + today); //如果没有标题就默认时间.
      undolist = findNeedTask(undoAlllist, FLAG_FILTER, false);
      undolist = findNeedTask(undolist, FLAG_LIFE, false);
      doubtlist = findNeedTask(undoAlllist, FLAG_THINK, true);
      // console.log(undoAlllist);
      // console.log(undolist);
      logStr = tolog(loglist, true, showDay);
      undoStr = tolog(undolist, false, showDay);
      viewStr = log2View(viewlist, showDay);
      var doubtStr = tolog(doubtlist, false, showDay);
      var worklist = findNeedTask(allTaskList, FLAG_FILTER, false);
      worklist = findNeedTask(worklist, FLAG_LIFE, false);
      mdStr = log2md(worklist, showDay);
      mdStr = mdStr || "";
      var summaryStr = "无";
      summaryStr = log2View(summarylist, showDay);
      // console.log(logStr);
      var tlogImg = "";
      if (titleTask) {
        titleTask.desc = titleTask.desc || "";
        tlogImg = getTitleImg(titleTask.desc);
        tlogImg = tlogImg || getTitleImg(mdStr);
        titleTask.desc = titleTask.desc.replace(imgReg, "");
        titleTask.desc = titleTask.desc.substr(0, 150);
      } else {
        titleTask = { title: titleStr, desc: "" };
      }
      allStr = tableStr + "\r\n" + "### 时间清单" + "\r\n" + logStr + undoStr + "\r\n" + "### 总结" + "\r\n" + summaryStr + "\r\n" + "### 观点及其他" + "\r\n" + viewStr + "\r\n" + (doubtStr ? "### 心中疑惑\r\n" + doubtStr : '') + "\r\n" + mdStr;
      allStr = titleStr + allStr;
      if (returnObj) {
        var mdobj = { title: titleTask.title, desc: titleTask.desc.substr(0, 150), content: allStr, img: tlogImg };
        return mdobj;
      }
      return allStr;
    }

    // 获取任务的标题和描述
    function getTaskTitle(task) {
      var res = "";
      if (!task) {
        return res;
      }
      res = "# " + task.title + " " + today + "\r\n";
      if (task.desc) {
        res += "" + task.desc.substr(0, 150) + "\r\n";
      }
      return res;
    }

    /**
     * 返回时间清单字符串. 如果大于今天则显示+,小于则显示-.
     * +-很少出现,详情请查看具体tlog或md文件中记录的日期.
     * @param  {[Array]} list [description]
     * @param  {[bool]} isdone [是否完成的任务]
     * @param  {[bool]} showDay [是否显示日期, 默认false不显示日期]
     * @return {[type]}      [description]
     */
    function tolog(list, isdone, showDay) {
      var str = "",
        day;
      _.each(list, function (item) {
        var task = item.task;
        var done = item["done"];
        var started = "xx:xx";
        if (task == null || task == undefined) {
          task = item;
          done = item.tags["done"];
        }
        if (task.tags && task.tags["started"]) {
          started = task.tags["started"];
          started = started.indexOf(" ") > 0 ? started.substr(started.indexOf(" ")) : started;
        }
        task.tasks = task.tasks || [];
        str += (isdone ? "- [x] **" + started + "~" + done + "**" : '- [ ]') + " " + getTitle(task) + " " + getTagsStr(task, 1, showDay) + "\r\n";
        _.each(task.tasks, function (itask) {
          if (isdone && itask.tags["done"] != undefined) {
            str += "      " + itask.tags["done"] + itask.title + "\r\n";
          } else if (!isdone && itask.tags["done"] == undefined) {
            str += "      " + itask.title + "\r\n";
          }
        })
        if (done != undefined) { //完成的任务
          day = done.indexOf(" ") > 0 ? done.substr(0, done.indexOf(" ")) : done;
          calcDay(day, 1);
        }
      });
      str = replaceDay(str, showDay);

      // console.log(today, dayDic);
      return str;
    }

    function getTitle(task) {
      var str = "";
      if (task == null || task.tags == undefined) {
        return str;
      }
      if (task.tags["life"] != undefined) {
        str = "*" + task.title + "*";
      } else if (task.tags["cancelled"] != undefined) {
        str = "~~" + task.title + "~~";
      } else {
        str = task.title;
      }
      return str;
    }
    /**
     * 删除冗余日期,特别是任务标签. 开始 完成...
     * @param  {[type]} str [description]
     * @return {[type]}     [description]
     */
    function replaceDay(str, showDay) {
      str = str || ""; //部分str可能为空.
      if (str.length == 0) return ""; //如果字符为空直接返回.
      // if (typeof(str) == "number") return str;
      if (showDay) return str;
      // console.log("replaceDay str", dayDic);
      for (var day in dayDic) {
        if (day == today) {
          str = str.replace(new RegExp(day + " ", "g"), "");
        } else if (day > today) {
          str = str.replace(new RegExp(day + " ", "g"), "+");
        } else if (day < today) {
          str = str.replace(new RegExp(day + " ", "g"), "-");
        }
      }
      return str;
    }

    var setDay = ""; // "2017-08-19";
    var today, dayDic = {},
      maxCou = 0;

    function resetDay() {
      dayDic = {};
      maxCou = 0;
    }

    /**
     * 通过内容计算当日日期,显示md时删除冗余的日期
     * @param  {[type]} day   [用于统计的单个任务日期]
     * @param  {[type]} value [权重,用于新旧文件计算日期, 生活普通权重10,普通任务权重1]
     * @return {[type]}       [description]
     */
    function calcDay(day, value) { //day='17-08-19'
      if (setDay) return;
      value = value || 1;
      if (dayDic[day] == undefined) {
        dayDic[day] = 0;
      }
      dayDic[day] += value;
      if (dayDic[day] > maxCou) {
        today = day;
        // console.log("today",today);
        maxCou = dayDic[day];
      }
      // console.log("calcDay day", day);
    }

    function calcDayFromTask(tasks, reset) {
      if (reset) {
        resetDay();
      }
      _.each(tasks, function (item) {
        var task = item.task;
        var done = item["done"];
        if (task == null || task == undefined) {
          task = item;
        }
        done = item.tags["done"];
        var day;
        if (done != undefined) {
          day = done.indexOf(" ") > 0 ? done.substr(0, done.indexOf(" ")) : done;
          calcDay(day, 10);
        }
      })
    }

    /**
     * 任务显示成md带标题形式的字符格式.
     * @param  {[type]} list [description]
     * @return {[type]}      [description]
     */
    function log2md(list, showDay) {
      var str = "### 任务详情" + "\r\n";
      _.each(list, function (task) {
        str += "#### " + (task.tags["done"] != undefined ? "[x]" : "[ ]") + task.title + "\r\n" + getTagsStr(task, 0, showDay) + "\r\n";
        if (task.desc) {
          str += "     " + timeTag(task.desc) + "\r\n";
        }
        _.each(task.tasks, function (itask) {
          str += "##### " + (task.tags["done"] != undefined ? "[x]" : "[ ]") + itask.title + "\r\n" + getTagsStr(itask, 0, showDay) + "\r\n";
          if (itask.desc) {
            str += "      " + timeTag(itask.desc) + "\r\n";
          }
        })
      })
      return str;
    }
    var addImgLink = false;

    function timeTag(text) {
      var temp;
      if (addImgLink) {
        temp = text.replace(/(\d\d:\d\d)/g, '[![7天时间清单](https://img.shields.io/badge/时间-$1-ff69b4.svg "7天时间清单")](http://tlog.7dtime.com?time "$1")');
      } else {
        temp = text.replace(/(\d\d:\d\d)/g, '![7天时间清单](https://img.shields.io/badge/时间-$1-ff69b4.svg "7天时间清单")');
      }
      temp = temp.replace("- ", "-");
      return temp;
    }
    var tagDic = { critical: "紧重", high: "重要", low: "紧急", minor: "杂事", today: "今天", title: "标题", new: "突发", task: "任务", p: "项目", desc: "描述", reference: "参考", to: "负责人", by: "作者", created: "创建", due: "排期", started: "开始", toggle: "暂停", cancelled: "取消", done: "完成", used: "耗时", need: "预计", add: "添加", dev: "开发", design: "产品构思", art: "美术", test: "测试", service: "客服", operate: "运营", business: "商务", product: "产品", bug: "缺陷bug", other: "其他", question: "问题", future: "未来", remind: "提醒", dont: "不希望", unset: "收纳箱", merit: "功德", error: "过错", record: "记录", wakeup: "醒", getup: "起床", wash1: "洗漱1", bath: "洗澡", wc: "厕所", breakfast: "早饭", tape: "录音", study: "学习", gowork: "去上班", workStart: "上班", workReady: "工作准备", health: "健康", lunch: "午饭", cartoon: "卡通", dinner: "晚饭", workEnd: "下班", gohome: "回家", wash2: "洗漱2", sleep: "睡觉", member: "成员", flag: "标签", repeat: "重复", project: "项目", summary: "总结", life: "生活", think: "思考", active: "活动", save: "收藏", first: "第一次", tech: "技术", talk: "话题", feel: "感受", doubt: "疑惑", keyword: "关键词", book: "书", discuss: "讨论", change: "改变", wanted: "想要", habit: "习惯", tool: "工具", none: "没有", rule: "规则", ask: "问题", mission: "使命", way: "方法", admire: "钦佩", vision: "愿景", solution: "方案", why: "为什么", better: "进步", bad: "退步", idea: "想法", case: "案例", classic: "经典", waste: "浪费", sleepy: "犯困", view: "观点", outfocus: "走神", exp: "经验", family: "家庭", confident: "自信", exercise: "练习", happy: "快乐", selfDiscipline: "自律", thanks: "谢谢", relax: "放松", software: "软件", outline: "线稿图", unknown: "不懂", noway: "无知", mind: "思维文字", mindmap: "思维导图", timeDiff: "异动", "movie": "电影" };
    var repeatCn = { "D": "每日", "W1": "周一", "W2": "周二", "W3": "周三", "W4": "周四", "W5": "周五", "W6": "周六", "W7": "周日", "M": "每月", "Y": "每年" };
    // 国际化语言转换
    function i18(tag) {
      return tagDic[tag] ? tagDic[tag] : tag;
    }

    // 转换为观点字符内容列表
    function log2View(list, showDay) {
      var str = "";
      _.each(list, function (task, index) {
        var prefix = (index + 1) + ".";
        str += prefix + task.title + getTagsStr(task, 1, showDay) + "\r\n";
        if (task.desc) {
          str += "   " + task.desc + "\r\n"; //prefix
        }
      })
      return str;
    }

    var tagStrLink = '[![{0}](https://img.shields.io/badge/{0}-{1}-{2}.svg "{0}-7天时间清单")](http://tlog.7dtime.com?{3} "{0}") ';
    var tagStrBase = '![{0}](https://img.shields.io/badge/{0}-{1}-{2}.svg "{0}-7天时间清单") ';
    var tagStr = tagStrBase; //默认使用不添加链接的.
    var showTagType = 2; //任务详情显示系统标签. 1所有 2异动评估消耗 3超时.

    /**
     * 获取任务的标签字符串.用于md文件显示或导出.
     * 
     * @param  {[type]} task [description]
     * @param  {[type]} showDone [显示任务状态(started created toggle done cancle), 1:不显示]
     * @return {[type]}      [标签字符串]
     */
    function getTagsStr(task, showDone, showDay) {
      var str = "";
      if (task == null || task.tags == undefined) return str;
      var taskDic = {};
      var keys = _.keys(task.tags);
      var temp = _.intersection(keys, FLAG_FILTER);
      if (temp.length > 1) {
        delete task.tags["view"];
        // console.log("delete task.tags", task.title);
      }
      var tagIndex;
      FLAG_TASK.forEach(function (key, i) { //按顺序导出需要的标签
        tagIndex = -1;
        if (showDone == 1 && (_.contains(FLAG_TASK, key) || _.contains(FLAG_LIFE, key))) {

        } else if (task.tags[key] != undefined) {
          taskDic[key] = true;
          if (showTagType == 2 && i > 2) return false;
          if (showTagType == 3 && i > 0) return false; //跳出下面逻辑
          // if (showDone == 1 && i > 0) return false; //标题只显示异动
          str += getTag(task, key, showDay);
        }
      })
      for (var key in task.tags) {
        if (showDone == 1 && FLAG_TASK.indexOf(key) != 0 && FLAG_SYSTEM.indexOf(key) == -1 && FLAG_ERROR.indexOf(key) == -1 && FLAG_COOL.indexOf(key) == -1) continue;

        // if (showDone == 1 && (FLAG_TASK.indexOf(key) > 0 || FLAG_LIFE.indexOf(key) != -1)) continue;        
        // if (showDone == 1 && FLAG_TASK.indexOf(key) > 0) continue;
        if (taskDic[key] != undefined) continue;
        str += getTag(task, key, showDay);
      }
      return str;
    }

    function getTag(task, key, showDay) {
      var str = "",
        tagValue, tempTxt, cnTxt, tType,
        alt = "";
      if (task.tags[key]) {
        if (key == 'toggle') {
          var matched = task.tags[key].match(/\d\d-\d\d-\d\d \d\d:\d\d/g);
          matched = matched || [];
          matched.forEach(function (item, i) {
            alt = key + " " + task.tags[key];
            tagValue = task.tags[key];
            tagValue = replaceDay(tagValue, showDay);
            tagValue = tagValue.replace(/-/g, '/');
            tempTxt = i % 2 == 1 ? '继续' : '暂停';
            str += tagStr.format(tempTxt, tagValue, getTagColor(key), key);
          })
        } else {
          alt = key + " " + task.tags[key];
          tagValue = task.tags[key];
          tagValue = key == "repeat" ? repeatCn[tagValue] : tagValue; //替换重复缩写值对应的中文意思.
          tagValue = tagValue || ""; //修复repeat标签的错误测试数据会进入.
          if (key == "timeDiff") {
            var typeArr = tagValue.match(/_(.)/) || [];
            tType = typeArr.length >= 2 ? typeArr[1] : "c";
            tagValue = tagValue.replace(/_./, '');
            if (tType == "a") {
              cnTxt = "提前";
              tagValue = tagValue.replace('-', '');
              str += tagStr.format(cnTxt, tagValue, FLAG_COLOR[0], key);
            } else if (tType == "b") {
              cnTxt = "准时";
              if (tagValue.substr(0, 1) != "-") tagValue = "+" + tagValue;
              tagValue = tagValue.replace('-', '');
              str += tagStr.format(cnTxt, tagValue, FLAG_COLOR[1], key);
            } else { // if (tType == "c") 
              cnTxt = "超时";
              str += tagStr.format(cnTxt, tagValue, FLAG_COLOR[5], key);
            }
          } else if (key == "used") {
            tagValue = tagValue.split(":").length < 3 ? tagValue : formatUsed(tagValue);
            cnTxt = i18(key);
            str += tagStr.format(cnTxt, tagValue, getTagColor(key), key);
          } else if (key == "need") {
            tagValue = formatUsed(tagValue);
            cnTxt = i18(key);
            str += tagStr.format(cnTxt, tagValue, getTagColor(key), key);
          } else {
            tagValue = replaceDay(tagValue, showDay);
            // console.log("tagValue:", tagValue, key, task.tags);
            tagValue = tagValue.replace(/-/g, '/');
            cnTxt = i18(key);
            str += tagStr.format(cnTxt, tagValue, getTagColor(key), key);
          }
        }
      } else {
        alt = key + " " + task.tags[key];
        cnTxt = i18(key);
        str += tagStr.format('', cnTxt, getTagColor(key), key);
        // str += " @" + key + (task.tags[key] ? ("=" + task.tags[key]) : "");
      }
      str = str.replace("- ", "-");
      str = str.replace(/ (\d{1,2}:\d\d)/ig, "%20$1");
      return str;
    }

    /**
     * 获取标签颜色
     * @param  {[type]} key [description]
     * @return {[type]}     [description]
     */
    function getTagColor(key) {
      var col = FLAG_COLOR[0];
      if (_.contains(FLAG_TASK, key)) {
        col = FLAG_COLOR[4];
      } else if (_.contains(FLAG_SYSTEM, key)) {
        col = FLAG_COLOR[3];
      } else if (_.contains(FLAG_COOL, key)) {
        col = FLAG_COLOR[1];
      } else if (_.contains(FLAG_ERROR, key)) {
        col = FLAG_COLOR[5];
      }
      return col;
    }

    String.prototype.format = function () {
      if (arguments.length == 0) return this;
      for (var s = this, i = 0; i < arguments.length; i++)
        s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
      return s;
    };

    // 格式化消耗时间, 现在看见标签显示 00:03:30 ,应该显示3m
    function formatUsed(str) {
      var time = getSecond(str);
      return time.formatTime4();
    }

    /**
     * 找出需要的任务, 
     * @param  {[type]} tasklist [任务列表]
     * @param  {[type]} needFlag [相关标签]
     * @param  {[type]} need     [需要 排除,需要true]
     * @return {[type]}          [description]
     */
    function findNeedTask(tasklist, flags, need) {
      var arr = [];
      _.each(tasklist, function (item) {
        var has = checkTaskNeed(item, flags);
        if (has != need) {
          arr.push(item);
        }
      });
      return arr;
    }

    /**
     * 任务转换成tlog文件
     * @return {[type]} [description]
     */
    function task2log(projectList) {
      var str = "",
        project;
      var tasklist = [];
      var area1list = [];
      var area1 = "";
      for (var i = 0; i < projectList.length; i++) {
        project = projectList[i];
        if (project.type == 'project') {
          if (project.key != 'unproject') {
            area1list = project.tasks;
            area1 += project.title + ": @p=" + project.key + "\r\n";
            area1 += task2str(area1list, "critical");
          } else {
            tasklist = project.tasks;
          }
        } else {

        }
      }
      var area2list = findNeedTask(tasklist, ["high"], true);
      var area3list = findNeedTask(tasklist, ["low"], true);
      var area4list = findNeedTask(tasklist, ["minor"], true);
      var area5list = findNeedTask(tasklist, FLAG_LIFE, true);
      var area6list = findNeedTask(tasklist, FLAG_VIEW, true);
      // console.log(area2list,area3list,area4list,area5list,area6list);

      // task2str(area1list,"critical");
      var area2 = task2str(area2list, "high");
      var area3 = task2str(area3list, "low");
      var area4 = task2str(area4list, "minor");
      var area5 = task2str(area5list, "life");
      var area6 = task2str(area6list, "view");
      str = getAreaStr("critical") + area1 + getAreaStr("high") + area2 + getAreaStr("low") + area4 + getAreaStr("minor") + area5 + getAreaStr("life") + area6 + getAreaStr("view") + area6;
      return str;
    }

    /**
     * 任务转换成tlog字符
     * @param  {[Array]} list [任务数组]
     * @param  {[type]} delflag [需要删除的标签字符]
     * @return {[type]}         [description]
     */
    function task2str(list, delflag) {
      var str = "";
      _.each(list, function (item) {
        str += getTaskStr(item, delflag, false);
        _.each(item.tasks, function (item) {
          str += getTaskStr(item, delflag, true);
        });
      });
      return str;
    }

    function getTaskStr(item, delflag, ischild) {
      var str = "";
      var state = "";
      if (item.tags["done"] != undefined) {
        state = "[x] ";
      } else if (item.tags["cancelled"] != undefined) {
        state = "[-] ";
      } else {
        state = "[ ] ";
      }
      var prefix = !ischild ? " " : "     ";
      var prefixDec = !ischild ? "     " : "         ";
      str += prefix + state + item.title;
      var tagStr = "";
      for (var key in item.tags) {
        if (key != delflag) {
          if (item.tags[key] != "") {
            if (_.contains(FLAG_TASK, key)) {
              tagStr += " @" + key + "(" + item.tags[key] + ")";
            } else {
              tagStr += " @" + key + "=" + item.tags[key];
            }
          } else {
            tagStr += " @" + key;
          }
        }
      }
      str += tagStr + "\r\n" + (item.desc ? (prefixDec + item.desc.replace(/\r\n/g, "\r\n" + prefixDec) + "\r\n\r\n") : "");
      // console.log(item.tags,tagStr , str);
      str = str.replace("\r\n" + prefixDec + "\r\n", "\r\n");
      return str;
    }

    function getAreaStr(area) {
      var str = "\r\n" + areaDesc[area] + " @" + area + "\r\n\r\n";
      str = areaBeginStr + str;
      return str;
    }
    var areaDesc = { "critical": "重要紧急", "high": "重要不紧急", "low": "紧急不重要", "minor": "不紧急不重要", "life": "生活", "view": "观点" };
    /**
     * 合并2个任务,相同任务名的合并到一起.
     * @param  {[type]} task1 [前一天任务]
     * @param  {[type]} task2 [另外一天任务]
     * @return {[type]}       [description]
     */
    function merge(task1, task2) {
      var res = _.clone(task1);
      var taskDic = {};
      var titleKey = "";
      task1.forEach(function (item, index, array) {
        titleKey = pinyin.pinyin.getCamelChars(item.title);
        taskDic[titleKey] = item;
      });
      var temp, itask;
      task2.forEach(function (item, index, array) {
        titleKey = pinyin.pinyin.getCamelChars(item.title);
        temp = taskDic[titleKey];
        if (temp == undefined) {
          res.push(item);
        } else {
          // console.log(temp);   
          itask = [];
          temp.desc = item.desc || temp.desc;
          if (temp.tasks.length > 0) {
            temp.tasks.forEach(function (ta, index, array) {
              // = 1 ;
              if (ta.tags["done"] != undefined) {
                itask.push(ta);
              }
            });
          }
          delete item.tags["created"];
          temp.tags = _.extend(temp.tags, item.tags);
          if (temp.tags["done"] != undefined) {
            temp.state = "完成";
          }
          if (item.tasks.length > 0) {
            temp.tasks = itask.concat(item.tasks);
          }
        }
      });
      return res;
    }

    /**
     * 通过目录获取所有项目任务
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    function getProjectByDir(path) {
      path = path || (think.ROOT_PATH + "/tlog");
      var pros = parseTlogFileDir(path);

      var proDic = {};
      var item, len = pros.length;
      for (var i = 0; i <= len - 1; i++) {
        item = pros[i];
        var proName = item.key;
        var pro;
        var tempTaskDic = {};
        if (proDic[proName] == undefined) {
          proDic[proName] = item;
        } else { //同一个项目合并.
          pro = proDic[proName];
          pro.title = item.title;
          pro.desc = item.desc || pro.desc;
          pro.tags = item.tags;
          pro.tasks = merge(pro.tasks, item.tasks);
        }
      };
      // console.log( parse.getDayMD([pros[0]]) );
      // console.log( parse.getDayMD([pros[1]]) );
      var prolist = [];
      for (var key in proDic) {
        prolist.push(proDic[key]);
      }
      // console.log( parse.getDayMD([prolist[1]]) );  // 导出项目md字符.
      // console.log( proDic );
      // console.log( pros );
      // console.log(tlogs);
      return prolist;
    }

    /**
     * 对一天的项目任务添加创建日期, 这里传入的projectList 变得多余,需要优化或调整.
     * @param {[Array]} projectList [项目列表,通常传入一天的tlog任务]
     */
    function addCreatedDay(projectList) {
      var tasklist = [];
      var pro;
      for (var i = projectList.length - 1; i >= 0; i--) {
        pro = projectList[i];
        for (var k = 0; k < pro.tasks.length; k++) {
          var task = pro.tasks[k];
          tasklist.push(task);
        }
      };
      calcDayFromTask(tasklist, true);
      tasklist.forEach(function (task) {
        if (task.tags["created"] == undefined) {
          task.tags["created"] = today;
        }
      })

      return projectList;
    }
    // 添加use due字段
    function addDueUseTime(projectList) {
      // console.log("addDueUseTime in")
      var tasklist = [];
      var pro, time, tempEnd, tempStart;
      for (var i = projectList.length - 1; i >= 0; i--) {
        pro = projectList[i];
        for (var k = 0; k < pro.tasks.length; k++) {
          var task = pro.tasks[k];
          changeTagTimeObj(task.tags); //修复时间格式.
          var duet = task.tags["started"] || task.tags["done"];
          if (task.tags["due"] == undefined && duet) {
            duet = duet.substr(0, 10);
            task.tags["due"] = duet;
          }
          if (task.tags["need"]) task.tags["need"] = calcTimeYHM(task.tags["need"], true);

          if (task.tags["used"] == undefined && task.tags["started"] != undefined && task.tags["done"] != undefined) {
            tempEnd = task.tags["done"];
            tempStart = task.tags["started"];
            time = moment(tempEnd) - moment(tempStart);
            task.tags["used"] = Math.floor(time / 1000 / 60) + "m";
          }
        }
      };

      return projectList;
    }

    function changeTagTime(projectList) {
      var tasklist = [];
      var pro;
      for (var i = projectList.length - 1; i >= 0; i--) {
        pro = projectList[i];
        changeTagTimeObj(pro.tags);
        for (var k = 0; k < pro.tasks.length; k++) {
          var task = pro.tasks[k];
          tasklist.push(task);
        }
      };
      calcDayFromTask(tasklist, true);
      tasklist.forEach(function (task) {
        changeTagTimeObj(task.tags);
      })
      return projectList;
    }

    // 修复tlog文件中的时间格式, 17-12-27 14:00-->2017-12-27 14:00
    function changeTagTimeObj(tags) {
      // var time = /^(\d\d-\d\d-\d\d)/;
      var value = "";
      for (var key in tags) {
        value = tags[key];
        // console.log("tag key value:", key, value, typeof(value) == 'string');
        if (value && typeof (value) == 'string') {
          tags[key] = value.replace(/^(\d\d-\d\d-\d\d)/, '20$1');
          // console.log("tag value:", value, tags[key]);
        }
      }
    }
    // 格式化秒数到时间格式
    function formatTimeHM(time, hasSecond) {
      if (typeof (time) == "string") time = parseInt(time);
      // 计算
      var h = 0,
        i = 0,
        s = parseInt(time);
      if (s > 60) {
        i = parseInt(s / 60);
        s = parseInt(s % 60);
        if (i >= 60) {
          h = parseInt(i / 60);
          i = parseInt(i % 60);
        }
      }
      // 补零
      var zero = function (v) {
        return (v >> 0) < 10 ? "0" + v : v;
      };
      var res;
      if (hasSecond) {
        res = [zero(h), zero(i), zero(s)].join(":");
      } else {
        res = [zero(h), zero(i)].join(":");
      }
      return res;
    };
    var imgReg = /!\[(.*?)\]\((.*?)\)/ig, // /(?<=\()((?!shields).)+?(?=\))/ig
      jpngReg = /\.jpg|\.png|\.jpeg/ig;

    function getTitleImg(str) {
      var res = "";
      if (str == null || str == undefined || str == "") return "";
      var tempImgs = str.match(imgReg); // || mdStr.match(imgReg);
      if (tempImgs && tempImgs.length > 0) {
        var url, matched;
        tempImgs.forEach(function (item) {
          matched = imgReg.exec(item);
          url = "";
          if (matched != null) url = matched[2];
          if (url != "" && url.match(jpngReg)) return res = url;
        })
      }
      return res;
    }

    function setToday(day) {
      setDay = day;
      today = day;
    }

    function setUseLink(val) { //设置生成的md图片是否添加运营推广链接.
      if (addImgLink == val) return;
      addImgLink = val;
      tagStr = val ? tagStrLink : tagStrBase;
    }
    // exports.getTitleImg = getTitleImg;
    // exports.tagDic = tagDic;
    // exports.getProjectByDir = getProjectByDir;
    // exports.parseTlogFileDir = parseTlogFileDir;
    // exports.parseTlogFile = parseTlogFile;
    // exports.parseTlog = parseTlog;
    // exports.printDoneTasks = printDoneTasks;
    // exports.getDoneTasks = getDoneTasks;
    // exports.getTitleAndTags = getTitleAndTags;
    // exports.getProject = getProject;
    // exports.checkTaskNeed = checkTaskNeed;
    // exports.calcTime = calcTime;
    // exports.getDayMD = getDayMD;
    // exports.getDayMDobj = getDayMDobj;
    // exports.tolog = tolog;
    // exports.getTitle = getTitle;
    // exports.replaceDay = replaceDay;
    // exports.resetDay = resetDay;
    // exports.log2md = log2md;
    // exports.log2View = log2View;
    // exports.getTagsStr = getTagsStr;
    // exports.getTag = getTag;
    // exports.findNeedTask = findNeedTask;
    // exports.task2log = task2log;
    // exports.calcTimeYHM = calcTimeYHM;
    // exports.setToday = setToday;
    // exports.showTagType = showTagType; //任务详情显示系统标签. 1所有 2异动评估消耗 3超时.
    // exports.FLAG_LIFE = FLAG_LIFE;
    // exports.getSecond = getSecond;
    // exports.calcUsed = calcUsed;
    // exports.formatTimeHM = formatTimeHM;


  };

  // CommonJS/Node.js
  if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
    module.exports = factory;
  } else if (typeof define === "function") // AMD/CMD/Sea.js
  {
    if (define.amd) { // for Require.js

      define(["editormd"], function (editormd) {
        factory(editormd);
      });
    } else { // for Sea.js
      define(function (require) {
        var editormd = require("./../../editormd");
        factory(editormd);
      });
    }
  } else {
    factory(window.editormd);
  }

})();
