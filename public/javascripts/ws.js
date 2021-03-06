



//--------------------------------Version 2---------------------------------------------

function fetchLog2(timestamp){
    var textarea = document.getElementById("logs_" + timestamp)
    var folderName = document.getElementById("loc_" + timestamp).value
    const myDiv = document.getElementById("myDiv_" + timestamp)
    const myDivHeader = document.getElementById("myDiv_" + timestamp + "header")
    $.post("@routes.EnvMgrCtrl.nextSetOfLines",
    {folderName},
    data => {
        textarea.value += data
        textarea.scrollTop = textarea.scrollHeight;
        if(myDivHeader.style.background === "lightgreen"){
          myDivHeader.style.background = "orange"
        }else{
          myDivHeader.style.background = "lightgreen"
        }
    });
}

function fetchAllLog2(timestamp){

    const textarea = document.getElementById("logs_" + timestamp)
    const myDiv = document.getElementById("myDiv_" + timestamp)
    const myDivHeader = document.getElementById("myDiv_" + timestamp + "header")

    const mustContain = document.getElementById("logMustContain_" + timestamp).value.split(",")
    const mustNotContain = document.getElementById("logMustNotContain_" + timestamp).value.split(",")
    var folderName = document.getElementById("loc_" + timestamp).value
    $.post("@routes.EnvMgrCtrl.nextAllLines",
    {folderName},
    data => {
        textarea.value += data
        textarea.scrollTop = textarea.scrollHeight;

        var success = true;

        if(mustContain && mustContain != ""){
          mustContain.forEach(k => {
            if(textarea.value.indexOf(k)===-1){
                success = false;
            }
          })
        }


        if(mustNotContain && mustNotContain != ""){
          mustNotContain.forEach(k => {
            if(textarea.value.indexOf(k)!=-1){
                success = false;
            }
          })
        }

        if(success){
            myDivHeader.style.background = "lightgreen"
        }else{
            myDivHeader.style.background = "orange"
        }

    });
}



function checkIfexecCompleted2(timestamp){
  var folderName = document.getElementById("loc_" + timestamp).value
    $.post("@routes.EnvMgrCtrl.isExecutionCompleted",
        {folderName},
        data => {
            //console.log("checkIfexecCompleted: " + data)
            if("true" === data){
                fetchAllLog2(timestamp);
            }else{
                fetchLog2(timestamp);
                setTimeout(() => {
                    checkIfexecCompleted2(timestamp)
                }, 1000);
            }
    });
}


function startFetchingLogs2(timestamp){
    setTimeout(() => {
        checkIfexecCompleted2(timestamp)
    }, 200);
}

function exeAsync2(timestamp){
    document.getElementById("logs_" + timestamp).value = ""
    document.getElementById("logs_" + timestamp).style.background = "white"
    var folderName = document.getElementById("loc_" + timestamp).value
    var cmds = document.getElementById("cmds_" + timestamp).value
    $.post("@routes.EnvMgrCtrl.execcmds",
    {folderName, cmds},
    data => {
        //console.log(data)
        if(data === 'Started'){
            setTimeout(() => {
                startFetchingLogs2(timestamp);
            }, 0);
        }
    });
}

function abort(timestamp) {
  var folderName = document.getElementById("loc_" + timestamp).value
  $.post("@routes.EnvMgrCtrl.abort",
    {folderName},
    data => {
        //console.log(data)
        if(data === 'Aborted'){
           document.getElementById("logs_" + timestamp).style.background = "white"
        }
    });
}


function addElem(){

    var d = new Date();
    var n = d.getTime();
    var taskName = document.getElementById("taskName").value
    addElem2(n,taskName, "/tmp", "cd /tmp/;ls -ltr", "/", "error")

}

function showHide(timestamp){
  var elem = document.getElementById("container_" + timestamp)
  var showHideButton = document.getElementById("showHide_" + timestamp)
  if(elem.style.display === 'block'){
    elem.style.display = 'none'
    showHideButton.innerHTML = 'Expand'
  }else{
    elem.style.display = 'block'
    showHideButton.innerHTML = 'Hide'
  }
}

function clone(timestamp){
  var header = document.getElementById("header_" + timestamp).value
  var location = document.getElementById("loc_" + timestamp).value
  var cmds = document.getElementById("cmds_" + timestamp).value
  var contains = document.getElementById("logMustContain_" + timestamp).value
  var notContains = document.getElementById("logMustNotContain_" + timestamp).value
  var d = new Date();
  var n = d.getTime();
  addElem2(n, header, location, cmds, contains, notContains)
}

var globalTop = 100;
var globalLeft = 100;
var zIndex = 1;

function clearLogs(){

    var logElements = document.querySelectorAll('*[id^="logs_"]');
    for( elem of logElements){
      elem.value = ""
    }

}

