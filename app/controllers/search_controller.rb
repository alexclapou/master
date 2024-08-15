class SearchController < ApplicationController
  def index
    @search_term = params[:q]
  end

  def search_stories
    @search_term = params[:q]
    @stories = Story.published.joins(:rich_text_content)
                    .where("action_text_rich_texts.body ILIKE ?", "%#{@search_term}%")
                    .or(Story.published.where("title ilike ? ",
                                              "%#{@search_term}%")).paginate(page: params[:stories_page], per_page: 3)
    render partial: "stories/list_view"
  end

  def search_users
    @search_term = params[:q]
    # @users = User.where("email ilike ?", "%#{@search_term}%")
    @users = User.where("substring(email from 1 for position('@' in email) - 1) ilike ?", "%#{@search_term}%").paginate(
      page: params[:page], per_page: 10
    )
    render partial: "users/list_view"
  end

  def search_tags
    @search_term = params[:q]
    @tags = Tag.where("name ilike ?", "%#{@search_term}%").paginate(page: params[:page], per_page: 9)
    render partial: "tags/list_view"
  end
end
