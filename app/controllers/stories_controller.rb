class StoriesController < ApplicationController
  before_action :authenticate_user!
  before_action :load_story, only: ["show"]

  def new
    @story = Story.new
  end

  def create
    story = current_user.stories.create(story_params)

    redirect_to story
  end

  def show; end

  private

  def story_params
    permitted_params = params.require(:story).permit(:title, :content, tags: [])
    tag_names = permitted_params.delete(:tags) || []
    permitted_params.merge(tags: tag_names.map { |tag_name| Tag.find_or_create_by(name: tag_name) })
  end

  def load_story
    @story = Story.find_by(id: params[:id])
  end
end
