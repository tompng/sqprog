class CreateInitialTables < ActiveRecord::Migration[6.0]
  def change
    create_table :questions do |t|
      t.string :uid, null: false
      t.string :mode, null: false
      t.text :description, null: false
      t.boolean :resolved, null: false, default: false
      t.timestamps null: false
      t.index :uid
    end

    create_table :codes do |t|
      t.references :question, null: false, foreign_key: true
      t.string :file_name, null: false
      t.text :code, null: false
      t.integer :lines, null: false
      t.timestamps null: false
    end

    create_table :code_threads do |t|
      t.references :code, null: false, index: false, foreign_key: true
      t.integer :line_number, null: false
      t.string :uid, null: false
      t.timestamps null: false
      t.index [:code_id, :line_number], unique: true
      t.index :uid
    end

    create_table :comments do |t|
      t.references :question, null: false, foreign_key: true
      t.references :code_thread, foreign_key: true
      t.string :uid, null: false
      t.text :content, null: false
      t.timestamps null: false
      t.index :uid
    end

    create_table :unreads do |t|
      t.references :question, null: false, foreign_key: true
      t.string :uid, null: false
      t.datetime :time, null: false
      t.timestamps null: false
      t.index [:uid, :question_id], unique: true
    end

    create_table :votes do |t|
      t.references :question, index: false, foreign_key: true
      t.references :comment, index: false, foreign_key: true
      t.string :uid, null: false
      t.string :value, null: false
      t.timestamps null: false
      t.index [:question_id, :uid], unique: true
      t.index [:comment_id, :uid], unique: true
      t.index :uid
    end
  end
end