function addElem2(n, header, location, cmds, logMustContain, logMustNotContain){

    var elem = document.createElement('div');
    var left = Math.floor(Math.random() * 1000) + 100
    var top = Math.floor(Math.random() * 200) + 100

    elem.style.cssText = 'position:absolute;z-index:9;background-color: #fff2e6; top:' + globalTop + 'px; left: ' + globalLeft + 'px;';
    globalTop = globalTop + 100;

    if(globalTop > 800){
      globalTop = 100
      globalLeft = globalLeft + 500;
    }


    elem.id = "myDiv_" + n
    elem.class = "movableDiv"
    document.getElementById("main_panel").appendChild(elem);

    elem.innerHTML = elem.innerHTML + "<div  class='movableDivheader' id='myDiv_" + n + "header' value = " + header + "></div>"
                                    + "<div style='width: 100%; background-color: #fff2e6' > <input style='width: 100%;' id='header_" + n + "' name='header_" + n + "' value = " + header + "></input>"
                                    + "<label id='showHide_" + n + "' class='button' onclick='showHide(" + n + ")'>Expand</label>"
                                    + "<label id='execute_" + n + "' onclick='exeAsync2(" + n + ")' class='button'>Execute</label>"
                                    + "<label id='abort_" + n + "' onclick='abort(" + n + ")' class='button'>Abort</label>"
                                    + "<label id='Clone_" + n + "' onclick='clone(" + n + ")' class='button'>Clone</label> </div>"
                                    + "<div style='display: none;' id='container_" + n + "'>"
                                    + "<br><label>Location</label>"
                                    + "<br><input style='width: 100%' id='loc_" + n + "' type='text' name='location_" + n + "' value='" + location + "'></input>"
                                    + "<br><label>Commands</label>"
                                    + "<br><textarea style='height: 100px; width: 100%;' id='cmds_" + n + "' name='cmds_" + n + "'>" + cmds + "</textarea>"
                                    + "<br><label>Log Must Contain</label>"
                                    + "<br><textarea style='height: 50px; width: 400px;' id='logMustContain_" + n + "' name='logMustContain_" + n + "'>" + logMustContain + "</textarea>"
                                    + "<br><label>Log Must NOT Contain</label>"
                                    + "<br><textarea style='height: 50px; width: 400px;' id='logMustNotContain_" + n + "' name='logMustNotContain_" + n + "'>" + logMustNotContain + "</textarea>"
                                    + "<br><label>Logs</label>"
                                    + "<br><textarea style='height: 150px; width: 400px;' id='logs_" + n + "' name='logs_" + n + "'></textarea>"
                                    + "</div>"
    dragElement(document.getElementById("myDiv_" + n));
     /*setTimeout(() => {
          addMyEventListner(n)
      }, 200);*/
}

function addElementWithDetails(id, name, cmds, logs, top, left, zIndex_, duration, started){

    var elem = document.createElement('div');
    var zIn = parseInt(zIndex_)
    if(zIn > zIndex){
        zIndex = zIn
    }

    elem.style.cssText = 'position:absolute;z-index:' + zIn + '; background-color: #fff2e6; top:' + top + 'px; left:' + left + 'px;';

    elem.id = "MOVABLE_" + id
    elem.class = "movableDiv"
    document.getElementById("main_panel").appendChild(elem);

    var taskUICode = document.getElementById("taskDetails").innerHTML + ""
    taskUICode = taskUICode.replace(/TASK_ID/g, id)
    taskUICode = taskUICode.replace(/COMMAND_NAME/g, name.trim())
    taskUICode = taskUICode.replace(/YOUR_COMMANDS/g, cmds.trim())
    taskUICode = taskUICode.replace(/GENERATED_LOGS/g, logs.trim())
    elem.innerHTML = elem.innerHTML + taskUICode
    document.getElementById("DURATION_" + id).innerText = duration
    document.getElementById("STARTED_" + id).innerText = started
    dragElement(elem);
    minimize(id)
}

function addElem3(){

    var randomNum = Math.floor(Math.random() * 1000000000);
    var date_ = new Date();
    var time_ = date_.getTime();
    var tID = "TASK_" + time_ + "_" + randomNum
    var elem = document.createElement('div');
    var left = Math.floor(Math.random() * 1000) + 100
    var top = Math.floor(Math.random() * 200) + 100

    elem.style.cssText = 'position:absolute;z-index:' + zIndex + '; background-color: #fff2e6; top:' + globalTop + 'px; left: ' + globalLeft + 'px;';
    zIndex = parseInt(zIndex) + 1
    globalTop = globalTop + 100;

    if(globalTop > 800){
      globalTop = 100
      globalLeft = globalLeft + 500;
    }

    elem.id = "MOVABLE_" + tID
    elem.class = "movableDiv"
    document.getElementById("main_panel").appendChild(elem);

    var taskUICode = document.getElementById("taskDetails").innerHTML + ""
    taskUICode = taskUICode.replace(/TASK_ID/g, tID)

    elem.innerHTML = elem.innerHTML + taskUICode
    dragElement(elem);
}

function addMyEventListner(timestamp){
  document.getElementById ("execute_" + timestamp).addEventListener ("onclick", "exeAsync2(" + timestamp + ")", false);
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    zIndex = parseInt(zIndex) + 1
    elmnt.style.zIndex = zIndex;
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }

}


