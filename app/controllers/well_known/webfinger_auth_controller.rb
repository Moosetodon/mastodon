# frozen_string_literal: true

module WellKnown
  class WebfingerAuthController < ApplicationController
    include AccountControllerConcern

    before_action :authenticate_user!
    before_action :set_body_classes

    def authenticate_user!
      redirect_to(single_user_mode? ? account_path(Account.first) : about_path) unless user_signed_in?
    end

    def show
      lookup = Rails.configuration.x.webfinger_auth_client[params[:client_id]]
      @client = lookup ? lookup : { name: 'An Unknown Application' }
    end

    def create
      raw_token = params[:token]
      callback = params[:callback] # verify legitimacy
      identity = @account.to_webfinger_s
      signed = "#{raw_token}.base64url.RSA-SHA256"

      key = @account.keypair
      digest = OpenSSL::Digest::SHA256.new
      signature = Base64.urlsafe_encode64(key.sign(digest, signed))

      redirection = "#{callback}?identity=#{identity}&signed=#{signed}&signature=#{signature}"
      redirect_to redirection
    end

    def destroy
      callback = params[:callback]
      redirection = "#{callback}?identity=denied&signature=null"
      redirect_to redirection
    end

    def set_body_classes
      @body_classes = 'webfinger-auth-body'
    end
  end
end
