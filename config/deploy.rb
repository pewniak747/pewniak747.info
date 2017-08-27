set :application,       'blog2'
set :repository,        "git://github.com/pewniak747/pewniak747.info.git"
set :scm,               :git
set :use_sudo,          false
set :host,              'pewniak747.info'

role :web,  host
role :app,  host
role :db,   host, :primary => true
default_run_options[:pty] = true

set :user,    'deployer'

after 'deploy:update', 'deploy:update_middleman'

namespace :deploy do

  [:start, :stop, :restart, :finalize_update].each do |t|
    desc "#{t} task is a no-op with middleman"
    task t, :roles => :app do ; end
  end

  desc 'Run middleman to update site before uploading'
  task :update_middleman do
    run("cd #{current_path} && bundle install && rm -rf build/* && bundle exec middleman build --verbose")
  end

end
