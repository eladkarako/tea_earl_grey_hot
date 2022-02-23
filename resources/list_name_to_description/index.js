"use strict";

var files
   ,args  = process.argv
   ;


files = process.argv
               .filter(function(arg){
                  return (false===/node/i.test(arg) 
                       && false===/index\.js/i.test(arg) 
                       && (arg || "").length > 5
                         );
               })
               .map(function(file_path){
                  var result = {};
                  file_path = file_path.replace(/\"/g,"").replace(/\\+/g,"/");
                  file_path = require("path").resolve(file_path);
                  file_path = file_path.replace(/\\+/g,"/");
                  
                  result = require("path").parse(file_path);
                  result.href = file_path;
                 
                  return result;
               })
               ;


files.forEach(function(file){
  var content     = require("fs").readFileSync(file.href,{"encoding":"utf8"})
     ,actual_rule_number = 1 //some lines (empty/commented are skipped, so can not relay on 'index').
     ;
  
  require("fs").writeFileSync(file.href + ".bak", content, {flag:"w", encoding:"utf8"}); //backup


  content = content.replace(/[\r\n]+/gm,"\n") //unify line-break and split to lines.
                   .split("\n")
                   .map(function(line, index){
                          line = line.trim();  //pre remove whitespaces from start/end of the line.
                          
                          if(true === /^\s*#/.test(line) 
                          || true === /^\s*;/.test(line) 
                          || true === /^\s*$/.test(line)
                          ){ return line; } //comment or empty line are returned as is.
                          
                          line = file.name + " (#" + String(actual_rule_number) + ")"
                               + " "
                               + line
                               ;
                               
                          actual_rule_number=actual_rule_number+1;     
                          
                          return line;
                   })
                   .join("\r\n")
                   ;
                   
   require("fs").writeFileSync(file.href, content, {flag:"w", encoding:"utf8"}); //overwrite
   
   actual_rule_number = 1;         //cleanup
   content     = undefined; //cleanup
});

