module Likeable
  extend ActiveSupport::Concern

  included do
    has_many :likes, as: :record, dependent: :destroy
  end

  def liked_by?(user)
    likes.where(user:).any?
  end

  def like(user)
    like = likes.where(user:).first_or_create
    like.notify_users([self.user] - [user], "like")
    like
  end

  def unlike(user)
    likes.where(user:).destroy_all
  end
end
