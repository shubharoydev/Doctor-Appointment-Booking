import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

function Signup({ role }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', code: role === 'doctor' ? '' : undefined });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const endpoint = role === 'doctor' ? '/api/auth/doctor/signup' : '/api/auth/user/signup';
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      navigate('/verify-email', { state: { userId: response.data.userId } });
    } catch (error) {
      console.error(`${role} signup error:`, error.response?.data || error.message);
      setError(error.response?.data?.message || `${role.charAt(0).toUpperCase() + role.slice(1)} signup failed`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      {isLoading && <Loader text="Creating account..." />}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{`${role.charAt(0).toUpperCase() + role.slice(1)} Signup`}</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
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
        {role === 'doctor' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Code (Enter 123)</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}
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
            'Sign Up'
          )}
        </button>
        <p className="mt-2 text-center">
          Already have an account? <a href={`/${role}/login`} className="text-blue-500 hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Signup;