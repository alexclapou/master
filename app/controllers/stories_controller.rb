class StoriesController < ApplicationController
  before_action :authenticate_user!

  def new
    @story = Story.new
  end

  def create
    current_user.stories.create(story_params)
  end

  private
  def story_params
    params.require(:story).permit(:title, :content)
  end
end
