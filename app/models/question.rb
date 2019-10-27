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
end
