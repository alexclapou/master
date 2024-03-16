class CreateStoriesTagsTable < ActiveRecord::Migration[7.1]
  def change
    create_table :stories_tags do |t|
      t.belongs_to :story
      t.belongs_to :tag
    end
  end
end
