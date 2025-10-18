import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthWrapper = ({ children, requireAuth = false }: AuthWrapperProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      navigate('/auth', {
        state: { from: location.pathname },
        replace: true,
      });
    } else if (!requireAuth && isAuthenticated && location.pathname === '/auth') {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate, requireAuth]);

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthWrapper;