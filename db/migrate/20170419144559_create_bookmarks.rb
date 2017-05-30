class CreateBookmarks < ActiveRecord::Migration[5.0]
  def change
    create_table :bookmarks do |t|
      t.integer :account_id, null: false
      t.integer :status_id, null: false

      t.timestamps null: false
    end

    add_index :bookmarks, [:account_id, :status_id], unique: true
  end
end