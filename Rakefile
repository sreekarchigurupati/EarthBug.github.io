require 'html-proofer'
# rake test
desc "build and test website"
task :test do
  sh "bundle exec jekyll build"
  options = { :assume_extension => true, :verbose => true, :http_status_ignore=> [429,999,441], :typhoeus =>{:ssl_verifyhost => 0, :ssl_verifypeer => false, :headers => {"User-Agent" => "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.50 Mobile Safari/537.36"}} }
  HTMLProofer.check_directory("./docs", options).run
end
