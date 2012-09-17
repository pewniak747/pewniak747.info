---
title: Checker gem for Ruby & Rails development
date: 04/08/2012
---

Recently, I had a chance to contribute to a nice ruby gem called [Checker][1]. As the name suggests, It's an utility for checking source files.

What's cool about it is that it'll check files you're committing via git for errors or unwanted phrases, and will halt the commit if the check fails. No more typos & syntax errors in your repository!

It currently supports:

* ruby syntax
* haml & sass
* checking for [binding.pry][2] occurences
* javascript & coffeescript lint
* yaml parsing

So it's perfect kit for day-to-day Rails development.

Installing is dead-simple via rubygems:

```
gem install checker
```

And using is even simpler. Just say `checker` to process staged git files:

```
[ RUBY ]
[ HAML ]
[ PRY ]
Checking source/2012/08/04/Checker-gem-for-ruby-rails-development.markdown... pry -> OK,  remote_pry -> OK
[ COFFEESCRIPT ]
[ JAVASCRIPT ]
[ SASS ]
[ YAML ]
```

It's convinient to add `checker` to .git/hooks/pre-commit . That way every single commit will be processed before saving.

For some modules to work you may need to install additional executables. See the gem [README][3] for more info. I hope you find it useful!

[1]: http://github.com/netguru/checker
[2]: http://pryrepl.org
[3]: http://github.com/netguru/checker#checker-
