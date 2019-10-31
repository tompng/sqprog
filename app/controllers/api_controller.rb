class ApiController < ApplicationController
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
      type: [Question],
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
      questions.limit(limit.to_i).offset(offset.to_i)
    end
  end

  def show
    base_query = raw_params[:query]
    field_name = base_query[:field]
    query = { field_name => { params: base_query[:params].as_json, query: base_query[:query].as_json } }
    render json: ArSerializer.serialize(RootObject.new, query, context: current_user_uid).values.first
  end
end
