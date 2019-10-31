class Unread < ApplicationRecord
  belongs_to :question

  serializer_field :id, :uid, :time, :questionId
end
