import { Navigate } from 'react-router';
import { useAppSelector } from '@/store/hooks';

type Props = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const { user, status } = useAppSelector((state) => state.auth);

  if (status === 'loading' || status === 'idle') return null;

  if (user) return <Navigate to="/" replace />;

  return <>{children}</>;
}
