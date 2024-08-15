class CreateNotifications < ActiveRecord::Migration[7.1]
  def change
    create_table :notifications do |t|
      t.references :item, polymorphic: true, null: false
      t.references :user, null: false, foreign_key: true
      t.boolean :viewed
      t.string :action

      t.timestamps
    end
  end
end
