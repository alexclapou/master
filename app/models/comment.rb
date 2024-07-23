class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :story

  default_scope { order(created_at: :desc) }
end
