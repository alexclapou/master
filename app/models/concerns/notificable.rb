module Notificable
  extend ActiveSupport::Concern

  included do
    has_many :notifications, as: :item, dependent: :destroy
  end

  def notify_users(users, action)
    users.each do |user|
      NotificationChannel.broadcast_to(user, action: "receive")
      Notification.create(item: self, user:, action:, viewed: false)
    end
  end
end
