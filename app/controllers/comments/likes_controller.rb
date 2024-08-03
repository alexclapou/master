class Comments::LikesController < ApplicationController
  include ActionView::RecordIdentifier

  before_action :authenticate_user!
  before_action :load_story

  def update
    if @comment.liked_by?(current_user)
      @comment.unlike(current_user)
    else
      @comment.like(current_user)
    end

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(dom_id(@comment, :likes), partial: "comments/likes",
                                                                            locals: { story: @comment.story,
                                                                                      comment: @comment })
      end
    end
  end

  def load_story
    @comment = Comment.find(params[:comment_id])
  end
end
