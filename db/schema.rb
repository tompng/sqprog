# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_10_27_155447) do

  create_table "code_threads", force: :cascade do |t|
    t.integer "code_id", null: false
    t.integer "line_number", null: false
    t.string "uid", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["code_id", "line_number"], name: "index_code_threads_on_code_id_and_line_number", unique: true
    t.index ["uid"], name: "index_code_threads_on_uid"
  end

  create_table "codes", force: :cascade do |t|
    t.integer "question_id", null: false
    t.string "file_name", null: false
    t.text "code", null: false
    t.integer "lines", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["question_id"], name: "index_codes_on_question_id"
  end

  create_table "comments", force: :cascade do |t|
    t.integer "question_id", null: false
    t.integer "code_thread_id"
    t.string "uid", null: false
    t.text "content", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["code_thread_id"], name: "index_comments_on_code_thread_id"
    t.index ["question_id"], name: "index_comments_on_question_id"
    t.index ["uid"], name: "index_comments_on_uid"
  end

  create_table "questions", force: :cascade do |t|
    t.string "uid", null: false
    t.string "mode", null: false
    t.text "description", null: false
    t.boolean "resolved", default: false, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["uid"], name: "index_questions_on_uid"
  end

  create_table "unreads", force: :cascade do |t|
    t.integer "question_id", null: false
    t.string "uid", null: false
    t.datetime "time", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["question_id"], name: "index_unreads_on_question_id"
    t.index ["uid", "question_id"], name: "index_unreads_on_uid_and_question_id", unique: true
  end

  create_table "votes", force: :cascade do |t|
    t.integer "question_id"
    t.integer "comment_id"
    t.string "uid", null: false
    t.string "value", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["comment_id", "uid"], name: "index_votes_on_comment_id_and_uid", unique: true
    t.index ["question_id", "uid"], name: "index_votes_on_question_id_and_uid", unique: true
    t.index ["uid"], name: "index_votes_on_uid"
  end

  add_foreign_key "code_threads", "codes"
  add_foreign_key "codes", "questions"
  add_foreign_key "comments", "code_threads"
  add_foreign_key "comments", "questions"
  add_foreign_key "unreads", "questions"
  add_foreign_key "votes", "comments"
  add_foreign_key "votes", "questions"
end
