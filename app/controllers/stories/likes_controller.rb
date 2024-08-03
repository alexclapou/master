class Stories::LikesController < ApplicationController
  include ActionView::RecordIdentifier

  before_action :authenticate_user!
  before_action :load_story

  def update
    if @story.liked_by?(current_user)
      @story.unlike(current_user)
    else
      @story.like(current_user)
    end

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace(dom_id(@story, :likes), partial: "stories/likes",
                                                                          locals: { story: @story })
      end
    end
  end

  def load_story
    @story = Story.find(params[:story_id])
  end
end
