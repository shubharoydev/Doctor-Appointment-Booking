import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png'; 

function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('accessToken');
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('accessToken');
      const checkUserAndProfile = async () => {
        try {
          const userResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          //console.log('User API response:', userResponse.data); // Added response log
          const role = userResponse.data.role;
          setUserRole(role);
          localStorage.setItem('userRole', role);
          const userId = userResponse.data._id || userResponse.data.id;

          if (role === 'doctor') {
            try {
              const doctorResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/doctors/by-user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              //console.log('Doctor profile API response:', doctorResponse.data); // Added response log
              setHasProfile(true);
              setProfileId(doctorResponse.data._id);
            } catch (error) {
              console.error('Error fetching doctor profile:', error); // Existing error log
              if (error.response?.status === 404) setHasProfile(false);
              else throw error;
            }
          } else if (role === 'user') {
            const userProfileResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
              headers: { Authorization: `Bearer ${token}` },
            });
           // console.log('User profile API response:', userProfileResponse.data); // Added response log
            if (userProfileResponse.data) {
              setHasProfile(true);
              setProfileId(userProfileResponse.data._id);
            } else {
              setHasProfile(false);
            }
          }
        } catch (error) {
          console.error('Error checking user and profile:', error); // Existing error log
          if (error.response?.status === 404) setHasProfile(false);
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
    <nav className="bg-white shadow-md p-4 text-black">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
      <Link to="/" className="text-xl font-bold flex items-center space-x-2">
      <img src={logo} alt="Logo" className="h-12 w-35" />
      </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/all-doctors" className="hover:underline">All Doctors</Link>
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                aria-label="User menu"
                className="focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
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
                className="px-2 rounded hover:underline"
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
        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          {isAuthenticated ? (
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              aria-label="User menu"
              className="focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => setShowLoginDropdown(!showLoginDropdown)}
              className="text-sm hover:underline"
            >
              Login
            </button>
          )}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle mobile menu"
            className="focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h celular16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="md:hidden bg-white shadow-md">
          <div className="container mx-auto py-4 flex flex-col space-y-4">
            <Link to="/" className="hover:underline px-4" onClick={() => setShowMobileMenu(false)}>Home</Link>
            <Link to="/all-doctors" className="hover:underline px-4" onClick={() => setShowMobileMenu(false)}>All Doctors</Link>
            <Link to="/about" className="hover:underline px-4" onClick={() => setShowMobileMenu(false)}>About</Link>
            <Link to="/contact" className="hover:underline px-4" onClick={() => setShowMobileMenu(false)}>Contact</Link>
          </div>
        </div>
      )}
      {/* Mobile Profile/Login Dropdown */}
      {(showLoginDropdown || showProfileDropdown) && (
        <div className="md:hidden absolute right-4 top-16 w-48 bg-white text-gray-800 rounded-md shadow-lg z-10">
          {isAuthenticated && showProfileDropdown ? (
            <>
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
            </>
          ) : showLoginDropdown && (
            <>
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
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;