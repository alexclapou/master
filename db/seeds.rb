puts "creating tags...".colorize(:light_green)
tags = %w[cooking programming drawing poetry photography football painting sport algorithms social-media gaming movies
          software-engineering]
Tag.create(tags.map { |tag| { name: tag } })

puts "creating users...".colorize(:light_green)
users = []
users << { email: "alex@yahoo.com", password: "parola", first_name: "Alex", last_name: "Clapou" }
50.times do |idx|
  first_name = Faker::Name.first_name
  last_name = Faker::Name.last_name
  email = Faker::Internet.email(name: "#{first_name} #{last_name}")
  users << { email:, password: "parola", first_name:, last_name: }
end
User.create(users)

puts "creating stories...".colorize(:light_green)

puts "done".colorize(:light_green)
