class UsersController < ApplicationController
  load_and_authorize_resource

  def show
    @stories = @user.stories.paginate(page: params[:stories_page], per_page: 5)
    @likes = @user.likes.paginate(page: params[:likes_page], per_page: 5)
    @comments = @user.comments.paginate(page: params[:comments_page], per_page: 5)
    @search_term = "1"
  end
end
