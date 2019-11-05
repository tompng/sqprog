class ApiController < ApplicationController
  class QuestionCollection
    include ArSerializer::Serializable
    attr_reader :collection, :total, :limit, :offset
    def initialize(collection:, total:, limit:, offset:)
      @collection = collection
      @total = total
      @limit = limit
      @offset = offset
    end
    serializer_field :total, :limit, :offset, type: :int
    serializer_field :collection, type: [Question]
  end

  class RootObject
    include ArSerializer::Serializable
    serializer_field :question, params_type: { id: :int }, type: Question do |_uid, id:|
      Question.find id
    end
    serializer_field :comment, params_type: { id: :int }, type: Comment do |_uid, id:|
      Comment.find id
    end
    serializer_field :unreads, type: Unread do |uid|
      Unread.where uid: uid
    end
    serializer_field(
      :questions,
      type: QuestionCollection,
      params_type: { mode: %w[all mine resolved unresolved], limit: :int, offset: :int }
    ) do |uid, mode: 'all', limit: 10, offset: 0|
      questions = case mode
      when 'mine'
        Question.where uid: uid
      when 'resolved'
        Question.resolved
      when 'unresolved'
        Question.unresolved
      else
        Question.all
      end
      QuestionCollection.new(
        limit: limit.to_i,
        offset: offset.to_i,
        total: questions.count,
        collection: questions.limit(limit.to_i).offset(offset.to_i)
      )
    end
  end

  def show
    render json: ArSerializer.serialize(
      RootObject.new,
      { data: raw_params[:query].as_json },
      context: current_user_uid
    ).values.first
  end
end
