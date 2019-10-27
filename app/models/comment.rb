class Comment < ApplicationRecord
  belongs_to :question
  belongs_to :code_thread, optional: true
  has_many :votes, dependent: :destroy
end
