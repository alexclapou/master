class UsersController < ApplicationController
  load_and_authorize_resource

  def show
    @stories = @user.stories
    @likes = @user.likes
    @comments = @user.comments
    @search_term = "1"
  end
end
