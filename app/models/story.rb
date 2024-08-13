class Story < ApplicationRecord
  belongs_to :user
  has_rich_text :content
  has_one_attached :thumbnail
  has_and_belongs_to_many :tags
  default_scope { order(created_at: :desc) }
  scope :published, -> { where(draft: false) }
  has_many :comments, dependent: :destroy
  has_many :likes, as: :record, dependent: :destroy

  def liked_by?(user)
    likes.where(user:).any?
  end

  def like(user)
    likes.where(user:).first_or_create
  end

  def unlike(user)
    likes.where(user:).destroy_all
  end

  def display_date
    created_at.strftime("%B #{created_at.day.ordinalize}, %Y")
  end
end
