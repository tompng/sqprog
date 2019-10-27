module ApplicationHelper
  def javascript_webpack_tag(name)
    javascript_include_tag '/' + webpack_manifest[name], skip_pipeline: true
  end

  def webpack_manifest
    return @webpack_manifest if @webpack_manifest && Rails.env.production?
    @webpack_manifest = JSON.load Rails.root.join('public', 'assets', 'webpack-manifest.json')
  end
end
