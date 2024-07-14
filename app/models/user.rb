class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: %i[google_oauth2]

  has_many :stories, dependent: :destroy # no need of (after/before)_destroy callbacks
  has_many :comments

  def self.from_omniauth(auth)
    find_or_create_by(provider: auth.provider, uid: auth.uid) do |user|
      user.uid = auth.uid
      user.provider = auth.provider

      user.email = auth.info.email
      user.first_name = auth.info.first_name
      user.last_name = auth.info.last_name
    end
  end

  def password_required?
    return false if provider.present? && uid.present?

    true
  end

  def name
    "#{first_name} #{last_name}"
  end

  def name_initials
    "#{first_name.chr}#{last_name.chr}".upcase
  end
end
