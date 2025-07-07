import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DoctorForm from './components/DoctorForm';
import DoctorProfile from './pages/DoctorProfile';
import DoctorDashboard from './pages/DoctorDashboard';
import UserForm from './components/UserForm';
import UserProfile from './pages/UserProfile';
import UserDashboard from './pages/UserDashboard';
import Home from './pages/Home';
import AllDoctors from './pages/AllDoctors';
import AppointmentBooking from './pages/AppointmentBooking';
import DoctorPublicProfile from './pages/DoctorPublicProfile';
import Footer from './pages/Footer';
import About from './pages/About';
import Contact from './pages/Contact';
import NotAvailable from './pages/NotAvailable';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [userId, setUserId] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      const token = localStorage.getItem('accessToken');
      const role = localStorage.getItem('userRole');
      //console.log('Checking authentication:', { token, role, path: window.location.pathname }); // Log routing
      if (token && role) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const user = response.data;
         // console.log('User data fetched:', user);

          const userId = user._id || user.id;
          setUserId(userId);
          setUserRole(role);
          setIsAuthenticated(true);

          if (role === 'doctor') {
            try {
             // console.log('Fetching doctor profile for user ID:', userId);
              const doctorResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/doctors/by-user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              // console.log('Doctor profile exists:', doctorResponse.data);
              setHasProfile(true);
            } catch (err) {
              console.log('No doctor profile found:', err.response?.data || err.message);
              setHasProfile(false);
              if (window.location.pathname === '/profile') {
                navigate('/register');
              }
            }
          } else if (role === 'user') {
            try {
              //console.log('Fetching user profile for user ID:', userId);
              const userProfileResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              //console.log('User profile exists:', userProfileResponse.data);
              setHasProfile(true);
            } catch (err) {
              console.log('No user profile found:', err.response?.data || err.message);
              setHasProfile(false);
              if (window.location.pathname === '/profile') {
                navigate('/register');
              }
            }
          }
        } catch (error) {
          console.error('Auth check error:', error.response?.data || error.message);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userRole');
          setIsAuthenticated(false);
          setUserRole(null);
          setHasProfile(false);
        }
      }
    };

    checkProfile();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path="/all-doctors" element={<AllDoctors />} />
        <Route path="/doctors/:id" element={<DoctorPublicProfile />} />
        <Route path="/appointment/:id" element={<AppointmentBooking />} />
        <Route path="/doctor/signup" element={<Signup role="doctor" />} />
        <Route path="/user/signup" element={<Signup role="user" />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/doctor/login" element={<Login role="doctor" />} />
        <Route path="/user/login" element={<Login role="user" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/not-available" element={<NotAvailable />} />
        <Route
          path="/register"
          element={
            isAuthenticated
              ? userRole === 'doctor'
                ? hasProfile && !window.location.search.includes('id=')
                  ? <Navigate to={`/profile/${userId}`} />
                  : <DoctorForm />
                : <UserForm />
              : <Navigate to={userRole === 'doctor' ? '/doctor/login' : '/user/login'} />
          }
        />
        <Route
          path="/edit-doctor/:id"
          element={
            isAuthenticated && userRole === 'doctor'
              ? <DoctorForm />
              : <Navigate to="/doctor/login" />
          }
        />
        <Route
          path="/profile/:id"
          element={
            isAuthenticated
              ? userRole === 'doctor'
                ? hasProfile
                  ? <DoctorProfile />
                  : <Navigate to="/register" />
                : <UserProfile />
              : <Navigate to={userRole === 'doctor' ? '/doctor/login' : '/user/login'} />
          }
        />
        <Route
          path="/dashboard/:id"
          element={
            isAuthenticated
              ? userRole === 'doctor'
                ? hasProfile
                  ? <DoctorDashboard />
                  : <Navigate to="/register" />
                : <UserDashboard />
              : <Navigate to={userRole === 'doctor' ? '/doctor/login' : '/user/login'} />
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;