# frozen_string_literal: true

class DeviseCreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :email, null: false, default: ""
      t.string :first_name, null: false, default: ""
      t.string :last_name, null: false, default: ""
      t.string :provider, null: false, default: ""
      t.string :uid, null: false, default: ""

      t.timestamps null: false
    end

    add_index :users, :email, unique: true
  end
end
