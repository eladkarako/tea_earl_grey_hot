"use strict";

/* clear data (or overwrite with foo data)
 * in the 'peerblock.conf'.
 * writes 'example.peerblock.conf'.
 */


var args            = process.argv
   ,content_raw_xml = require("fs").readFileSync("./../../peerblock.conf",{"encoding":"utf8"})
   //,xmljs           = require("xml-js")
   //,content_json    = xmljs.xml2json(content_raw_xml  , {compact:false, ignoreComment:false, spaces:2})
   //,content_xml     = xmljs.json2xml(content_json     , {compact:false, ignoreComment:false, spaces:2})
   ;

content_raw_xml = content_raw_xml
                            //------------------------------------------------------------ presonal data (foo)
                            .replace(/\<UniqueId\>[^\<]+\<\/UniqueId\>/ig  , "<UniqueId>00000000-0000-0000-0000-000000000000</UniqueId>")
                            .replace(/\<Username\>[^\<]+\<\/Username\>/ig  , "<Username>foo</Username>")
                            .replace(/\<PIN\>[^\<]+\<\/PIN\>/ig            , "<PIN>0000</PIN>")
                            
                            //------------------------------------------------------------ cache CRC (invalidate cache) (clear)
                            .replace(/\<CacheCrc\>[^\<]+\<\/CacheCrc\>/ig, "<CacheCrc />")
                            
                            /*
                            //this was removed since if the current version is different than what is in here, annoying pop-up will be shown.
                            //------------------------------------------------------------ program version (foo)
                            .replace(/\<LastVersionRun\>[^\<]+\<\/LastVersionRun\>/ig, "<LastVersionRun>0</LastVersionRun>")
                            */
                            
                            //------------------------------------------------------------ program times usage (foo date in 2022. it prevents annoying first-time pop-ups.)
                            .replace(/\<LastUpdate\>[^\<]+\<\/LastUpdate\>/ig     , "<LastUpdate>1640988000</LastUpdate>")
                            .replace(/\<LastArchived\>[^\<]+\<\/LastArchived\>/ig , "<LastArchived>1640988000</LastArchived>")
                            .replace(/\<LastStarted\>[^\<]+\<\/LastStarted\>/ig   , "<LastStarted>1640988000</LastStarted>")

                            //------------------------------------------------------------ also fix invalid time.
                            .replace(/\<LastUpdate\s*\/\>/ig           , "<LastUpdate>1640988000</LastUpdate>")
                            .replace(/\<LastArchived\s*\/\>/ig         , "<LastArchived>1640988000</LastArchived>")
                            .replace(/\<LastStarted\s*\/\>/ig          , "<LastStarted>1640988000</LastStarted>")
                            
                            //------------------------------------------------------------ program window sizes (foo)
                            .replace(/\<Top\>[^\<]+\<\/Top\>/ig        , "<Top>0</Top>")
                            .replace(/\<Left\>[^\<]+\<\/Left\>/ig      , "<Left>0</Left>")
                            .replace(/\<Bottom\>[^\<]+\<\/Bottom\>/ig  , "<Bottom>600</Bottom>")
                            .replace(/\<Right\>[^\<]+\<\/Right\>/ig    , "<Right>1200</Right>")

                            //------------------------------------------------------------ list usage (all will be no)
                            .replace(/\<Enabled\>[^\<]+\<\/Enabled\>/g , "<Enabled>no</Enabled>")
                            ;


require("fs").writeFileSync("./../../example.peerblock.conf",  content_raw_xml,  {flag:"w", encoding:"utf8"});


