---
title: Instant http server with python
date: 2013-07-02 22:18 +02:00
---

Here's an extremely useful one-liner that I've been using for ages.
It starts a http server with the root in current directory, using python which is most likely already installed on your machine if you're using Linux or OSX.

``` bash
python -m SimpleHTTPServer
```

If you go to [http://localhost:8000](http://localhost:8000) you'll see index.html if it's present in current directory.

You can also boot up the server on any other port like this:

``` bash
python -m SimpleHTTPServer 8888
```

It's useful for development, for example of Single Page Applications. Enjoy :)
