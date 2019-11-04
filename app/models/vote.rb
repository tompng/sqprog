class Vote < ApplicationRecord
  belongs_to :question, optional: true
  belongs_to :comment, optional: true
  validates :question_id, presence: true, unless: :comment_id?
  validates :question_id, absence: true, if: :comment_id?
  VALUES = %w[up down forward rotate]
  validates :value, inclusion: VALUES
  serializer_field :id, :uid, :createdAt
  serializer_field :value, type: VALUES
end
