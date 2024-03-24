class Story < ApplicationRecord
  belongs_to :user
  has_and_belongs_to_many :tags
  has_rich_text :content

  def display_date
    created_at.strftime("%B #{created_at.day.ordinalize}, %Y")
  end
end
