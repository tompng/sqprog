class ApplicationController < ActionController::Base
  include SessionsConcern
  helper_method :ikachan?
  helper_method :current_user_uid

  alias_method :raw_params, :params
  def params
    @_underscored_params ||= begin
      underscored = request.parameters.deep_transform_keys(&:underscore)
      ActionController::Parameters.new underscored
    end
  end
end
