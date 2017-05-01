import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ImmutablePropTypes from 'react-immutable-proptypes';
import LoadingIndicator from '../../components/loading_indicator';
import { fetchBookmarkedStatuses, expandBookmarkedStatuses } from '../../actions/bookmarks';
import Column from '../ui/components/column';
import StatusList from '../../components/status_list';
import ColumnBackButtonSlim from '../../components/column_back_button_slim';
import { defineMessages, injectIntl } from 'react-intl';

const messages = defineMessages({
  heading: { id: 'column.bookmarks', defaultMessage: 'Bookmarks' }
});

const mapStateToProps = state => ({
  statusIds: state.getIn(['status_lists', 'bookmarks', 'items']),
  loaded: state.getIn(['status_lists', 'bookmarks', 'loaded']),
  me: state.getIn(['meta', 'me'])
});

const Bookmarks = React.createClass({

  propTypes: {
    params: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    statusIds: ImmutablePropTypes.list.isRequired,
    loaded: React.PropTypes.bool,
    intl: React.PropTypes.object.isRequired,
    me: React.PropTypes.number.isRequired
  },

  mixins: [PureRenderMixin],

  componentWillMount () {
    this.props.dispatch(fetchBookmarkedStatuses());
  },

  handleScrollToBottom () {
    this.props.dispatch(expandBookmarkedStatuses());
  },

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
        <StatusList statusIds={statusIds} me={me} onScrollToBottom={this.handleScrollToBottom} />
      </Column>
    );
  }

});

export default connect(mapStateToProps)(injectIntl(Bookmarks));