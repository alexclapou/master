class CommentsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource :story
  load_and_authorize_resource :comment
  load_and_authorize_resource :comments, through: :story

  def create
    flash.now[:notice] = "New Comment Created"
    @comment = @story.comments.create(comment_params)
    notify_users(@comment)
  end

  def destroy
    flash.now[:notice] = "Comment Deleted"
    @comment.destroy
  end

  def update
    flash.now[:notice] = "Comment Updated"
    @comment.update(body: params[:body])
  end

  private

  def notify_users(comment)
    users_to_notify = comment.story.comments.includes(:user).map(&:user).uniq - [comment.user]
    users_to_notify.each do |user|
      NotificationChannel.broadcast_to(user, action: "receive")
      Notification.create(item: comment, user:)
    end
  end

  def comment_params
    params.require(:comment).permit(:body).with_defaults(story_id: story_params, user_id: current_user.id)
  end

  def story_params
    params.fetch(:story_id, nil)
  end
end
