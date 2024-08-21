# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    # story
    cannot :manage, Story
    can :read, Story, draft: false
    can(:manage, Story, user:)
    cannot :read, Story, user:, draft: true

    # comment
    cannot :manage, Comment
    can(:manage, Comment, user:)

    # account
    cannot :manage, User
    can :read, User
    can :manage, User, id: user&.id

    # notifications
    can :manage, Notification
  end
end
