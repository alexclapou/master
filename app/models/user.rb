class User < ApplicationRecord
  devise :omniauthable, omniauth_providers: %i[google_oauth2]

  def self.from_omniauth(auth)
    find_or_create_by(provider: auth.provider, uid: auth.uid) do |user|
      user.uid = auth.uid
      user.provider = auth.provider

      user.email = auth.info.email
      user.first_name = auth.info.first_name
      user.last_name = auth.info.last_name
    end
  end
end
