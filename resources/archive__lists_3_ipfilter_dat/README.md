https://upd.emule-security.org/ipfilter.zip

alternatives:
https://sourceforge.net/projects/emulepawcio/files/Ipfilter/Ipfilter/ipfilter.dat/download
  https://netix.dl.sourceforge.net/project/emulepawcio/Ipfilter/Ipfilter/ipfilter.dat



how the format is built
http://web.archive.org/web/20090424225818/http://wiki.phoenixlabs.org/wiki/DAT_Format

download link
http://upd.emule-security.org/ipfilter.zip


convertion from ipfilter to peerblock-list.

str replace
000
0

str replace
00
0

regex replace
0+([1-9]+)
\1

regex replace
^(.+) , 0 , (.+)$
\2 :\1

regex replace
\s+\-\s+
-