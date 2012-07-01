# Rack config

# Cache static assets
require "rack/contrib/static_cache"
use Rack::StaticCache, :urls => ['/'], :root => 'build'
