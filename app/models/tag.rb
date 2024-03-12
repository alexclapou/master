class Tag < ApplicationRecord
  normalizes :name, with: ->(name) { name.parameterize }
  validates :name, presence: true, uniqueness: true

  def pretty_name
    name.titleize
  end
end
