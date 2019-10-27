module SessionsConcern
  def current_user_uid_secret
    @current_user_uid_secret ||= session[:uid_secret] ||= SecureRandom.alphanumeric 8
  end

  def ikachan?
    current_user_uid == 'ikachan'
  end

  def current_user_uid
    @current_user_uid ||= begin
      prefix = ENV['UID_DIGEST_PREFIX'] || 'ikachan'
      digest = Digest::SHA256.hexdigest "#{prefix}_#{current_user_uid_secret}"
      ikachan_uid_digest = ENV['IKACHAN_UID_DIGEST'] || Digest::SHA256.hexdigest("#{prefix}_ikachan")
      digest == ikachan_uid_digest ? 'ikachan' : digest
    end
  end
end
