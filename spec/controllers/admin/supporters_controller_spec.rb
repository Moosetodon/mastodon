require 'rails_helper'

describe Admin::SupportersController do
  let(:account) { Fabricate(:account) }
  before do
    sign_in Fabricate(:user, admin: true), scope: :user
  end

  describe 'POST #create' do
    it 'redirects to admin accounts page' do
      post :create, params: { account_id: account.id }

      expect(response).to redirect_to admin_account_path(account.id)
    end
  end

  describe 'DELETE #destroy' do
    it 'redirects to admin accounts page' do
      delete :destroy, params: { account_id: account.id }

      expect(response).to redirect_to admin_account_path(account.id)
    end
  end
end
