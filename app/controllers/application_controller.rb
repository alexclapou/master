class ApplicationController < ActionController::Base
  before_action :set_user_cookie

  def index; end

  rescue_from CanCan::AccessDenied do |exception|
    flash.alert = exception.message
    redirect_to root_path
  end

  def set_user_cookie
    return unless current_user

    cookies.signed[:user_id] = current_user.id
  end
end
