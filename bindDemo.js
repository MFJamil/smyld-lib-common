/*
const mod = {
    x: 42,
    getX: function() {
      return this.x;
    }
  };
  
  const unboundGetX = mod.getX;
  console.log(unboundGetX()); // The function gets invoked at the global scope
  // expected output: undefined
  
  const boundGetX = unboundGetX.bind(mod);
  console.log(boundGetX());
*/
/*

const c = {
    stdLog: undefined,
    logs : []  
  }
  c.stdLog = console.log.bind(c);
  console.log = function(){
    c.logs.push(Array.from(arguments));
    c.stdlog.apply(console, arguments);
  }

*/

const fs = require("fs");

let logs = [];

function doSaveMessage(type,arguments,origFun){
    let msg = Array.from(arguments);
    let flag = msg.indexOf(" :: ");
    if ((flag>0 )&& (flag<50)){
        msg = msg.replace("%c","");
        logs.push(msg);
    }       
    else{
        logs.push(type + "- " + msg);
    }
        
    origFun.apply(console,arguments)
}

const origFunLog = console.log;
console.log = function(){doSaveMessage("Log   ",arguments,origFunLog);};
const origFunDbg = console.debug;
console.debug = function(){doSaveMessage("Debug ",arguments,origFunDbg);};
const origFunInf = console.info;
console.info = function(){doSaveMessage("Info  ",arguments,origFunInf);};
const origFunErr = console.error;
console.error = function(){doSaveMessage("Error ",arguments,origFunErr);};
const origFunWarn = console.warn;
console.warn = function(){doSaveMessage("Warn  ",arguments,origFunWarn);};

/*

console.log = function(){
    doSaveMessage("Info  ",arguments,origFunLog);
    //logs.push("Info  - " +<Array.from(arguments));
    //origFunLog.apply(console, arguments);
}
const origFunDbg = console.debug;
console.debug = function(){
    logs.push("Debug - " + Array.from(arguments));
    origFunDbg.apply(console, arguments);
}
*/
console.log("This is the log message");
console.info("This is the info message");
console.warn("This is the warning message");
console.debug("This is the debug message");
console.error("This is the error message");

fs.writeFileSync('test.log', logs.join("\n"));
//console.log(logs);
  
