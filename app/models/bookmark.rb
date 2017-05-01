# frozen_string_literal: true

class Bookmark < ApplicationRecord
  include Paginable

  belongs_to :account, inverse_of: :bookmarks, required: true
  belongs_to :status,  inverse_of: :bookmarks, required: true

  validates :status_id, uniqueness: { scope: :account_id }

  before_validation do
    self.status = status.reblog if status&.reblog?
  end
end
