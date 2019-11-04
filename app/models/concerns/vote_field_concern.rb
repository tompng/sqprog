module VoteFieldConcern
  extend ActiveSupport::Concern
  included do
    vote_parent_name = model_name.singular.to_sym
    vote_parent_key = "#{vote_parent_name}_id".to_sym
    summary_type = -> { Vote::VALUES.map { |v| [v, [:int, nil]] }.to_h }
    serializer_field :voteSummary, type: summary_type, preload: -> models {
      counts = Vote.where(vote_parent_name => models).group(vote_parent_key, :value).count
      Hash.new({}).merge counts.group_by { |(q, _v), _c| q }.transform_values { |vs| vs.map { |(_q, v), c| [v, c] }.to_h }
    }
    serializer_field :myVote, type: -> { Vote }, preload: -> (models, uid) {
      Vote.where(vote_parent_name => models, uid: uid).index_by(&vote_parent_key)
    }
  end
end
