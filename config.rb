class RewriteMarkdownPaths < Middleman::Extension
  # https://github.com/middleman/middleman-blog/issues/277
  def manipulate_resource_list(resources)
    resources.each do |resource|
      next unless resource.source_file.end_with?('.markdown')
      resource.options[:content_type] = "text/html"
      resource.destination_path << "/index.html"
    end
  end
end

::Middleman::Extensions.register(:rewrite_markdown_paths, RewriteMarkdownPaths)

activate :blog do |blog|
  blog.sources = 'articles/:year-:month-:day-:title'
  blog.permalink = ':year/:month/:day/:title'
end

activate :syntax
activate :directory_indexes
activate :rewrite_markdown_paths
set :haml, { ugly: true, format: :html5 }

page "/feed.xml", layout: false

set :markdown_engine, :redcarpet
set :markdown, fenced_code_blocks: true,
               autolink: true,
               smartypants: true
