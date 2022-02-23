for first time generate xml settings from a list (EXAMPLE).


open `cmd` and run `dir /b >1.txt`

open `1.txt` with notepad2.

remove empty lines.
remove the (usually first line) of `1.txt` .

given a list similar to this:

```txt
example1_ex1.txt
example2_ex2.txt
```

do a search replace (notpad2)

```txt
^(.+)$
```

```txt
<List>\r\n  <File>.\lists_1_country\\\1</File>\r\n  <Type>block</Type>\r\n  <Description>lists_1_country\\\1</Description>\r\n  <Enabled>yes</Enabled>\r\n</List>
```

(can change to `<Type>allow</Type>`).

to get:

```xml
<List>
  <File>.\lists_1_country\example1_ex1.txt</File>
  <Type>block</Type>
  <Description>lists_1_country\example1_ex1.txt</Description>
  <Enabled>yes</Enabled>
</List>
<List>
  <File>.\lists_1_country\example2_ex2.txt</File>
  <Type>block</Type>
  <Description>lists_1_country\example2_ex2.txt</Description>
  <Enabled>yes</Enabled>
</List>
```

and add this to the `peerblock.conf`


<hr/>

make sure the program is closed, back-up the conf file (xml) before changes, delete `cache.p2b` before running the program.


<hr/>

```xml
<TraceLog>
  <Enabled>no</Enabled>
  <Level>5</Level>
</TraceLog>
```

can be changed to `yes` to help debug configuration or program issues.
