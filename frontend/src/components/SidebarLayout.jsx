import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QRCodeGenerator from './QRCodeGenerator';

function SidebarLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profileId, setProfileId] = useState(null);
  const [doctorName, setDoctorName] = useState('');
  const [isDoctor, setIsDoctor] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const role = localStorage.getItem('userRole');
  
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const path = pathParts[1];
    const id = pathParts[2];
    
    if (path === 'profile') {
      setActiveTab('profile');
    } else if (path === 'dashboard') {
      setActiveTab('dashboard');
    }
    
    if (id) {
      setProfileId(id);
      const fetchProfileName = async () => {
        try {
          const token = localStorage.getItem('accessToken');
          if (role === 'doctor') {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/doctors/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
              const data = await response.json();
              setDoctorName(data.name);
              setIsDoctor(true);
            }
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };
      fetchProfileName();
    }
  }, [location, role]);

  const handleTabClick = (tab) => {
    if (tab === 'dashboard') {
      navigate(`/dashboard/${profileId}`);
    } else if (tab === 'profile') {
      navigate(`/profile/${profileId}`);
    } else if (tab === 'edit') {
      if (role === 'doctor') {
        navigate(`/edit-doctor/${profileId}`);
      } else {
        navigate(`/register?id=${profileId}`);
      }
    } else if (tab === 'qrcode') {
      setShowQRCode(!showQRCode);
    } else if (tab === 'delete') {
      const confirmDelete = window.confirm('Are you sure you want to delete your profile?');
      if (confirmDelete) {
        // Logic to delete profile
        console.log('Delete profile:', profileId);
      }
    }
    
    if (tab !== 'qrcode') {
      setActiveTab(tab);
    }
  };

  const publicProfileUrl = isDoctor ? `${window.location.origin}/doctors/${profileId}` : '';

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 lg:w-1/5">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Profile Menu</h3>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleTabClick('dashboard')}
                className={`p-2 rounded-md text-left ${
                  activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleTabClick('profile')}
                className={`p-2 rounded-md text-left ${
                  activeTab === 'profile' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => handleTabClick('edit')}
                className={`p-2 rounded-md text-left ${
                  activeTab === 'edit' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                Edit Profile
              </button>
              {isDoctor && (
                <button
                  onClick={() => handleTabClick('qrcode')}
                  className={`p-2 rounded-md text-left ${
                    showQRCode ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
              )}
              <button
                onClick={() => handleTabClick('delete')}
                className="p-2 rounded-md text-left text-red-500 hover:bg-red-50"
              >
                Delete Profile
              </button>
            </div>
          </div>
          
          {isDoctor && showQRCode && (
            <div className="mt-4">
              <QRCodeGenerator 
                url={publicProfileUrl} 
                doctorName={doctorName}
              />
            </div>
          )}
        </div>
        
        <div className="md:w-3/4 lg:w-4/5">
          <div className="bg-white p-6 rounded-lg shadow-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarLayout; 