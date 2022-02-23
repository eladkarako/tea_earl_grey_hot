/*
references:
  ip2long — Converts a string containing an (IPv4) Internet Protocol dotted address into a long integer
  https://locutus.io/php/ip2long/
  https://www.php.net/manual/en/function.ip2long.php

  long2ip — Converts an long integer address into a string in (IPv4) Internet standard dotted format
  https://locutus.io/php/long2ip/
  https://www.php.net/manual/en/function.long2ip.php

  inet_ntop — Converts a packed internet address to a human readable representation
  https://locutus.io/php/inet_ntop/
  https://www.php.net/manual/en/function.inet-ntop.php

  inet_pton — Converts a human readable IP address to its packed in_addr representation
  https://locutus.io/php/inet_pton/
  https://www.php.net/manual/en/function.inet-pton.php


*/


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



function inet_pton(a){ //inet_pton('127.0.0.1') » '\x7F\x00\x00\x01'   inet_pton('::1') » '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\1'
  var m
     ,i
     ,j
     ,f           = String.fromCharCode
     ,reHexDigits = /^[\da-f]{1,4}$/i
     ;

  // IPv4
  m = a.match(/^(?:\d{1,3}(?:\.|$)){4}/);
  if(null !== m && m.length > 0) {
    m = m[0].split('.');
    m = f(m[0], m[1], m[2], m[3]);
    return (m.length === 4 ? m : false); // Return if 4 bytes, otherwise false.
  }

  // IPv6
  if (a.length > 39) {
    return false
  }

  m = a.split('::')

  if (m.length > 2){
    return false;    //returning here is possible due to '::' unable to used more than once in IPv6-string.
  }


  for (j = 0; j < m.length; j++) {
    if (m[j].length === 0){ //Skip if empty.
      continue;
    }
    
    m[j] = m[j].split(':');
    
    for (i = 0; i < m[j].length; i++) {
      let hextet = m[j][i]
      if (!reHexDigits.test(hextet)){ //check if valid hex string up to 4 chars
        return false
      }

      hextet = Number.parseInt(hextet, 16)

      if (isNaN(hextet)){  //Would be NaN if it was blank, return false.
        return false;      //invalid IP.
      }
      
      m[j][i] = f(hextet >> 8, hextet & 0xFF)
    }
    
    m[j] = m[j].join('');
  }

  return m.join('\x00'.repeat(16 - m.reduce((tl, m) => tl + m.length, 0)));
}


function inet_ntop(a){ //inet_ntop('\x7F\x00\x00\x01') » '127.0.0.1'   inet_ntop('\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\1') » '::1'
  var i = 0
     ,m = ''
     ,c = []
     ;

  a += '';
  if(4 === a.length){         //IPv4
    return [a.charCodeAt(0)
           ,a.charCodeAt(1)
           ,a.charCodeAt(2)
           ,a.charCodeAt(3)
           ].join('.')
  }
  else if(16 === a.length){   //IPv6
    for(i = 0; i < 16; i++){
      c.push(((a.charCodeAt(i++) << 8) + a.charCodeAt(i)).toString(16));
    }
    return c.join(':')
            .replace(/((^|:)0(?=:|$))+:?/g, function(t){
              m = (t.length > m.length) ? t : m
              return t
            })
            .replace(m || ' ', '::')
  } 
  else{ //invalid length
    return false;
  }
  
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
  
  //-------------------------- fix: make sure last part is zero, so calculating the range will make sense.
  address_from  = address_from & ((-1 << (32 - cidr_notation)));  //"192.168.0.32" » "192.168.0.0" (but "in numbers").
  
  //-------------------------- last IP.
  address_to    = address_from + Math.pow(2, (32 - cidr_notation)) - 1;
  
  return {"from" : long2ip(address_from)
         ,"to"   : long2ip(address_to)
         };
}


function how_much_ips_in_cidr(cidr){
  cidr = cidr.replace(/^.+\//, "");
  cidr = Number.parseInt(cidr, 10);
  return Math.pow(2, (32-cidr));
}


function get_cidr_notation(ip){ //255.255.255.0 » 11111111.11111111.11111111.00000000 » count "1" » 24   //https://www.freecodecamp.org/news/subnet-cheat-sheet-24-subnet-mask-30-26-27-29-and-other-ip-address-cidr-network-references
  return (ip2long(ip).toString(2).split("1").length - 1);
}


function ip_address__and__subnet_mask__to__subnet_address__broadcast_address__and__wildcard_mask(ip_address, subnet_mask){
/*------------------------------------------- example.
input:
  ip_address             "10.10.10.7"
  subnet_mask            "255.255.255.0"

output:
  {"subnet_address"    : "10.10.10.0"
  ,"broadcast_address" : "10.10.10.255"
  ,"wildcard_mask"     : "0.0.0.255"
  }
------------------------------------------------------
*/

  var wildcard_mask; //tmp for calculation.
  
  ip_address    = ip2long(ip_address);  //convert to long for the rest of the method. (above 'result' still holds the previous data).
  subnet_mask   = ip2long(subnet_mask); //convert to long for the rest of the method. (above 'result' still holds the previous data).
  wildcard_mask = ~subnet_mask;

  return {"subnet_address"    : long2ip( ip_address & wildcard_mask )
         ,"broadcast_address" : long2ip( ip_address | subnet_mask )
         ,"wildcard_mask"     : long2ip( wildcard_mask )
         };
}


function ip4_in_ipv6_compatibility_format_to_just_ipv4(ip){ //"::ffff:10.0.0.1" » "10.0.0.1"     //https://archive.is/FA3u7#83548    https://web.archive.org/web/20220203184941/https://www.php.net/manual/en/function.ip2long.php#83548
  return ip.replace(/^\:\:.*\:([^\:]+)$/,"$1");
  
  //can be modified to just
  //return ip.replace(/([^\:]+)$/,"$1");
  //but it will lack the identification of :: at the start, and just return as much of the last section after ':'.
  //but the provided functionality will return the input ip as is if not matched by the regular expression.
}
