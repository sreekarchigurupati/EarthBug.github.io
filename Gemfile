# frozen_string_literal: true

source "https://rubygems.org"
gemspec

gem 'github-pages'
gem "jekyll", ENV["JEKYLL_VERSION"] if ENV["JEKYLL_VERSION"]
# gem 'wdm', '>= 0.1.0' if Gem.win_platform?
gem 'wdm', '>= 0.1.0'
gem 'jekyll-paginate'
gem 'jekyll-archives'
gem 'jekyll-sitemap'

group :test do
    gem 'rake'
    gem 'html-proofer'
end
