class Vote < ApplicationRecord
  belongs_to :question, optional: true
  belongs_to :comment, optional: true
  validates :question_id, presence: true, unless: :comment_id?
  validates :question_id, absence: true, if: :comment_id?
  validates :value, inclusion: %w[up down left right up-left up-right down-left down-right]
end
