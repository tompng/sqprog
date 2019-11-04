class AddTitleToQuestions < ActiveRecord::Migration[6.0]
  def up
    add_column :questions, :title, :string, null: false, default: ''
    change_column_default :questions, :title, nil
  end

  def down
    remove_column :questions, :title
  end
end
