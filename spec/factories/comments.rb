FactoryBot.define do
  factory :comment do
    body { "MyText" }
    user { nil }
    story { nil }
  end
end
