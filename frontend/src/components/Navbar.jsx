import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('accessToken');
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileId, setProfileId] = useState(null); // Store profile ID for linking

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('accessToken');
      const checkUserAndProfile = async () => {
        try {
          const userResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const role = userResponse.data.role;
          setUserRole(role);
          localStorage.setItem('userRole', role); // Store role for routing
          
          // Make sure we're using the correct ID property
          const userId = userResponse.data._id || userResponse.data.id;
          console.log('User ID and role retrieved:', userId, role); // Debug

          if (role === 'doctor') {
            try {
              console.log('Fetching doctor profile for user ID:', userId); // Debug
              const doctorResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/doctors/by-user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setHasProfile(true);
              setProfileId(doctorResponse.data._id);
              console.log('Doctor profile found, setting profile ID:', doctorResponse.data._id); // Debug
            } catch (error) {
              if (error.response?.status === 404) {
                setHasProfile(false);
                setProfileId(null);
                console.log('No doctor profile found (404)'); // Debug
              } else {
                throw error;
              }
            }
          } else if (role === 'user') {
            const userProfileResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (userProfileResponse.data) {
              setHasProfile(true);
              setProfileId(userProfileResponse.data._id);
              console.log('User profile found, setting profile ID:', userProfileResponse.data._id); // Debug
            } else {
              setHasProfile(false);
              setProfileId(null);
              console.log('No user profile found for user'); // Debug
            }
          }
        } catch (error) {
          console.error('Error checking user and profile:', error.response?.data || error.message); // Debug
          if (error.response?.status === 404) {
            setHasProfile(false);
            setProfileId(null);
            console.log('No profile found (404), setting no profile'); // Debug
          }
        }
      };
      checkUserAndProfile();
    } else {
      setUserRole(null);
      setHasProfile(false);
      setProfileId(null);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    setUserRole(null);
    setHasProfile(false);
    setProfileId(null);
    setShowProfileDropdown(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    if (hasProfile) {
      navigate(`/${userRole === 'doctor' ? 'profile' : 'profile'}/${profileId}`);
    } else {
      navigate(`/${userRole === 'doctor' ? 'register' : 'register'}`);
    }
    setShowProfileDropdown(false);
  };

  const handleLoginClick = (role) => {
    setShowLoginDropdown(false);
    navigate(`/${role}/login`);
  };

  return (
    <nav className="bg-white shadow-md p-4 text-black text-10px">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Doctor App</Link>
        <div className="flex space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/all-doctors" className="hover:underline">All Doctors</Link>
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                aria-label="User menu"
                
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
  <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                </svg>
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg z-10">
                  <button
                    onClick={handleProfileClick}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                className=" px-2  rounded  hover:underline"
              >
                Login
              </button>
              {showLoginDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg z-10">
                  <button
                    onClick={() => handleLoginClick('doctor')}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Doctor Login
                  </button>
                  <button
                    onClick={() => handleLoginClick('user')}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    User Login
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
