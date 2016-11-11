activate :blog do |blog|
  blog.sources = 'articles/:year-:month-:day-:title'
  blog.permalink = ':year/:month/:day/:title'
end

activate :syntax
activate :directory_indexes
activate :bourbon
set :blog_layout_engine, :haml
set :haml, { ugly: true }

page "/feed.xml", :layout => false

set :markdown_engine, :redcarpet
set :markdown, :fenced_code_blocks => true,
               :autolink => true,
               :smartypants => true
