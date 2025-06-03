import { TokenVerification } from '@/apiService/AdminHandler';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from './Loader';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Your Session is Expired, Kindly login again!');
        setIsAuthenticated(false);
        navigate('/admin');
        return;
      }
      try {
        const isValidUser = await TokenVerification();
        setIsAuthenticated(isValidUser);
        if (!isValidUser) {
          navigate('/admin');
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setIsAuthenticated(false);
        navigate('/admin');
      }
    };

    verifyToken();
  }, [navigate]);

  if (isAuthenticated === null) {
    return <Loader />; // Display loading while verifying token
  }

  return isAuthenticated ? children : <Navigate to="/admin" />;
};

export default PrivateRoute;