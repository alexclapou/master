require "rails_helper"

RSpec.describe Tag, type: :model do
  describe "validations" do
    subject { FactoryBot.build(:tag) }
    it { should validate_presence_of(:name) }
    it { should validate_uniqueness_of(:name).case_insensitive }
  end

  describe "creation" do
    it "should correctly format the name" do
      name = Faker::Cannabis.health_benefit.titleize
      tag = FactoryBot.create(:tag, name:)

      expect(tag.name).to eq(name.parameterize)
    end
  end
end
