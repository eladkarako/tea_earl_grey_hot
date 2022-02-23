provided `build518` and `build693` based on of `x64 (Vista)` builds patched to support Windows 10.

if you want to use `build518`:  
rename `build518.peerblock.exe` to `peerblock.exe`, `build518.pbfilter.sys` to `pbfilter.sys`.

if you want to use `build693` do the same but remove the `build693.` prefix.

<hr/>

provided static, local lists in PeerBlock text format, 
pre-configured into the example `conf`.
after (previous stage) renaming, open up the list management and enable the list you want to use,  
there are country lists, iblocklist based blocking lists and custom lists (all IPv4).

empty `permallow.p2b` and `permblock.p2b` exists.

<hr/>

the program configuration is set to reduce load, so no history.

to update, close the program and run `_update.cmd`, it will download files directly from github,  
their name stays the same. so once the program will start, no change will be needed.

for example:  
`https://github.com/eladkarako/tea_earl_grey_hot/raw/store/lists_1_country/antarctica__aq.txt`  
will be redirected to:  
`https://raw.githubusercontent.com/eladkarako/tea_earl_grey_hot/store/lists_1_country/antarctica__aq.txt`  

<hr/>

note: you can absolutly use the normal functionality with iblocklist-lists, what should allow you update once a week. their free subscription will not work.

<hr/>

note: this project is not a workaournd downloading from iblocklist, the files in here are updated manually by me. this is a way to avoid the internal update system which tend to break and works over http, for aria2c.  
you can implement your own solution that will use your own iblocklist subscription for example.  
the lists given here are perfectly workable, but would not be updated.  

note: the exe modification is specifically through the embedded manifest resource. it allowes proper running the filter-driver without vista virtualization (so - faster), support for DPI awareness (scaled correctly), it is also supports extra long path and new segmented head of Windows 10 (and 11+)

<hr/>

