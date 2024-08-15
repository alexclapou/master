class UsersController < ApplicationController
  load_and_authorize_resource

  def show
    @stories = @user.stories.paginate(page: params[:stories_page], per_page: 3)
    @likes = @user.likes.paginate(page: params[:likes_page], per_page: 5)
    @comments = @user.comments.paginate(page: params[:comments_page], per_page: 5)
  end

  def edit
  end

  def update
    @user.update(user_params)
    flash[:notice] = "Account updated"
    redirect_to user_path(@user) and return
  end

  def destroy
    flash[:notice] = "Account deleted"
    @user.destroy
    redirect_to root_path
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name)
  end
end
