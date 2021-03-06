import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import LoadingIndicator from '../../components/loading_indicator';
import { fetchBookmarkedStatuses, expandBookmarkedStatuses } from '../../actions/bookmarks';
import Column from '../ui/components/column';
import StatusList from '../../components/status_list';
import ColumnBackButtonSlim from '../../components/column_back_button_slim';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';

const messages = defineMessages({
  heading: { id: 'column.bookmarks', defaultMessage: 'Bookmarks' }
});

const mapStateToProps = state => ({
  statusIds: state.getIn(['status_lists', 'bookmarks', 'items']),
  loaded: state.getIn(['status_lists', 'bookmarks', 'loaded']),
  me: state.getIn(['meta', 'me'])
});

class Bookmarks extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    statusIds: ImmutablePropTypes.list.isRequired,
    loaded: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    me: PropTypes.number.isRequired,
  };

  componentWillMount () {
    this.props.dispatch(fetchBookmarkedStatuses());
  }

  handleScrollToBottom () {
    this.props.dispatch(expandBookmarkedStatuses());
  }

  render () {
    const { statusIds, loaded, intl, me } = this.props;

    if (!loaded) {
      return (
        <Column>
          <LoadingIndicator />
        </Column>
      );
    }

    return (
      <Column icon='floppy-o' heading={intl.formatMessage(messages.heading)}>
        <ColumnBackButtonSlim />
        <StatusList {...this.props} scrollKey='bookmarks' onScrollToBottom={this.handleScrollToBottom} />
      </Column>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(Bookmarks));
