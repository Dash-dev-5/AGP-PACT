import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import PagesLayout from 'layout/Pages';
import SimpleLayout from 'layout/Simple';
import FormPlainteGenerale from 'pages/apps/formPlainteGenerale';
import ProtectedRoute from './protectedRoute';
import ShowPap from 'pages/apps/pap/ShowPap';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard'))); 

// render - widget
const Utilisateur = Loadable(lazy(() => import('pages/widget/utilisateur')));
const Comite = Loadable(lazy(() => import('pages/widget/commitee')));
const VillagesOfCommittee = Loadable(lazy(() => import('pages/widget/villagesOfCommittee')));

const GroupCommittee = Loadable(lazy(() => import('pages/widget/groupCommittee')));
const Faq = Loadable(lazy(() => import('pages/widget/faq')));

// render - applications
const PlaignantPage = Loadable(lazy(() => import('pages/apps/plaignant-page')));
const PlaintePage = Loadable(lazy(() => import('pages/apps/plainte-page')));

const PlainteTypePage = Loadable(lazy(() => import('pages/apps/plainte-type-page')));
const Prejudice = Loadable(lazy(() => import('pages/apps/prejudice/index')));

const Species = Loadable(lazy(() => import('pages/apps/species/index')));

const Vulnerabilite = Loadable(lazy(() => import('pages/apps/Vulnerabilite/index')));

const Units = Loadable(lazy(() => import('pages/apps/units')));
const ProjectSite = Loadable(lazy(() => import('pages/apps/projectSite')));

const DetailComplait = Loadable(lazy(() => import('pages/apps/plaignant/detailComplait')));
const AssetType = Loadable(lazy(() => import('pages/apps/assetType')));
const SpeciesPrice = Loadable(lazy(() => import('pages/apps/species-price')));
const ChooseComplaintType = Loadable(lazy(() => import('pages/apps/chooseComplaintType')));
const AnonymousComplaint = Loadable(lazy(() => import('sections/landing/anonymous-complaint')));
const Province = Loadable(lazy(() => import('pages/apps/location/province')));
const Territoire = Loadable(lazy(() => import('pages/apps/location/territoire')));
const Ville = Loadable(lazy(() => import('pages/apps/location/ville')));
const GestionPap = Loadable(lazy(() => import('pages/apps/pap')));
const AddPap = Loadable(lazy(() => import('pages/apps/pap/AddPap')));
const UpdatePap = Loadable(lazy(() => import('pages/apps/pap/UpdatePap')));

// pages routing
const AuthLogin = Loadable(lazy(() => import('pages/auth/auth1/login')));
const AuthRegister = Loadable(lazy(() => import('pages/auth/auth1/register')));
const AuthForgotPassword = Loadable(lazy(() => import('pages/auth/auth1/forgot-password')));
const AuthResetPassword = Loadable(lazy(() => import('pages/auth/auth1/reset-password')));
const AuthCheckMail = Loadable(lazy(() => import('pages/auth/auth1/check-mail')));
const AuthCodeVerification = Loadable(lazy(() => import('pages/auth/auth1/code-verification')));
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/error/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/error/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon/coming-soon')));

