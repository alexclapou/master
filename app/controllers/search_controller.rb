class SearchController < ApplicationController
  def index
    @search_term = params[:q]
    return unless @search_term

    @stories = Story.published.joins(:rich_text_content)
                    .where("action_text_rich_texts.body ILIKE ?", "%#{@search_term}%")
                    .or(Story.published.where("title ilike ? ", "%#{@search_term}%"))
    @users = User.where("email ilike ?", "%#{@search_term}%")
    @tags = Tag.where("name ilike ?", "%#{@search_term}%")
  end

  def search_stories
    @search_term = params[:q]
    @stories = Story.all
    render @stories
  end
end
