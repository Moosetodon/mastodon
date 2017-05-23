import {
  ACCOUNT_FETCH_SUCCESS,
  FOLLOWERS_FETCH_SUCCESS,
  FOLLOWERS_EXPAND_SUCCESS,
  FOLLOWING_FETCH_SUCCESS,
  FOLLOWING_EXPAND_SUCCESS,
  ACCOUNT_TIMELINE_FETCH_SUCCESS,
  ACCOUNT_TIMELINE_EXPAND_SUCCESS,
  FOLLOW_REQUESTS_FETCH_SUCCESS,
  FOLLOW_REQUESTS_EXPAND_SUCCESS,
} from '../actions/accounts';
import {
  BLOCKS_FETCH_SUCCESS,
  BLOCKS_EXPAND_SUCCESS,
} from '../actions/blocks';
import {
  MUTES_FETCH_SUCCESS,
  MUTES_EXPAND_SUCCESS,
} from '../actions/mutes';
import { COMPOSE_SUGGESTIONS_READY } from '../actions/compose';
import {
  REBLOG_SUCCESS,
  UNREBLOG_SUCCESS,
  FAVOURITE_SUCCESS,
  UNFAVOURITE_SUCCESS,
  BOOKMARK_SUCCESS,
  UNBOOKMARK_SUCCESS,
  BOOKMARKS_FETCH_SUCCESS,
  REBLOGS_FETCH_SUCCESS,
  FAVOURITES_FETCH_SUCCESS,
} from '../actions/interactions';
import {
  TIMELINE_REFRESH_SUCCESS,
  TIMELINE_UPDATE,
  TIMELINE_EXPAND_SUCCESS,
} from '../actions/timelines';
import {
  STATUS_FETCH_SUCCESS,
  CONTEXT_FETCH_SUCCESS,
} from '../actions/statuses';
import { SEARCH_FETCH_SUCCESS } from '../actions/search';
import {
  NOTIFICATIONS_UPDATE,
  NOTIFICATIONS_REFRESH_SUCCESS,
  NOTIFICATIONS_EXPAND_SUCCESS,
} from '../actions/notifications';
import {
  FAVOURITED_STATUSES_FETCH_SUCCESS,
  FAVOURITED_STATUSES_EXPAND_SUCCESS,
} from '../actions/favourites';
import {
  BOOKMARKED_STATUSES_FETCH_SUCCESS,
  BOOKMARKED_STATUSES_EXPAND_SUCCESS 
} from '../actions/bookmarks';

import { STORE_HYDRATE } from '../actions/store';
import Immutable from 'immutable';

const normalizeAccount = (state, account) => {
  account = { ...account };

  delete account.followers_count;
  delete account.following_count;
  delete account.statuses_count;

  return state.set(account.id, Immutable.fromJS(account));
};

const normalizeAccounts = (state, accounts) => {
  accounts.forEach(account => {
    state = normalizeAccount(state, account);
  });

  return state;
};

const normalizeAccountFromStatus = (state, status) => {
  state = normalizeAccount(state, status.account);

  if (status.reblog && status.reblog.account) {
    state = normalizeAccount(state, status.reblog.account);
  }

  return state;
};

const normalizeAccountsFromStatuses = (state, statuses) => {
  statuses.forEach(status => {
    state = normalizeAccountFromStatus(state, status);
  });

  return state;
};

const initialState = Immutable.Map();

export default function accounts(state = initialState, action) {
  switch(action.type) {
  case STORE_HYDRATE:
    return state.merge(action.state.get('accounts'));
  case ACCOUNT_FETCH_SUCCESS:
  case NOTIFICATIONS_UPDATE:
    return normalizeAccount(state, action.account);
  case FOLLOWERS_FETCH_SUCCESS:
  case FOLLOWERS_EXPAND_SUCCESS:
  case FOLLOWING_FETCH_SUCCESS:
  case FOLLOWING_EXPAND_SUCCESS:
  case REBLOGS_FETCH_SUCCESS:
  case FAVOURITES_FETCH_SUCCESS:
  case BOOKMARKS_FETCH_SUCCESS:
  case COMPOSE_SUGGESTIONS_READY:
  case FOLLOW_REQUESTS_FETCH_SUCCESS:
  case FOLLOW_REQUESTS_EXPAND_SUCCESS:
  case BLOCKS_FETCH_SUCCESS:
  case BLOCKS_EXPAND_SUCCESS:
  case MUTES_FETCH_SUCCESS:
  case MUTES_EXPAND_SUCCESS:
    return normalizeAccounts(state, action.accounts);
  case NOTIFICATIONS_REFRESH_SUCCESS:
  case NOTIFICATIONS_EXPAND_SUCCESS:
  case SEARCH_FETCH_SUCCESS:
    return normalizeAccountsFromStatuses(normalizeAccounts(state, action.accounts), action.statuses);
  case TIMELINE_REFRESH_SUCCESS:
  case TIMELINE_EXPAND_SUCCESS:
  case ACCOUNT_TIMELINE_FETCH_SUCCESS:
  case ACCOUNT_TIMELINE_EXPAND_SUCCESS:
  case CONTEXT_FETCH_SUCCESS:
  case FAVOURITED_STATUSES_FETCH_SUCCESS:
  case FAVOURITED_STATUSES_EXPAND_SUCCESS:
  case BOOKMARKED_STATUSES_FETCH_SUCCESS:
  case BOOKMARKED_STATUSES_EXPAND_SUCCESS:
    return normalizeAccountsFromStatuses(state, action.statuses);
  case REBLOG_SUCCESS:
  case FAVOURITE_SUCCESS:
  case UNREBLOG_SUCCESS:
  case UNFAVOURITE_SUCCESS:
  case BOOKMARK_SUCCESS:
  case UNBOOKMARK_SUCCESS:
    return normalizeAccountFromStatus(state, action.response);
  case TIMELINE_UPDATE:
  case STATUS_FETCH_SUCCESS:
    return normalizeAccountFromStatus(state, action.status);
  default:
    return state;
  }
};
