// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  Add,
  Link1,
  KyberNetwork,
  Messages2,
  Calendar1,
  Kanban,
  Profile2User,
  Bill,
  UserSquare,
  ShoppingBag,
  DocumentUpload
} from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  applications: KyberNetwork,
  chat: Messages2,
  calendar: Calendar1,
  kanban: Kanban,
  customer: Profile2User,
  invoice: Bill,
  profile: UserSquare,
  ecommerce: ShoppingBag,
  add: Add,
  link: Link1,
  excelDocument: DocumentUpload
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const applications: NavItemType = {
  id: 'group-applications',
  title: <FormattedMessage id="Gestion AGP-PACT" />,
  icon: icons.applications,
  type: 'group',
  children: [
    {
      id: 'plaignant',
      title: <FormattedMessage id="Plaignants" />,
      type: 'item',
      url: '/gestion/plaignant',
      icon: icons.chat,
      breadcrumbs: false,
      role: ['Administrator', 'Manager']
    },
    {
      id: 'plainte',
      title: <FormattedMessage id="Plaintes" />,
      type: 'item',
      url: '/gestion/plainte',
      icon: icons.calendar,
      role: ['Administrator', 'Manager', 'Complainant']
    },
    {
      id: 'pap',
      title: <FormattedMessage id="PAP" />,
      type: 'item',
      url: '/gestion/pap',
      icon: icons.excelDocument,
      role: ['Administrator', 'Manager']
    },
    {
      id: 'plainte-type',
      title: <FormattedMessage id="Types de plaintes" />,
      type: 'item',
      icon: icons.kanban,
      url: '/gestion/plainte-type',
      link: '/gestion/plainte-type',
      breadcrumbs: false,
      role: ['Administrator', 'Manager']
    },
    {
      id: 'prejudice',
      title: <FormattedMessage id="Préjudices" />,
      type: 'item',
      icon: icons.kanban,
      url: '/gestion/prejudice',
      link: '/gestion/prejudice',
      breadcrumbs: false,
      role: ['Administrator', 'Manager']
    },
    {
      id: 'asset-type',
      title: <FormattedMessage id="Type d'actif" />,
      type: 'item',
      icon: icons.kanban,
      url: '/gestion/asset-type',
      link: '/gestion/asset-type',
      breadcrumbs: false,
      role: ['Administrator']
    },
    {
      id: 'species',
      title: <FormattedMessage id="Espèces" />,
      type: 'item',
      icon: icons.kanban,
      url: '/gestion/species',
      link: '/gestion/species',
      breadcrumbs: false,
      role: ['Administrator']
    },
    {
      id: 'vulnerabilite',
      title: <FormattedMessage id="Vulnérabilités" />,
      type: 'item',
      icon: icons.kanban,
      url: '/gestion/vulnerabilite',
      link: '/gestion/vulnerabilite',
      breadcrumbs: false,
      role: ['Administrator']
    },
    {
      id: 'units',
      title: <FormattedMessage id="Unité de mesure" />,
      type: 'item',
      icon: icons.kanban,
      url: '/gestion/units',
      link: '/gestion/units',
      breadcrumbs: false,
      role: ['Administrator']
    },
    {
      id: 'project-site',
      title: <FormattedMessage id="Tronçons" />,
      type: 'item',
      icon: icons.kanban,
      url: '/gestion/project-site',
      link: '/gestion/project-site',
      breadcrumbs: false,
      role: ['Administrator']
    }
  ]
};

export default applications;
