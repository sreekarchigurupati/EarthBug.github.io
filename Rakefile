require 'html-proofer'
# rake test
desc "build and test website"
task :test do
  sh "bundle exec jekyll build"
  options = { :assume_extension => true, :verbose => true, :http_status_ignore=> [429] }
  HTMLProofer.check_directory("./_site", options).run
end