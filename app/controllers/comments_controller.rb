class CommentsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource :story
  load_and_authorize_resource :comment
  load_and_authorize_resource :comments, through: :story

  def create
    @comment = @story.comments.create(comment_params)
    if @comment.valid?
      flash.now[:notice] = "New Comment Created"
      users = (@comment.story.comments.includes(:user).map(&:user).uniq + [@comment.story.user] - [@comment.user]).uniq
      @comment.notify_users(users, "comment")
    else
      flash.now[:alert] = "Can't leave an empty comment"
    end
  end

  def destroy
    if @comment.destroy
      flash.now[:notice] = "Comment Deleted"
    else
      flash.now[:alert] = "An error occured"
    end
  end

  def update
    @comment.update(body: params[:body])
    if @comment.valid?
      flash.now[:notice] = "Comment Updated"
    else
      flash.now[:alert] = "Cannot leave the comment empty"
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:body).with_defaults(story_id: story_params, user_id: current_user.id)
  end

  def story_params
    params.fetch(:story_id, nil)
  end
end
