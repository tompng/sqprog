class ApplicationController < ActionController::Base
  include SessionsConcern
  helper_method :ikachan?
end
