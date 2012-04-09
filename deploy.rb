set :application,       'blog'
set :repository,        "46.102.246.251:/opt/git/blog.git"
set :scm,               :git
set :use_sudo,          false
set :host,              '46.102.246.251'

role :web,  host
role :app,  host
role :db,   host, :primary => true
default_run_options[:pty] = true

set :user,    'deployer'

after 'deploy:update', 'deploy:update_jekyll'

namespace :deploy do

  [:start, :stop, :restart, :finalize_update].each do |t|
    desc "#{t} task is a no-op with jekyll"
    task t, :roles => :app do ; end
  end
  
  desc 'Run jekyll to update site before uploading'
  task :update_jekyll do
    run("export RUBYOPT=-Ku && cd #{current_path} && rm -rf _site/* && bundle exec jekyll")
  end
  
end
