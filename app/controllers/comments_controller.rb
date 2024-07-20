class CommentsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource :story
  load_and_authorize_resource :comments, through: :story

  def create
    @story.comments.create(comment_params)
  end

  private

  def comment_params
    params.require(:comment).permit(:body).with_defaults(story_id: story_params, user_id: current_user.id)
  end

  def story_params
    params.fetch(:story_id, nil)
  end
end
