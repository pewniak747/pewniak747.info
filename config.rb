activate :blog
activate :directory_indexes
set :blog_permalink, ":year/:month/:day/:title"
# set :blog_summary_separator, /READMORE/
# set :blog_summary_length, 500
#
set :blog_layout_engine, :haml

page "/feed.xml", :layout => false

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  # activate :minify_css
  
  # Minify Javascript on build
  # activate :minify_javascript
  
  # Enable cache buster
  # activate :cache_buster
end

require 'rack/codehighlighter'
use Rack::Codehighlighter, 
  :pygments_api,
  :element => "pre>code",
  :pattern => /\A:::([-_+\w]+)\s*\n/,
  :markdown => true
