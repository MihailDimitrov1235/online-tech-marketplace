import { Navigate } from 'react-router';
import { useAppSelector } from '@/store/hooks';
import { paths } from '@/router';

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { user, status } = useAppSelector((state) => state.auth);

  if (status === 'loading' || status === 'idle') return <div>Loading...</div>;

  if (!user) return <Navigate to={paths.auth.login} replace />;

  return <>{children}</>;
}
