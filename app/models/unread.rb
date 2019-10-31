class Unread < ApplicationRecord
  belongs_to :question

  serializer_field :uid, :time, :questionId
end
