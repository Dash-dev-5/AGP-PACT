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

const locationsMenu: NavItemType = {
  id: 'group-location',
  title: <FormattedMessage id="localisation" />,
  type: 'group',
  icon: icons.loading,
  role: ['Administrator', 'Manager'],
  children: [
    {
      id: 'province',
      title: <FormattedMessage id="province" />,
      type: 'item',
      url: '/location/province',
      breadcrumbs: false
    },
    {
      id: 'Territoire',
      title: <FormattedMessage id="Territoire" />,
      type: 'item',
      url: '/location/territoire',
      breadcrumbs: false
    },
    {
      id: 'ville',
      title: <FormattedMessage id="ville" />,
      type: 'item',
      url: '/location/ville',
      breadcrumbs: false
    }
  ]
};

export default locationsMenu;
