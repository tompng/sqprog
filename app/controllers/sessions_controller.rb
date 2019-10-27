class SessionsController < ApplicationController
  def new
    @uid = current_user_uid
    @secret = current_user_uid_secret unless ikachan?
  end

  def create
    secret = params[:secret].to_s
    if secret.size < 4
      render plain: 'secret too short'
      return
    end
    @current_user_uid_secret ||= session[:uid_secret] = secret
    @current_user_uid = nil
    redirect_to action: :new
  end
end
