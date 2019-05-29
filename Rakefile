require 'html-proofer'
# rake test
desc "build and test website"
task :test do
  sh "bundle exec jekyll build"
  options = { :assume_extension => true, :verbose => true }
  HTMLProofer.check_directory("./_site", options).run
end