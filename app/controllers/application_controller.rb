class ApplicationController < ActionController::Base
  def index; end
  rescue_from CanCan::AccessDenied do |exception|
    flash.alert = exception.message
    redirect_to root_path
  end
end
