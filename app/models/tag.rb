class Tag < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  normalizes :name, with: ->(name) { name.strip.downcase }
end
