class CodeThread < ApplicationRecord
  belongs_to :code
  has_many :comments, dependent: :destroy

  serializer_field :id, :lineNumber, :createdAt
  serializer_field :comments
end
