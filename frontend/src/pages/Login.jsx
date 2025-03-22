import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

function Login({ role }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      console.log('Attempting login with:', { email: formData.email, role });
      
      const endpoint = '/api/auth/login';
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      console.log('Login successful, tokens received:', response.data);
      
      // Store tokens and role
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('userId', response.data.userId);

      // Check if the user has a profile based on role
      const token = response.data.accessToken;
      const userRole = response.data.role;
      
      try {
        const userResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Make sure we're using the correct ID property
        const userId = userResponse.data._id || userResponse.data.id || response.data.userId;
        console.log(`User ID retrieved for profile check:`, userId);

        // Check for profile based on role from response
        if (userRole === 'doctor') {
          try {
            console.log('Fetching doctor profile for user ID:', userId);
            const profileResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/doctors/by-user/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            
            if (profileResponse.data) {
              console.log('Doctor profile found, redirecting to profile:', profileResponse.data._id);
              navigate(`/profile/${profileResponse.data._id}`);
              return;
            } else {
              console.log('No doctor profile found, redirecting to form');
              navigate('/register');
              return;
            }
          } catch (err) {
            console.log('Error fetching doctor profile:', err.response?.status);
            if (err.response?.status === 404) {
              navigate('/register');
              return;
            } else {
              throw err;
            }
          }
        } else if (userRole === 'user') {
          try {
            console.log('Fetching user profile');
            const profileResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            
            if (profileResponse.data) {
              console.log('User profile found, redirecting to profile:', profileResponse.data._id);
              navigate(`/profile/${profileResponse.data._id}`);
              return;
            } else {
              console.log('No user profile found, redirecting to form');
              navigate('/register');
              return;
            }
          } catch (err) {
            console.log('Error fetching user profile:', err.response?.status);
            if (err.response?.status === 404) {
              navigate('/register');
              return;
            } else {
              throw err;
            }
          }
        }
      } catch (error) {
        console.error('Error after login:', error);
        // Even if there's an error checking the profile, the user is still logged in
        navigate('/');
      }
    } catch (error) {
      console.error(`${role} login error:`, error.response?.data || error.message);
      setError(error.response?.data?.message || `Login failed. Please check your credentials.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      {isLoading && <Loader text="Logging in..." />}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{`${role.charAt(0).toUpperCase() + role.slice(1)} Login`}</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            'Login'
          )}
        </button>
        <p className="mt-2 text-center">
          <a href="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</a>
        </p>
        <p className="mt-2 text-center">
          Don't have an account? <a href={`/${role}/signup`} className="text-blue-500 hover:underline">Signup</a>
        </p>
      </form>
    </div>
  );
}

export default Login;