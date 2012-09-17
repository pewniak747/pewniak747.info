activate :blog
activate :directory_indexes
activate :syntax
set :blog_layout_engine, :haml

page "/feed.xml", :layout => false

set :markdown_engine, :redcarpet
set :markdown, :fenced_code_blocks => true,
               :autolink => true,
               :smartypants => true
