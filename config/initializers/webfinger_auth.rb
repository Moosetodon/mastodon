# frozen_string_literal: true

Rails.application.configure do
  config.x.webfinger_auth_client['donate.mastodon.club'] = {
    name: 'Mastodon.club Donations',
  }
end
