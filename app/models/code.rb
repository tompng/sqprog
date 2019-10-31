class Code < ApplicationRecord
  belongs_to :question
  has_many :code_threads, dependent: :destroy
  has_many :comments, through: :code_threads
  before_validation do
    self.lines = code.count("\n") + (code[-1] == "\n" ? 0 : 1)
  end

  serializer_field :id, :fileName, :code, :lines, :createdAt
  serializer_field :threads, association: :code_threads
end
