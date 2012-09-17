---
title: Pivotal Tracker git post-receive hook
date: 10/04/2012
---

Github's webhooks feature is great, hovewer many people still like to self-host their git repositories. I'm one of them, and I also like [Pivotal Tracker][1] as project management tool. So I wrote this simple git hook to automatically hook up my commits to stories in Pivotal. You will need ruby & nokogiri gem for this.

[GitHub Gist][2]

To get it to work on your remote repo:

    :::bash
    git clone git://gist.github.com/2352380.git /tmp
    mv /tmp/post-receive-pivotal $YOUR_GIT_REPO/.git/hooks/post-receive
  (alternatively you can keep it in .git/hooks/post-receive-pivotal and make original post-receive run it)

    :::bash
    chmod +x $YOUR_GIT_REPO/.git/hooks/post-receive
    git config pivotal.token [YOUR_PIVOTAL_TOKEN]

Now you can do commit messages like "[finishes #123456] bugfix" and after you push comments will be added to your pivotal story.

[Read more][3] about awesome git hooks.

[1]: http://pivotaltracker.com
[2]: https://gist.github.com/2352380
[3]: http://book.git-scm.com/5_git_hooks.html
