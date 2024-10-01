// hooks/useAuth.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`http://192.168.10.30:5000/api/verify-token`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status !== 200) {
          throw new Error('Token invalid');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);
};

export default useAuth;