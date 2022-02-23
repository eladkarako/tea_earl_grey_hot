"use strict";

/* read file, per line: parse IPv4 CIDR-notation, convert it to range. write new file.
 * keeps descriptions, fill plain description if there is no description for the line.
 * output format works with peerblock.
 *
 * "--output_name_suffix=_iprange" will add whatever specified after original file name (default empty string). spaces and special characters supported but it is best to wrap with " when using from CMD.
 * "--output_ext_custom=.txt" or "--output_ext_custom=txt" will change the output ext to .txt (default is original ext).
 * 
 * supports multiple files (done one by one).
*/

var files
   ,regex_output_name_suffix = /^.*\-\-output_name_suffix=([^\|]+).*/i
   ,regex_output_ext_custom  = /^.*\-\-output_ext_custom=([^\|]+).*/i
   ,args                     = process.argv
   ,args_str                 = "|" + args.join("|").replace("\"","").replace("\0","") + "|"
   ,output_name_suffix       = (true === regex_output_name_suffix.test(args_str)) ? args_str.replace(regex_output_name_suffix,"$1") : ""
   ,output_ext_custom        = (true === regex_output_ext_custom.test(args_str))  ? args_str.replace(regex_output_ext_custom,"$1")  : false
   ;


files = process.argv
               .filter(function(arg){
                  return (false===/^\-\-/.test(arg) 
                       && false===/node/i.test(arg) 
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




//------------------------------------------------------------------------------------------------------
function ip2long(argIP){ //ip2long('192.0.34.166') » 3221234342
  var i       = 0
     ,pattern = new RegExp(['^([1-9]\\d*|0[0-7]*|0x[\\da-f]+)'
                           ,'(?:\\.([1-9]\\d*|0[0-7]*|0x[\\da-f]+))?'
                           ,'(?:\\.([1-9]\\d*|0[0-7]*|0x[\\da-f]+))?'
                           ,'(?:\\.([1-9]\\d*|0[0-7]*|0x[\\da-f]+))?$'
                           ]
                           .join('')
                           , 'i'
                           )
    ;
  
  // PHP allows decimal, octal, and hexadecimal IP components.
  // PHP allows between 1 (e.g. 127) to 4 (e.g 127.0.0.1) components.
  
  argIP = argIP.match(pattern) // Verify argIP format.
  if (!argIP) {
    // Invalid format.
    return false
  }
  
  // Reuse argIP variable for component counter.
  argIP[0] = 0;
  for (i = 1; i < 5; i += 1){
    argIP[0] += !!((argIP[i] || '').length)
    argIP[i] = parseInt(argIP[i]) || 0
  }
  
  // Continue to use argIP for overflow values.
  // PHP does not allow any component to overflow.
  argIP.push(256, 256, 256, 256);
  
  argIP[4 + argIP[0]] *= Math.pow(256, 4 - argIP[0]); // Recalculate overflow of last component supplied to make up for missing components.
  
  if(argIP[1] >= argIP[5]
  || argIP[2] >= argIP[6]
  || argIP[3] >= argIP[7]
  || argIP[4] >= argIP[8]
  ){
     return false
  }

  return ( argIP[1] * (argIP[0] === 1 || 16777216)
         + argIP[2] * (argIP[0]  <= 2 ||    65536)
         + argIP[3] * (argIP[0]  <= 3 ||      256)
         + argIP[4] * 1
         );
}


function long2ip(ip){ //long2ip( 3221234342 ) » '192.0.34.166'
  if (!isFinite(ip)) {
    return false
  }

  return [ip >>> 24 & 0xFF
         ,ip >>> 16 & 0xFF
         ,ip >>>  8 & 0xFF
         ,ip & 0xFF
         ]
         .join('.');
}


function cidr2range(cidr){
  var address_from
     ,cidr_notation
     ,address_to
     ;
  
  //-------------------------- split data.
  cidr          = cidr.split("/");                          //
  address_from  = cidr[0];
  cidr_notation = cidr[1];
  
  //-------------------------- numeric value.
  address_from  = ip2long(address_from);
  cidr_notation = Number.parseInt(cidr_notation, 10);
  
  //-------------------------- fix- make sure last part is zero, so calculating the range will make sense.
  address_from  = address_from & ((-1 << (32 - cidr_notation)));  //"192.168.0.32" » "192.168.0.0" (but "in numbers").
  
  //-------------------------- last IP.
  address_to    = address_from + Math.pow(2, (32 - cidr_notation)) - 1;
  
  return {"from" : long2ip(address_from)
         ,"to"   : long2ip(address_to)
         };
}


//------------------------------------------------------------------------------------------------------


files.forEach(function(file){
  var content     = require("fs").readFileSync(file.href,{"encoding":"utf8"})
     ,actual_rule_number = 1 //some lines (empty/commented are skipped, so can not relay on 'index').

     ,out_file = file.dir 
               + "/" 
               + (file.name + output_name_suffix) 
               + (false===output_ext_custom ? file.ext : "." + output_ext_custom.replace(/^\./,""))
               
     ,lines    = content.replace(/[\r\n]+/gm,"\n") //unify line-break and split to lines.
                        .split("\n")
                        .map(function(line, index){
                          var match
                             ,range
                             ,rebuilt_line
                             ;
                         
                          line = line.trim();  //pre remove whitespaces from start/end of the line.
                          
                          if(true === /^\s*#/.test(line) 
                          || true === /^\s*;/.test(line) 
                          || true === /^\s*$/.test(line)
                          ){ return line; } //comment or empty line are returned as is.
                          
                          //---------------------------------------------------------------------------------------------
                         
                          match = line.match(/\d+\.\d+\.\d+\.\d+\/\d+/)
                          if(null === match || "undefined" === typeof match[0] || match[0].length < 8){ return ""; } //invalid (no CIDR-notation) lines, are not included (empty line returned).
                          match = match[0];
                         
                          rebuilt_line = line.replace(match, "") //clear string-match from whole line. keeps description (if any).
                                             .replace(/\:/g,"")  //':' is delimited in peerblock lists. description:iprange. this replacement also makes the whole script not compatible with IPv6!!!
                                             .replace(/\t/g," ") //tab to space
                                             .trim();            //whitespace cleanup
                         
                          if(rebuilt_line.length < 2){ //lines with no description will use file name and index.
                            rebuilt_line = file.name + " (#" + String(actual_rule_number) + ")";
                          }
                          actual_rule_number=actual_rule_number+1;
                         
                          range = cidr2range( match );
                          rebuilt_line = rebuilt_line + ":" + range.from + "-" + range.to;
                         
                          return rebuilt_line;
                        })
                        ;
   lines = lines.join("\r\n");
   require("fs").writeFileSync(out_file, lines, {flag:"w", encoding:"utf8"}); //overwrite

   content = undefined; //cleanup
   lines   = undefined; //cleanup
   actual_rule_number   = 1; //cleanup
});

