---
title: Find directories size
date: 12/04/2011
---

A nice one-liner that I use. Outputs subdirectories of current directory along with their size (in megabytes), sorted increasingly.

```
du -m --max-depth=1 | sort -n -
```

Drop it in your $PATH, chmod +x and enjoy!
