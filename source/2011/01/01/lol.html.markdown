---
title: Find directories size
categories: [bash]
date: 01/01/2011
---

A nice one-liner that I use. Outputs subdirectories of current directory along with their size (in megabytes), sorted increasingly.

{%highlight bash%}
du -m --max-depth=1 | sort -n -
{%endhighlight%}

Drop it in your $PATH, chmod +x and enjoy!
