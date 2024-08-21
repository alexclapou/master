class StoriesController < ApplicationController
  before_action :authenticate_user!, except: %w[show]
  load_and_authorize_resource
  before_action :load_story, only: %w[preview publish]

  def new
    @story = Story.new
  end

  def create
    @story = current_user.stories.create(story_params)

    render json: @story.id
  end

  def index; end

  def edit; end

  def destroy
    flash.notice = "Story successfully deleted"
    @story.destroy
    redirect_to root_path
  end

  def show
    @comment = Comment.new
  end

  def update
    redirect_to story_path(@story) and return if request_format == :turbo_stream

    @story.update(story_params)
    render json: :success
  end

  def preview
    render @story
  end

  def publish
    if @story.title.blank? || @story.content.blank?
      flash.now.alert = "Cannot publish story with blank title and content"
    else
      @story.update(draft: false)
      flash.notice = "Story successfully published"
    end
  end

  private

  def story_params
    permitted_params = params.require(:story).permit(:title, :content, tags: [])
    tag_names = permitted_params.delete(:tags) || []

    permitted_params.merge(tags: tag_names.map { |tag_name| Tag.find_or_create_by(name: tag_name) })
  end

  def load_story
    @story = Story.find_by(id: params[:id] || params[:story_id])
  end
end
