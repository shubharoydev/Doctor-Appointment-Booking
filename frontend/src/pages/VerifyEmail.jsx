import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

function VerifyEmail() {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  useEffect(() => {
    if (!userId) {
      navigate('/');
    }
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-email`, {
        userId,
        code: verificationCode
      });
      setIsVerified(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError('');

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/resend-verification`, {
        userId
      });
      setError('Verification code resent successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend verification code');
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId) {
    return <div className="text-center py-8">Invalid verification link</div>;
  }

  return (
    <div className="container mx-auto py-8">
      {isLoading && <Loader text="Verifying email..." />}
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify Your Email</h2>
        
        {isVerified ? (
          <div className="text-center">
            <div className="text-green-500 text-4xl mb-4">✓</div>
            <p className="text-gray-700 mb-4">Your email has been verified successfully!</p>
            <button
              onClick={() => navigate('/user/login')}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Proceed to Login
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className={`mb-4 p-3 rounded ${
                error.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Enter Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-800 disabled:text-blue-400"
              >
                Resend Verification Code
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;