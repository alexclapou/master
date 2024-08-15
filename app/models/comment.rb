class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :story
  has_many :likes, as: :record, dependent: :destroy
  include Notificable

  def liked_by?(user)
    likes.where(user:).any?
  end

  def like(user)
    like = likes.where(user:).first_or_create
    like.notify_users([self.user], "like")
  end

  def unlike(user)
    likes.where(user:).destroy_all
  end

  default_scope { order(created_at: :desc) }
end
