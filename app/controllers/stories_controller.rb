class StoriesController < ApplicationController
  before_action :authenticate_user!

  def new
    @story = Story.new
  end
end
