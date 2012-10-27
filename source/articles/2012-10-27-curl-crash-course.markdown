---
title: Curl crash course
date: 2012/10/27
---

Debugging web services is a common task for web developer. Sometimes you want to have more control on the request you're making - hitting reload in your browser might not be enough. That's where curl comes in.

If you're a web-dev you heard of it for sure, but maybe didn't have time to read a lengthy man page and learn how to use it in day-to-day development. In this article I'll show most useful ways of using curl.

If you're running a linux distribution, curl is available through your system's package manager.

## Basic usage

It's as simple as `curl your-url`. By default a body of HTTP response will be printed to `stdout`.

```
curl http://pewniak747.info
```

Adding -v is very useful - it lets you see whole HTTP request & response, and debug information:

```
curl -v http://pewniak747.info

* About to connect() to pewniak747.info port 80 (#0)
*   Trying 74.117.156.115... connected
> GET / HTTP/1.1
> User-Agent: curl/7.22.0 (x86_64-pc-linux-gnu)
> Host: pewniak747.info
> Accept: */*
> 
< HTTP/1.1 200 OK
< Server: nginx/1.1.4
< Date: Sat, 27 Oct 2012 19:09:07 GMT
< Content-Type: text/html
< Content-Length: 5178
< Last-Modified: Sat, 27 Oct 2012 13:30:31 GMT
< Connection: keep-alive
< Accept-Ranges: bytes

```

## Advanced usage

Changing HTTP method (default is GET)

``` sh
curl -X PUT http://api.example.com/endpoint
```

Query parameters:

``` sh
curl http://api.example.com/endpoint?param=value
```

Sending data in request body (with `Content-Type: application/x-www-form-urlencoded` header):

``` sh
curl -d 'param=value' -d 'param2=other_value' http://api.example.com/endpoint
```

(Note that adding `-X POST` is not necessary - curl automatically assumes a POST)

To simulate a `Content-Type: multipart/form-data` (form submitted by browser) use `-F` instead of `-d`.

``` sh
curl -F 'param=value' -F 'param2=other_value' http://api.example.com/endpoint
```

Sending a file in the form:

``` sh
curl -F 'photo=@/path/to/file' http://api.example.com/endpoint
```

Adding headers:

``` sh
curl -H "Authorization: b97e1222abe974191dfc65c8e2b2eb6b" http://api.example.com/endpoint
```

Sending a cookie:

``` sh
curl -b "session_id=4337a82f37c7218e41931b9bcc60c943" http://api.example.com/endpoint
```
## Debugging JSON

I recommend to install [colorful_json][1] gem - piping curl to `cjson` will nicely format the output:

``` sh
curl https://api.flattr.com/rest/v2/users/smgt/things | cjson

[
  {
    "type": "thing",
    "resource": "https://api.flattr.com/rest/v2/things/958860",
    "link": "https://flattr.com/thing/958860",
    "id": 958860
  }
]
...
```

That's all! I hope you learned useful ways of using curl to debug web services. Do you know other useful curl tricks, or use other tools to aid HTTP debugging? Let me know in the comments!

[1]: https://github.com/simon/colorful_json
