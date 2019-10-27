class QuestionsController < ApplicationController
  before_action :set_question, only: %i[show destroy read resolve vote]

  def new
  end

  def index
    @resolved_questions = Question.resolved
    @unresolved_questions = Question.unresolved
    @my_questions = Question.where(uid: current_user_uid)
    @unread_questions = Question.where(id: Unread.where(uid: current_user_uid).select(:question_id))
  end

  def show
  end

  def read
    @question.unreads.find_by(uid: current_user_uid)&.destroy!
    head :ok
  end

  def resolve
    raise unless ikachan
    @question.update! resolved: true
    head :ok
  end

  def create
    raise unless Question.can_create?
    raise if Question.where(uid: current_user_id).where('created_at > ?', 1.minutes.ago).exists?
    @question = Question.new description: create_params[:description], uid: current_user_uid
    create_params[:codes].each do |code_params|
      code = code_params[:code].to_s
      next if code.empty?
      file_name = code_params[:file_name].to_s.strip.presence
      @question.codes.new file_name: file_name || 'untitled', code: code
    end
    raise if @question.codes.empty?
    @question.save!
  end

  def destroy
    raise unless ikachan?
    @question.destroy!
    head :ok
  end

  def vote
    value = params[:value].presence
    if value
      vote = @question.votes.where(uid: current_user_uid).first_or_initialize
      vote.update! value: value
    else
      @question.votes.find_by(uid: current_user_uid)&.destroy!
    end
    head :ok
  end

  private

  def create_params
    params.permit :description, codes: [:file_name, :code]
  end

  def set_question
    @question = Question.find params[:id]
  end
end
