import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

// project import
import Loader from 'components/Loader';

const Header = lazy(() => import('./Header'));
const FooterBlock = lazy(() => import('./FooterBlock'));

// ==============================|| LAYOUT - SIMPLE / LANDING ||============================== //

export default function SimpleLayout() {
  return (
    <Suspense fallback={<Loader />}>
      <div style={{ minHeight: '100vh' }} className="d-flex flex-column">
        <Header />
        <Outlet />
        <FooterBlock />
      </div>
    </Suspense>
  );
}