//--------------------------------------------------------------------------------------
/*
function loadTasks() {
  //console.log("loading tasks...")
  var keySeparators = "----"
  var valueSeparators = "____"
  var timestampSeparators = "_-_-_-_"

  @for(t <- tasks) {
    var input = "@t"
    var n = input.split(timestampSeparators)[0]

    var values = input.split(timestampSeparators)[1].split(keySeparators)

    var dict = {};
    for(x in values){
      var vals = values[x].split(valueSeparators)

      dict[vals[0]] = vals[1]
    }

    addElem2(n, dict['header'], dict['location'],dict['cmds'], dict['logMustContain'], dict['logMustNotContain'] )
  }
};*/


function fetchLog(folderName){
    var res =  folderName.replace(/\//g, "_");
    var cmdsElem = "out_" + res
    const textarea = document.getElementById(cmdsElem)
    $.post("@routes.EnvMgrCtrl.nextSetOfLines",
    {folderName},
    data => {
        textarea.value += data
        textarea.scrollTop = textarea.scrollHeight;
    });
}

function fetchAllLog(folderName){
    var res =  folderName.replace(/\//g, "_");
    var cmdsElem = "out_" + res
    const textarea = document.getElementById(cmdsElem)

    $.post("@routes.EnvMgrCtrl.nextAllLines",
    {folderName},
    data => {
        textarea.value += data
        textarea.scrollTop = textarea.scrollHeight;

        if(textarea.value.indexOf("BUILD SUCCESS")!=-1){
            textarea.style.background = "lightgreen"
        }else{
            textarea.style.background = "orange"
        }

    });
}

function checkIfexecCompleted(folderName,fetchAllLog,fetchLog){

    $.post("@routes.EnvMgrCtrl.isExecutionCompleted",
        {folderName},
        data => {
            //console.log("checkIfexecCompleted: " + data)
            if("true" === data){
                fetchAllLog(folderName);
            }else{
                fetchLog(folderName);
                setTimeout(() => {
                    checkAndFetch(folderName)
                }, 2000);
            }
    });
}


function startFetchingLogs(folderName){
    setTimeout(() => {
        checkAndFetch(folderName)
    }, 2000);
}

function checkAndFetch(folderName){
    checkIfexecCompleted(folderName,fetchAllLog,fetchLog)
}

function exeAsync(folderName){
    var res =  folderName.replace(/\//g, "_");
    var cmdsElem = "cmd_" + res
    const cmds = document.getElementById(cmdsElem).value
    $.post("@routes.EnvMgrCtrl.execcmds",
    {folderName, cmds},
    data => {
        //console.log(data)
        if(data === 'Started'){
            setTimeout(() => {
                startFetchingLogs(folderName);
            }, 0);
        }
    });
}

/*
setTimeout(() => {
    loadTasks();
}, 0);
*/

function saveWorkspace(){
  clearLogs()
  const saveWSButton = document.getElementById('saveWSButton')
  setTimeout(() => {saveWSButton.click()}, 2000)
}


//============================================AUTO Resize Text area===========================================

function resize (outID) {
    var text = document.getElementById(outID);
    text.style.height = 'auto';
    text.style.height = text.scrollHeight+'px';
}

///============================================Milliseconds to time=============================================
 function msToTime(s) {

   // Pad to 2 or 3 digits, default is 2
   function pad(n, z) {
     z = z || 2;
     return ('00' + n).slice(-z);
   }

   var ms = s % 1000;
   s = (s - ms) / 1000;
   var secs = s % 60;
   s = (s - secs) / 60;
   var mins = s % 60;
   var hrs = (s - mins) / 60;

   //return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
   return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
 }



//========================================Containers=============================================
class ContainerDetails{
    constructor(name, image, id){
        this.name = name;
        this.image = image;
        this.id = id;
    }
}

var containerList = new Array()

function createContainersList(containers){
    containerList = new Array()
    containers = containers.split("\n")
    for(i in containers){
        var details = containers[i].split("<-->")
        var cont = new ContainerDetails(details[1].trim(),details[0].trim(),details[2].trim())
        containerList.push(cont)
    }
}

function showContainers(contList){
    createContainersList(contList)
    var containersDiv = document.getElementById("containers")
    containersDiv.innerHTML = ""
    for(c in containerList){
        containersDiv.innerHTML = containersDiv.innerHTML + "<br/> <div onclick='showContainerLogs(\"" + containerList[c].name + "\")' class='button'>" + containerList[c].name.substring(0,50) + "</div>"
    }
}

function showContainerLogs(containerName){
    var randomNum = Math.floor(Math.random() * 1000000000);
    var date_ = new Date();
    var time_ = date_.getTime();
    var tID = "TASK_" + time_ + "_" + randomNum
    var left = Math.floor(Math.random() * 1000) + 100
    var top = Math.floor(Math.random() * 200) + 100
    addElementWithDetails(tID, containerName, "docker logs --follow --tail 10 " + containerName, "", top, left, "0", 0, 0)
    //document.getElementById("MAX_" + tID).click();
    var runButton = document.getElementById("RUN_" + tID)
    runButton.click();
}