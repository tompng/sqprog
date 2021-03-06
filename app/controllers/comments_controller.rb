class CommentsController < ApplicationController
  before_action :set_comment, only: [:destroy, :vote, :update]

  def create
    question = Question.find params[:question_id]
    comment = nil
    if params[:code_id]
      code = question.codes.find params[:code_id]
      thread = code.code_threads.where(line_number: params[:line_number]).first_or_initialize
      ApplicationRecord.transaction do
        thread.save! if thread.new_record?
        comment = thread.comments.create! content: params[:content], uid: current_user_uid, question: question
      end
    else
      comment = question.comments.create! content: params[:content], uid: current_user_uid
    end
    question.set_unread current_user_uid, comment.created_at
    render json: ArSerializer.serialize(comment, '*', context: current_user_uid)
  end

  def update
    raise unless ikachan? || @comment.uid == current_user_uid
    @comment.update content: params[:content]
    render json: ArSerializer.serialize(@comment, '*')
  end

  def destroy
    raise unless ikachan? || @comment.uid == current_user_uid
    if @comment.code_thread
      @comment.code_thread&.with_lock do
        if @comment.code_thread.comments.count == 1
          @comment.code_thread.destroy!
        else
          @comment.destroy!
        end
      end
    else
      @comment.destroy!
    end
    @comment.question.recalc_unread
    head :ok
  end

  def vote
    value = params[:value].presence
    if value
      vote = @comment.votes.where(uid: current_user_uid).first_or_initialize
      vote.update! value: value
    else
      @comment.votes.find_by(uid: current_user_uid)&.destroy!
    end
    render json: ArSerializer.serialize(@comment, { myVote: '*' }, context: current_user_uid)
  end

  private

  def set_comment
    @comment = Comment.find params[:id]
  end
end
