class Question < ApplicationRecord
  has_many :codes, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :votes, dependent: :destroy
  has_many :question_comments, -> { where code_thread_id: nil }, class_name: 'Comment'
  has_many :unreads, dependent: :destroy
  has_one :author_unread, -> { where uid: uid }, class_name: 'Unread'
  has_one :ikachan_unread, -> { where uid: :ikachan }, class_name: 'Unread'
  scope :resolved, -> { where resolved: true }
  scope :unresolved, -> { where resolved: false }
  validates :mode, inclusion: %w[normal terrible]
  before_validation { self.mode ||= :normal }
  def self.can_create?
    unresolved.count < 20
  end

  def set_unread(uid, time)
    if uid != 'ikachan'
      ikachan_unread ||= Unread.new uid: 'ikachan', time: time
    end
    if uid != self.uid
      author_unread ||= Unread.new uid: self.uid, time: time
    end
  end

  def recalc_unread
    last_time = [created_at, comments.max(:created_at)].copact.max
    [author_unread, ikachan_unread].each do |unread|
      unread.destroy if unread && unread.time > last_time
    end
  end
end
