class Tag < ApplicationRecord
  normalizes :name, with: ->(name) { name.parameterize }
  validates :name, presence: true, uniqueness: true

  has_and_belongs_to_many :posts
  def pretty_name
    name.titleize
  end
end
