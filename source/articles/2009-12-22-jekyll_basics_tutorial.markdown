---
title: Jekyll basics tutorial
---
## Introduction

This tutorial will be about a great tool I found couple weeks ago, called [Jekyll][1].

Jekyll is a "blog-aware, static site generator". What does it mean? Well, basically it generates complete static html site based on your templates. It's great for small, informative webpages or minimalistic, yet powerful blogs. It runs this one too:)

Imagine you are creating a simple web page for a client. Nothing fancy, just plain HTML + CSS, some sub-pages containing informations about the company, products, contact info, etc. Normally you'll create many HTML files, each one containing the same headers and other stuff, over and over. You'll probably make many mistakes:(.

But there's more convenient way to do this. Jekyll to the rescue!

## Installation

Jekyll installation is easy-as-pie through [rubygems][2].

```
$ sudo gem install jekyll
```

You'll probably need to install rubygems first. And [Ruby][3] itself, if you already don't got it. Shame on you!

Once Jekyll has been installed, lets go to our working directory and create some stuff.

## Directory structure

To work with Jekyll you need to create following directories and files:

* &#95;config.yml - this file will contain all configuration for Jekyll to run. Leave it empty for now.

* &#95;layouts - this will contain all, well, layouts:) We'll get to it in a while.

* &#95;includes

## Layouts

Layouts are the files used on the top of rendering new page. They'll basically contain DOCTYPE, &lt;head&gt; and such stuff.

Go on and create your first layout in &#95;layouts dir, called "main.html". Put in this code:

``` html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
 "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
 <html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
  <head>
    <title>My page</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <meta http-equiv="content-language" content="en" />
  </head>
  <body>
    {% assign content_tag = '{{ content }}' %}{{ content_tag }}
  </body>
 </html>
```

Notice the strange " {{ content_tag }} " statement? That's the _liquid tag_ : [Liquid][4] is a templating language which Jekyll uses. We'll be seeing such tags quite often in the future.

So what does it do? All contents rendered will be placed instead of this tag. So basically Layout is the static part of your site (eg. header, logo, navigation), while content changes depending on what sub-site is user visiting.

## Pages

Let's go on and create our first page. That will be probably index.html. But see how it differs from ordinary index.html:

``` html
---
layout: main
title: Home page
---

<h1 class="color1">Welcome to my site.</h1>
<p>My name is Tomasz 'pewinak747' Pewinski blablabla...</p>
```

Pretty short, huh? We don't need to write all unnesessary boring DOCTYPES, &lt;body&gt;s etc, it all will be inserted instead of {{ content_tag }} by Jekyll magic.

YAML front matter ('&ndash;&ndash;&ndash;') is our spell. See how we told Jekyll to use main layout to render this page?

## Showtime!

Time to see Jekyll in action! But first, open &#95;config.yml that I mentioned before and insert following lines:

``` yaml
server: true
auto: true
```

The first one fires up a simple server, so we can see changes by pointing the browser to [localhost:4000](http://localhost:4000)

Second command invokes automatic Jekyll update when any of project files was changed, preventing us from running Jekyll all the time manually.

Once you saved the &#95;config.yml, navigate to your working directory and execute Jekyll:

```
& cd path/to/project
& jekyll
```

(If you dislike editing config files you could use:)

```
$ jekyll --server --auto
```

Point your browser to localhost and see the page source. index.html has been merged with main.html to produce full-equipped standalone index.html, which lives in just created *&#95;site* directory. Magic!

Let's see some more. Go back to your layout and edit &lt;title&gt; tag:

``` html
<title>{% assign title_tag='{{ page.title }}' %}{{ title_tag }}</title>
```

Refresh, and parameter 'title' specified in YAML front matter in index.html will be placed instead of this tag. You can pass any parameter and display it that way.

## Conclusion

With this tutorial you will be able to create simple web pages. In future tutorails I'll show some advanced Jekyll features eg. posts, embeded ruby code or includes. See you soon!

[1]: http://wiki.github.com/mojombo/jekyll
[2]: http://rubyforge.org/frs/?group_id=126
[3]: http://ruby-lang.org
[4]: http://www.liquidmarkup.org/
