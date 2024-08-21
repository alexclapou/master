class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :story, counter_cache: true
  validates_presence_of :body

  include Notificable
  include Likeable

  default_scope { order(created_at: :desc) }
end
