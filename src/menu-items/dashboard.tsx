// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Refresh, Home3, HomeTrendUp, Box1 } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

const icons = {
  navigation: Home3,
  dashboard: HomeTrendUp,
  components: Box1,
  loading: Refresh
};

const dashboardMenu: NavItemType = {
  id: 'group-dashboard-loading',
  title: <FormattedMessage id="dashboard" />,
  type: 'group',
  icon: icons.loading,
  children: [
    {
      id: 'dashboard',
      title: <FormattedMessage id="dashboard" />,
      type: 'item',
      icon: icons.dashboard,
      url: '/dashboard'
    }
  ]
};

export default dashboardMenu;
