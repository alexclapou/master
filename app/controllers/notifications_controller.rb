class NotificationsController < ApplicationController
  before_action :authenticate_user!

  def index
    @notifications = current_user.notifications
                                 .order(created_at: :desc)
                                 .includes(item: %i[story comment])
                                 .paginate(page: params[:page], per_page: 10)
  end
end
