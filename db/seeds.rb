puts "creating dummy users...".colorize(:light_green)
q = User.create(email: "a@a.com", password: "parola")

puts "creating dummy stories...".colorize(:light_green)
Story.create(user_id: q.id)
Story.create(user_id: q.id)
Story.create(user_id: q.id)
Story.create(user_id: q.id)
puts "creating tags...".colorize(:light_green)
tags = %w[cooking programming drawing poetry photography football painting sport algorithms social-media gaming movies
          software-engineering]
Tag.delete_all
Tag.create(tags.map { |tag| { name: tag } })
puts "done".colorize(:light_green)