// render - sample page
const Landing = Loadable(lazy(() => import('pages/landing')));

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    { path: 'anonymous-complaint', element: <AnonymousComplaint /> },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'dashboard',
          element: <DashboardDefault />
        },

        {
          path: 'user',
          element: <ProtectedRoute allowedRoles={['Administrator']} />, 
          children: [
            //user
            {
              index: true,
              element: <Utilisateur />
            }
          ]
        },
        {
          path: 'comite',
          element: <ProtectedRoute allowedRoles={['Administrator']} />,
          children: [
            //committee
            {
              index: true,
              element: <Comite />
            }
          ]
        },
        {
          path: 'group-commitee',
          element: <ProtectedRoute allowedRoles={['Administrator']} />,
          children: [
            //committee
            {
              index: true,
              element: <GroupCommittee />
            }
          ]
        },
        {
          path: 'villages-of-commitee',
          element: <ProtectedRoute allowedRoles={['Administrator']} />,
          children: [
            //committee
            {
              index: true,
              element: <VillagesOfCommittee />
            }
          ]
        },
        {
          path: 'faq',
          element: <ProtectedRoute allowedRoles={['Administrator']} />,
          children: [
            //committee
            {
              index: true,
              element: <Faq />
            }
          ]
        },
        {
          path: 'gestion',
          children: [
            //Complainant
            {
              path: 'plaignant',
              element: (
                <ProtectedRoute allowedRoles={['Manager', 'Administrator']}>
                  <PlaignantPage />
                </ProtectedRoute>
              )
            },
            //Complaint
            {
              path: 'plainte',
              element: <ProtectedRoute allowedRoles={['Manager', 'Administrator', 'Complainant']} />,
              children: [
                {
                  index: true,
                  element: <PlaintePage />
                },
                {
                  path: 'plainte-generale',
                  element: <FormPlainteGenerale />
                },
                {
                  path: ':id',
                  element: <DetailComplait />
                }
              ]
            },
            // Gestion PAP
            {
              path: 'plainte-type',
              element: (
                <ProtectedRoute allowedRoles={['Manager', 'Administrator']}>
                  <PlainteTypePage />
                </ProtectedRoute>
              )
            },
            //Complaint type
            {
              path: 'pap',
              element: <ProtectedRoute allowedRoles={['Manager', 'Administrator']} />,
              children: [
                { index: true, element: <GestionPap /> },
                { path: 'new', element: <AddPap /> },
                { path: 'update/:papId', element: <UpdatePap /> },
                { path: ':papId', element: <ShowPap /> }
              ]
            },
            //Prejudice
            {
              path: 'prejudice',
              element: (
                <ProtectedRoute allowedRoles={['Manager', 'Administrator']}>
                  <Prejudice />
                </ProtectedRoute>
              )
            },
            //categorie d'espèce
            {
              path: 'asset-type',
              element: (
                <ProtectedRoute allowedRoles={['Administrator']}>
                  <AssetType />
                </ProtectedRoute>
              )
            },
            //Species
            {
              path: 'species',
              element: <ProtectedRoute allowedRoles={['Administrator']} />,
              children: [
                { index: true, element: <Species /> },
                { path: ':priceId', element: <SpeciesPrice /> }
              ]
            },
            {
              path: 'vulnerabilite',
              element:
              <ProtectedRoute allowedRoles={['Administrator']}>
                  <Vulnerabilite />
              </ProtectedRoute>
            },
            //Unit
            {
              path: 'units',
              element: (
                <ProtectedRoute allowedRoles={['Administrator']}>
                  <Units />
                </ProtectedRoute>
              )
            },
            //Project Site
            {
              path: 'project-site',
              element: (
                <ProtectedRoute allowedRoles={['Administrator']}>
                  <ProjectSite />
                </ProtectedRoute>
              )
            }
          ]
        },
        {
          path: 'location',
          element: <ProtectedRoute allowedRoles={['Administrator']} />,
          children: [
            {
              path: 'province',
              element: <Province />
            },
            {
              path: 'territoire',
              element: <Territoire />
            },
            {
              path: 'ville',
              element: <Ville />
            }
          ]
        }
      ]
    },
    {
      path: '/',
      element: <SimpleLayout />,
      children: [
        {
          path: 'landing',
          element: <Landing />
        },
        {
          path: 'select-complaint',
          element: <ChooseComplaintType />
        }
      ]
    },
    {
      path: '/maintenance',
      element: <PagesLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        }
      ]
    },
    {
      path: '/auth',
      element: <PagesLayout />,
      children: [
        {
          path: 'login',
          element: <AuthLogin />
        },
        {
          path: 'register',
          element: <AuthRegister />
        },
        {
          path: 'forgot-password',
          element: <AuthForgotPassword />
        },
        {
          path: 'reset-password',
          element: <AuthResetPassword />
        },
        {
          path: 'check-mail',
          element: <AuthCheckMail />
        },
        {
          path: 'code-verification',
          element: <AuthCodeVerification />
        }
      ]
    },
    { path: '*', element: <MaintenanceError /> }
  ]
};

export default MainRoutes;
