import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTaskStore } from '@/store/taskStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const {
    setUserId,
    loadUserData,
    userId,
    syncAvatarFromAuth,
    isSynced,
    _hasHydrated,
  } = useTaskStore();

  useEffect(() => {
    if (!_hasHydrated || loading) return;

    const syncUserState = async () => {
      if (user) {
        if (user.uid !== userId) {
          setUserId(user.uid);
        }
        await syncAvatarFromAuth(user);
      } else if (!user && userId) {
        setUserId(null);
      }
    };

    syncUserState();
  }, [user, userId, _hasHydrated, loading, setUserId, syncAvatarFromAuth]);

  useEffect(() => {
    if (!_hasHydrated || loading) return;

    if (user && userId && !isSynced) {
      loadUserData(userId);
    }
  }, [user, userId, isSynced, _hasHydrated, loading, loadUserData]);

  // If loading or hydrating, we still render children (which should handle their own skeleton states)
  // instead of a full screen loader.
  // We only redirect if we are sure there is no user (loading is false).
  if (!loading && _hasHydrated && !user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
