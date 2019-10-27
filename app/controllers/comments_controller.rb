class CommentsController < ApplicationController
  before_action :set_comment, only: [:destroy, :vote]

  def create
    question = Question.find params[:question_id]
    if params[:code_id]
      code = Code.find params[:code_id]
      thread = code.code_threads.where(line_number: params[:line_number]).first_or_initialize
    end
    comment = question.comments.create! content: params[:content], uid: current_user_uid, code_thread: thread
    question.set_unread current_user_uid, comment.created_at
  end

  def destroy
    raise unless ikachan? || @comment.uid == current_user_uid
    @comment.code_thread&.with_lock do
      if @comment.code_thread.comments.count == 1
        @comment.code_thread.destroy!
      else
        @comment.destroy!
      end
    end
    @comment.question.question.recalc_unread
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
    head :ok
  end

  private

  def set_comment
    @comment = Comment.find params[:id]
  end
end
