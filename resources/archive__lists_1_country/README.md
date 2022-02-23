as-is data from <code>https://www.ipdeny.com/ipblocks/data/countries/all-zones.tar.gz</code>  
renamed based on data from the website (see <code>README_all-zones.txt</code>)  
and with the help of <code>https://www.proxydocker.com/en/cidr/<del>1.2.3.4/32</del></code> to fill-in some missing information.

`update.cmd` will download new `all-zones.tar.gz`, uncompress it, rename the file to be more clear, change the CIDR-annotation to IPv4-range and update the folder of peerblock.

IPv6 is not compatible with `cidr_notation_to_ip_ranges\index.js`.

<hr/>

this list is rarely being used. probably need to run this once a year.

<hr/>


binaries are taken from 
https://github.com/git-for-windows/git/releases/latest

(get `PortableGit-xxxxxxxxxxxx.7z.exe`, extract files from `/usr/bin/`). 

<hr/>

`aria2c.exe` is taken from https://github.com/q3aql/aria2-static-builds/issues/19

<hr/>

`7za.exe` is taken from https://github.com/mcmilk/7-Zip-zstd/releases/latest
(you can use arm or x32 version if you have a different OS).
