class NotificationChannel < ApplicationCable::Channel
  def subscribed
    stream_for current_user
  end

  def receive(data)
    handle_receive(data["message"])
  end

  private

  def handle_receive(message)
    ActionCable.server.broadcast("notification_channel_#{current_user.id}", message)
  end
end
