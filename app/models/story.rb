class Story < ApplicationRecord
  belongs_to :user
  has_rich_text :content
  has_one_attached :thumbnail
  has_and_belongs_to_many :tags
  has_many :comments, dependent: :destroy

  default_scope { order(created_at: :desc) }
  scope :published, -> { where(draft: false) }

  include Likeable

  def display_date
    created_at.strftime("%B #{created_at.day.ordinalize}, %Y")
  end
end
