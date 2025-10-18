import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import AuthWrapper from '@/components/AuthWrapper';
import NotFound from '@/pages/NotFound';
import Auth from '@/pages/Auth';
import Home from '@/pages/Home';
import Users from '@/pages/Users';
// import Chat from '@/pages/Chat';
// import Home from '@/pages/Home';

export const publicRoutes: RouteObject[] = [
  {
    path: '/auth',
    element: (
      <AuthWrapper>
        <Auth />
      </AuthWrapper>
    ),
  },
];

export const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: '/users',
    element: (
      // <ProtectedRoute>
        <Users />
      // </ProtectedRoute>
    ),
  },
  // {
  //   path: '/chat',
  //   element: (
  //     <ProtectedRoute>
  //       <Chat />
  //     </ProtectedRoute>
  //   ),
  // },
];

export const commonRoutes: RouteObject[] = [
  {
    path: '*',
    element: <NotFound />,
  },
];

export const routes: RouteObject[] = [...publicRoutes, ...protectedRoutes,...commonRoutes];