# Suppress article page output for projects opted out via `writeup: false`.
#
# Why a plugin: Jekyll's built-in `published: false` also drops the document
# from `site.projects`, which would remove the project card entirely. We want
# the card to stay (linking to itch) with only the "Read" button hidden and
# no article file written. So docs stay published; we delete their output
# after Jekyll writes it. Runs on the Actions build (`bundle exec jekyll
# build`); no JS, no new requests, no dependencies.
require "fileutils"

Jekyll::Hooks.register :site, :post_read do |site|
  docs = site.collections["projects"]&.docs
  next if docs.nil?
  docs.each do |doc|
    # Keep unfinished writeups out of the sitemap; feed only covers posts.
    doc.data["sitemap"] = false if doc.data["writeup"] == false
  end
end

Jekyll::Hooks.register :site, :post_write do |site|
  docs = site.collections["projects"]&.docs
  next if docs.nil?
  docs.each do |doc|
    next unless doc.data["writeup"] == false
    dest_file = doc.destination(site.dest)
    FileUtils.rm_f(dest_file)
    # Remove the now-empty permalink dir (e.g. _site/projects/<slug>/).
    dir = File.dirname(dest_file)
    begin
      Dir.rmdir(dir) if File.directory?(dir) && Dir.empty?(dir)
    rescue SystemCallError
      nil
    end
  end
end
