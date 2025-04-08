import { Fragment, useState, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import NavItem from './NavItem';
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import useConfig from 'hooks/useConfig';
import { MenuOrientation, HORIZONTAL_MAX_ITEM } from 'config';
import { NavItemType, NavRoleType } from 'types/menu';
import { User } from 'types/auth';

const isFound = (arr: any, str: string) => arr.items.some((element: any) => element.id === str);

const Navigation = () => {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));
  const { menuOrientation } = useConfig();

  const [selectedID, setSelectedID] = useState<string | undefined>('');
  const [selectedItems, setSelectedItems] = useState<string | undefined>('');
  const [selectedLevel, setSelectedLevel] = useState<number>(0);

  // Get user role from localStorage
  const userString = localStorage.getItem('users');
  const user = userString ? (JSON.parse(userString) as User) : null;
  const userRole: NavRoleType = user?.role as NavRoleType;

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  const lastItem = isHorizontal ? HORIZONTAL_MAX_ITEM : null;
  let lastItemId = '';
  let remItems: NavItemType[] = [];

  if (lastItem && lastItem < menuItem.items.length) {
    lastItemId = menuItem.items[lastItem - 1].id!;
    remItems = menuItem.items.slice(lastItem - 1).map((item) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon,
      ...(item.url && { url: item.url })
    }));
  }

  const filterMenuByRole = (items: NavItemType[]): NavItemType[] =>
    items
      .filter((item) => !item.role || item.role.includes(userRole))
      .map((item) => ({
        ...item,
        children: item.children ? filterMenuByRole(item.children) : undefined
      }));

  const filteredMenuItems = useMemo(() => filterMenuByRole(menuItem.items), [userRole]);

  const navGroups = filteredMenuItems.map((item) => {
    if (item.type === 'group') {
      return item.url && item.id !== lastItemId ? (
        <Fragment key={item.id}>
          {menuOrientation !== MenuOrientation.HORIZONTAL && <Divider sx={{ my: 0.5 }} />}
          <NavItem item={item} level={1} isParents />
        </Fragment>
      ) : (
        <NavGroup
          key={item.id}
          item={item}
          selectedID={selectedID}
          setSelectedID={setSelectedID}
          setSelectedItems={setSelectedItems}
          setSelectedLevel={setSelectedLevel}
          selectedLevel={selectedLevel}
          selectedItems={selectedItems}
          lastItem={lastItem!}
          remItems={remItems}
          lastItemId={lastItemId}
        />
      );
    }

    return (
      <Typography key={item.id} variant="h6" color="error" align="center">
        Fix - Navigation Group
      </Typography>
    );
  });

  return (
    <Box
      sx={{ pt: isHorizontal ? 0 : 2, '& > ul:first-of-type': { mt: 0 }, display: isHorizontal ? { xs: 'block', lg: 'flex' } : 'block' }}
    >
      {navGroups}
    </Box>
  );
};

export default Navigation;
