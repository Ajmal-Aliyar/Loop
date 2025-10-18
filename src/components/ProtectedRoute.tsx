import AuthWrapper from './AuthWrapper';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  return (
    <AuthWrapper requireAuth>
      {children}
    </AuthWrapper>
  );
};

export default ProtectedRoute;