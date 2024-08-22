class UsersController < ApplicationController
  load_and_authorize_resource

  def show
    @stories = @user.stories.paginate(page: params[:stories_page], per_page: 3)
    @likes = @user.likes.paginate(page: params[:likes_page], per_page: 5)
    @comments = @user.comments.paginate(page: params[:comments_page], per_page: 5)
  end

  def edit; end

  def update
    if params[:user][:first_name].strip.empty? || params[:user][:last_name].strip.empty?
      flash[:alert] = "First and Last Name can't be empty"
      redirect_to edit_user_path(@user) and return
    end
    @user.first_name = params[:user][:first_name]
    @user.last_name = params[:user][:last_name]
    @user.skip_password_validation = true
    @user.save
    flash[:notice] = "Account updated"
    redirect_to user_path(@user) and return
  end

  def destroy
    flash[:notice] = "Account deleted"
    @user.destroy
    redirect_to root_path
  end
end
