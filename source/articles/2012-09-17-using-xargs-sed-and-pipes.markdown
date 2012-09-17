---
title: Using xargs, sed and pipes
---

## Problem

Upon migrating my blog to new engine, I had to rename bunch of article files.

As is: `source/2012/09/17/Using-xargs-and-sed.markdown`

Should be: `source/2012-09-17-using-xargs-and-sed.markdown`

So basically to move files from nested directories into `source` directory, downcasing and adding a prefix of year-month-day.

## Solution

Combination of `find`, `xargs`, `tr` and `sed`:

``` bash
find source/20??/**/*.markdown |
xargs -n1 sh -c 'echo $0 && echo $0 | tr "[:upper:]" "[:lower:]" | sed -e s/\\//-/g -e s/^source-/source\\//' |
xargs -n2 mv
```

In the first line, we list all article files, using wildcards.

Then we're piping the output to `xargs` with `-n1` switch, and a command. This will invoke the command for every (`-n1`) line passing it as argument. The trick is, command to invoke is actually a new shell process with its own instructions passed after `-c` switch!

In the subshell, we first print the original path (`$0`, because it was the argumant passed to the shell). Then the path is processed:

* `tr "[:upper:]" "[:lower:]"` converts it to lower-case letters
* we're using sed with two `-e` switches:
  * `s/\\//-/g` - replaces every occurence of `/` for `-`. I had to use `\\/` because it is interpolated to string, being an argument to `sh -c` command.
  * `s/^source-/source\\//` - restore first slash after `source`
* no more pipes so processed path is printed to stdout.

Now we have multiple lines of paths, original, then processed and so on:

```
source/2012/09/17/Using-xargs-and-sed.markdown
source/2012-09-17-using-xargs-and-sed.markdown
source/2012/08/04/Checker-gem-for-ruby-rails-development.markdown
source/2012-08-04-checker-gem-for-ruby-rails-development.markdown
```

Piping that to `xargs -n2 mv` will invoke `mv` passing consecutive pairs of lines, which is just what we wanted!

```
mv source/2012/09/17/Using-xargs-and-sed.markdown source/2012-09-17-using-xargs-and-sed.markdown
```

Have a better / more obvious solution? Let me know in the comments. Meanwhile, <3 UNIX.
