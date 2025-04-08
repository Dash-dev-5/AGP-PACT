// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Story, Fatrows, PresentionChart } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  widgets: Story,
  statistics: Story,
  data: Fatrows,
  chart: PresentionChart
};

// ==============================|| MENU ITEMS - WIDGETS ||============================== //

const widget: NavItemType = {
  id: 'user-management',
  title: <FormattedMessage id="Gesion des utilisateurs" />,
  icon: icons.widgets,
  type: 'group',
  role: ['Administrator'],
  children: [
    {
      id: 'user',
      title: <FormattedMessage id="Utilisateurs" />,
      type: 'item',
      url: '/user',
      icon: icons.data
    },
    {
      id: 'comite',
      title: <FormattedMessage id="Comités" />,
      type: 'item',
      url: '/comite',
      icon: icons.data
    },
    {
      id: 'group-commitee',
      title: <FormattedMessage id="Groupes de comités" />,
      type: 'item',
      url: '/group-commitee',
      icon: icons.data
    },
    {
      id: 'villages-of-commitee',
      title: <FormattedMessage id="Localités" />,
      type: 'item',
      url: '/villages-of-commitee',
      icon: icons.data
    },
    {
      id: 'faq',
      title: <FormattedMessage id="Foire Aux Questions" />,
      type: 'item',
      url: '/faq',
      icon: icons.data
    }
  ]
};

export default widget;
