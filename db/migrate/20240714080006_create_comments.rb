class CreateComments < ActiveRecord::Migration[7.1]
  def change
    create_table :comments do |t|
      t.text :body
      t.references :user, null: false, foreign_key: true
      t.references :story, null: false, foreign_key: true
      t.integer :likes_count, default: 0

      t.timestamps
    end
  end
end
