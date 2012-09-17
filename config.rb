activate :blog do |blog|
  blog.sources = 'articles/:year-:month-:day-:title'
  blog.permalink = ':year/:month/:day/:title'
end

activate :syntax
activate :directory_indexes
set :blog_layout_engine, :haml

page "/feed.xml", :layout => false

set :markdown_engine, :redcarpet
set :markdown, :fenced_code_blocks => true,
               :autolink => true,
               :smartypants => true
