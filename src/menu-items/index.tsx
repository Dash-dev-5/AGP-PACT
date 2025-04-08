// project-imports
import applications from './applications';
import dashboardMenu from './dashboard';
import locationsMenu from './locations';
import widget from './widget';

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

//get user role in localestorage

const menuItems: { items: NavItemType[] } = {
  items: [dashboardMenu, applications, widget, locationsMenu]
};

export default menuItems;
