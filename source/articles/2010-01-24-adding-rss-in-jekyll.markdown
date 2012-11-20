---
title: Adding rss feed in Jekyll
date: 24/01/2010
---

Recently I wanted to add an rss feed to my Jekyll-based blog. Unfortunately there is no support for this. Quite strange...

I ended up with creating simple feed.xml to be processed with Jekyll. Once you create it, there's no need of updating when posting.


``` xml
---
layout: putsomerandomstringhere
---
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>put your blog's title here</title>
    <description>put your blog's description here</description>
    <link>http://yoururl.com</link>
    {% for post in site.posts %}
      <item>
        <title>{{ post.title }}</title>
        <description>{{ post.content | xml_escape }}</description>
        <link>http://yoururl.com{{ post.url }}</link>
      </item>
    {% endfor %}
  </channel>
</rss>
```

Strange layout prevents from ignoring page by Jekyll, and xml_escape prepares post content to be displayed in rss feed.

References: [http://www.rss-specifications.com/creating-rss-feeds.htm](http://www.rss-specifications.com/creating-rss-feeds.htm)
